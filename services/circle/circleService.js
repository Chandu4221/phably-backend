const User = require('../../models/user');
const Circle = require('../../models/circle');
var mongoose = require('mongoose');


module.exports = (function () {

    /**
     * @params  decoded
     * @For fetch all circle where user is added
     */
    this.fetchCircles = async({decoded,query}) => {
        //get userId from auth token
        const userId = decoded._id;
        const {page} = query


        var limit = parseInt(process.env.PAGE_COUNT || 10);
        var skip = (parseInt(page)-1) * parseInt(limit);

        //check if that user is avaible
        const user = await User.findById(userId).populate('circles','circleImage circleDescription circleName adminId').skip(skip).limit(limit);

        //if not throw Error
        if(!user) throw new Error('User not found')

        //get all the circles from mongo
        const userCircles = user.circles
        return {data:{userCircles}}
    }
    /**
     * @params body, decoded
     * @For create circle 
     */
    this.createCircle = async ({body,decoded,files}) => {

        //get circleName, and circleDescription from body.
        const {circleName,circleDescription} = body;
        //get user id, adminID from auth token
        const adminId = decoded._id;

        if(! body.friendIds){
            throw new Error("Invalid Parameter: friendIds")
        }
        //fetch string of firendIds to ObjectIds
        const friendIds = body.friendIds.split(",").map(eachId => mongoose.Types.ObjectId(eachId))
        
        //get the circleImage from files
        const {circleImage} = files;
        if(!circleName || !friendIds)
        {
            throw new Error('Validation Error')
        }

        //check if user admin is avaible
        const user = await User.findById(adminId)
        if(!user)
        {
            throw new Error('Cannot Found User')
        }

        //create new circle in system
        const newCircle = new Circle({
            circleName,
            circleMembersId:friendIds,
            adminId,
            circleDescription
        })
        newCircle.circleMembersId.push(adminId)

        //if image is avaible than upload to aws and save to instanceof Circle
        if(circleImage){
            const awsData = await ImageUpload(circleImage)
            newCircle.circleImage = awsData.Location
        }


        //save the circle instance to mongodb
        await newCircle.save();


        //add circle id in admin collection
        if(user.circles.length == 0){
            //if circle is empty than push
            await user.circles.push(newCircle._id)
        }else{
            //if circle is avaible than add to set
            await user.updateOne({$addToSet:{'circles':newCircle._id}})
        }

        //add the user that created the group
        // await user.circles.push(adminId)
        await user.save();

        //update all the firend ids, with the circle id
        console.log(await User.find({_id:friendIds}).updateMany({$addToSet:{'circles':newCircle._id}}))

        return {data:{newCircle,"message":"New Circle Created"}}
    }

     /**
     * @params body, decoded
     * @For update circle 
     */
    this.updateCircle = async ({body,decoded,files}) => {

        //get circleName, and circleDescription from body.
        const {circleName,circleDescription,circleId,friendIds} = body;
        //get the circleImage from files
        const {circleImage} = files
        const adminId = decoded._id;

        if(!circleId || !adminId){
            throw new Error("Invalid Parameter: circleId")
        }
        
        //check if user admin is avaible
        const user = await User.findById(adminId)
        if(!user)
        {
            throw new Error('Cannot Found User')
        }

        // get the circle Id
        const circle  = await Circle.findById(circleId)
        
        if(!circle)
        {
            throw new Error('Cannot Find Circle with id')
        }

        if(circle.adminId.toString() !== adminId.toString()){
            throw new Error('User is not admin group')
        }

        if(friendIds){
            //fetch string of firendIds to ObjectIds
            const friendIds = body.friendIds.split(",").map(eachId => mongoose.Types.ObjectId(eachId))
            circle.friendIds = friendIds
        }

        if(circleName){
            circle.circleName = circleName
        }
        if(circleDescription){
            circle.circleDescription = circleDescription
        }
        if(circleImage){
            const awsData = await ImageUpload(circleImage)
            circle.circleImage = awsData.Location
        }




        //create new circle in system
        // const newCircle = new Circle({
        //     circleName,
        //     circleMembersId:friendIds,
        //     adminId,
        //     circleDescription
        // })
        // newCircle.circleMembersId.push(adminId)

        //if image is avaible than upload to aws and save to instanceof Circle
        


        //save the circle instance to mongodb
        await circle.save();


        //add circle id in admin collection
        // if(user.circles.length == 0){
        //     //if circle is empty than push
        //     await user.circles.push(newCircle._id)
        // }else{
        //     //if circle is avaible than add to set
        //     await user.updateOne({$addToSet:{'circles':newCircle._id}})
        // }

        //add the user that created the group
        // await user.circles.push(adminId)
        // await user.save();

        //update all the firend ids, with the circle id
        // console.log(await User.find({_id:friendIds}).updateMany({$addToSet:{'circles':newCircle._id}}))

        return {data:{circle,"message":"Circle Updated"}}
    }

    this.deleteCircle = async ({params,decoded}) => {
        // get the varibles 
        const {circleId} = params;
        const adminId = decoded._id;
        // get the circle Id
        const circle  = await Circle.findById(circleId)
        
        if(!circle)
        {
            throw new Error('Cannot Find Circle with id')
        }
        
        if(circle.adminId.toString() !== adminId.toString()){
            throw new Error('User is not admin group')
        }

        circle.circleMembersId.forEach(async userId => {
            let circleMember = await User.findByIdAndUpdate({'_id':userId},{ $pull: { "circles": circle._id }})
        })

        let circleDelete = await circle.delete();
        if(circleDelete == null){
            throw new Error("Circle Delete failed")
        }
        return {data:{"message":"Circle Delete successfull"}}
    }

    return this;
})();