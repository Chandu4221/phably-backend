const bcrypt = require('bcrypt')
const Admin = require('../../models/admin')
const User = require('../../models/user')
const Recipe = require('../../models/recipe')
const RecipeComment = require('../../models/recipeComment')

const jwt = require("jsonwebtoken");
module.exports = (function () {

    this.loginAdmin = async({body}) =>{
        // get all the varibles
        const {email,password} = body
        console.log(email,body)

        //get the admin by email
        const checkAdmin = await Admin.findOne({adminEmail:email})
        console.log(body)
        console.log(checkAdmin)
        if (!checkAdmin || !bcrypt.compareSync(password, checkAdmin.hash)) {
            throw new Error("Invalid email or password")
        }

        const token = jwt.sign({ _id: checkAdmin._id }, process.env.LOGIN_ADMIN_SECRETE, {
            expiresIn: "3649635 days"
          });
        
        await checkAdmin.updateOne({loginToken:token})
        const admin = await Admin.findById(checkAdmin._id)
        return {data:{admin,token}}
    }
    /**
     * @For get users all users for admin
     */
    this.getUsers = async({query,body}) => {
        const {page} = query
        const limit = parseInt(query.limit) || parseInt(process.env.ADMIN_PAGE_COUNT)
        var skip = (parseInt(page)-1) * parseInt(limit);

        const users = await User.aggregate([ 
            {
                "$project": {
                    "favorite_size": { "$size": "$favoriteRecipes" },
                    "name":1,
                    "profilePic":1,
                    "phoneNumber":1,
                    "email":1,
                    "userBlocked":1,
                    // "friends_size":{ "$size": "$friends" },
                    // "circles_size":{ "$size": "$circle"}
                }
            }
        ]
        ).skip(skip).limit(limit)
        return {data:{users}}
    }

    /**
     * @For update block/unblock status for user
     */
    this.updateBlockUser = async({body}) =>{
        // get varibles
        const {userId,status} = body

        if(!userId || status == ""){
            throw new Error("Invalid Parameter: userId,status required") 
        }
        // get the user
        const user = await User.findById(userId)
        if(!user){
            throw new Error("Cannot find user with id " + userId)
        }
        user.userBlocked = status
        user.save()
        return {data:{message:"User Updated"}}
    }

    
    /**
     * @For get all recipes
     */
    this.getRecipes = async({query}) => {
        const {page} = query
        const limit = parseInt(query.limit) || parseInt(process.env.ADMIN_PAGE_COUNT)
        var skip = (parseInt(page)-1) * parseInt(limit);

        const recipe = await Recipe.aggregate([ 
            
            { $lookup: {from: 'users',localField: 'createdByUser', foreignField: '_id', as: 'createByUser'} },
            {
                "$project": {
                    "ingredients_size": { "$size": "$ingredients" },
                    "recipeStep_size": { "$size": "$recipeStep" },
                    "recipeName":1,
                    "serves":1,
                    "cookTime":1,
                    "prepTime":1,
                    "recipeBlocked":1,
                    "createdByUser":1,
                    "createByUser.name":1,
                    "createByUser.profilePic":1,

                },
            },
        ]
        ).skip(skip).limit(limit)
        return {data:{recipe}}
    }

     /**
     * @For get individual recipe information
     */
    this.getIndividualRecipe = async ({params}) => {
        // get all varibles
        const {recipeId} = params
        if(!recipeId){
            throw new Error("Recipe Id is required")
        }
        //get the recip instance
        const recipe = await Recipe.findById(recipeId).populate('ingredients').populate('recipeStep')

        //check if the recipe is available
        if(!recipe){
            throw new Error("Cannot Find recipeId")
        }

        return {data:{recipe}}
    }


    this.getRecipeComments = async({query,params}) => {
        // get varibles
        const {recipeId} = params
        const {page} = query

        
        // check if varibles are correct
        if(!recipeId){
            throw Error("Cannot Found recipeId")
        }

        // get the recipe
        const recipe = await Recipe.findById(recipeId).select('recipeComment').populate('recipeComment')
        if(!recipe){
            throw new Error("Cannot Found recipe")
        }
        console.log(recipe)
        const limit = parseInt(query.limit) || parseInt(process.env.ADMIN_PAGE_COUNT)
        var skip = (parseInt(page)-1) * parseInt(limit);

        const comment = await RecipeComment.find({recipeId}).skip(skip).limit(limit)
        return {data:{comment}}
    }

    this.deleteRecipeComment = async ({params}) =>{
        // get varibles
        const {commentId} = params
        if(!commentId){
            throw new Error("Invalid commentId")
        }

        // check if exists
        const recipeComment = await RecipeComment.findById(commentId)
        if(!recipeComment){
            throw new Error("Cannot Found recipeComment with id " + commentId)
        }
        
        const deleteRecipeComment = await recipeComment.delete()
        if(deleteRecipeComment != null){
            throw new Error("Cannot Delete recipeComment")
        }
        return {data:{"message":"Recipe Comment Deleted"}}
    }
    return this;
  })();