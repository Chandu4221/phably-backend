const User = require('../../models/user');
const Circle = require('../../models/circle');
const GroupMessage = require('../../models/groupMessage');
const Message = require('../../models/message');


module.exports = (function () {

    /**
     * @params  body, decoded
     * @For send group message
     */
    this.createMessage = async({body,decoded}) => {
        //get the varibles
        const senderId = decoded._id;
        const {circleId,message} = body;

        //check if the message is empty or not
        if(!message){
            throw new Error("Message is empty")
        }

        //check if the group is avaible are not.
        const circle = await Circle.findById(circleId);
        if(!circle)
        {
            throw new Error("Cannot Found the Circle.")
        }


        //get the user
        const user = await User.findById(senderId)
        if(!user)
        {
            throw new Error("Cannot found the User")
        }

        //check if the user is blocked or not.
        if(user.userBlocked){
            throw new Error("User is blocked by admin.")
        }


        //check if senderId is avaible in circle
        const checkIfUserExistsInGroup = circle.circleMembersId.filter(memberId => memberId == senderId).length
        if(checkIfUserExistsInGroup != 1){
            throw new Error("User is not Exists in group")
        }

        const newgroupMessage = new GroupMessage({
            senderId,
            circleId,
            message
        })

        await newgroupMessage.save()
        return {data:{newgroupMessage,message:"New Group message created."}}
    }

    /**
     * @params  params, decoded
     * @For get groups message by circle id
     */
    this.getMessages = async({params,decoded}) => {
        const {circleId,page} = params
        const circle = await Circle.findById(circleId)
        if(!circle)
        {
            throw new Error("Cannot found the Circle")
        }

        //check if user is avaible in circle
        const checkIfUserExistsInGroup = circle.circleMembersId.filter(memberId => memberId == decoded._id).length
        if(checkIfUserExistsInGroup != 1){
            throw new Error("User is not Exists in group")
        }

        /**
        * pagination info
        */
        const pageNumber = Number.parseInt(page) || 1;
        const pageSize = process.env.pageSize || 10;
        const skipVal = (pageNumber - 1) * pageSize;

        const allMessages = await GroupMessage.find({ circleId }).sort("-updatedAt").skip(skipVal).populate('senderId','name profilePic').limit(10)
        return {data:{allMessages}}
    }

    this.sendIndividualMessage = async({body,decoded}) => {
        //get the user id
        // const senderId = decoded._id
        const {senderId,receiverId,type,message,recipeId} = body
        if(!type) {
            throw new Error("Cannot Found the type of message")
        }

        //get the details for the sender
        const senderDetails = User.findById(senderId)

        //check if sender is avaible
        if(!senderDetails)
        {
            throw new Error("Cannot Found the sender")
        }
        //check if the sender is blocked or not
        if(senderDetails.userBlocked)
        {
            throw new Error("Sender is blocked")
        }


        //get the details for the reciever
        const receiverDetails = User.findById(receiverId)

        //check if sender is avaible
        if(!receiverDetails)
        {
            throw new Error("Cannot Found the sender")
        }
        //check if the sender is blocked or not
        if(receiverDetails.userBlocked)
        {
            throw new Error("Sender is blocked")
        }

        
        if(type == "message")
            var newMessage = new Message({
                senderId,receiverId,type,message
            })
        else
            var newMessage = new Message({
                senderId,receiverId,type,recipeId
            })
        await newMessage.save();
        return {data:{message:"Message saved",newMessage}}
    }


    this.getIndividualMessage = async({params,decoded}) => {
        const {receiverId,page} = params
        
       const pageNumber = Number.parseInt(page) || 1;
       const pageSize = process.env.pageSize || 10;
       const skipVal = (pageNumber - 1) * pageSize;

        /**
        * pagination info
        */
       const allMessages = await Message.find({
        $and: [
            {
                $or: [
                    {
                        'receiverId': receiverId
                    },
                    {
                        'senderId': decoded._id
                    }
                ]
            },
            {
                $or: [
                    {
                        'senderId': decoded._id
                    },
                    {
                        'receiverId': receiverId
                    }
                ]

            }
        ]
        }).sort("-updatedAt").skip(skipVal).populate('recipeId','recipeName').limit(10)

       
        return {data:{allMessages}}
    }
    return this;
})();