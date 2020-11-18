const User = require('../../models/user');
module.exports = (function () {


    this.fetchAllFriends = async ({decoded,query}) => {
        const userId = decoded._id
        if(!userId){
            throw new Error('Cannot fetch userId')
        }
        const {page} = query

        var limit = parseInt(process.env.PAGE_COUNT);
        var skip = (parseInt(page)-1) * parseInt(limit);

        const getAllFetchFriends = await User.findById(userId).select('friends').populate('friends','name _id profilePic').skip(skip).limit(limit)
        return {data:{getAllFetchFriends}}
    }

    /**
     * @params body, decoded
     * @For fetch contacts from Ui and save the friends of User
     */
    this.friendByPhoneNumber = async ({body,decoded}) => {
        const {phoneNumbers} = body;

        if(!phoneNumbers)
        {
            throw new Error('Validation Error: Phone Numbers (Array) is Required')
        }
        
        const session = await User.startSession();
        session.startTransaction();

        const friends = await User.find( { $or:[ {'phoneNumbers':phoneNumbers}, {'loginText':phoneNumbers}]}).select('_id')

        const user = await User.findById(decoded._id)
        if(!user)
        {
            throw new Error('Cannot Found User')
        }

        await user.update({'friends':friends})
        await user.save();

        await session.commitTransaction();
        session.endSession();

        const newFetchUser = await User.findById(decoded._id).select('friends').populate('friends','name _id profilePic')
        const getAllFetchFriends = newFetchUser.friends
        return {data:{getAllFetchFriends}}
    }
    return this;
})();