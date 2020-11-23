const User = require('../../models/user')

const RecipeStep = require("../../models/recipeStep")
const Recipe = require("../../models/recipe")
const Ingredient = require("../../models/ingredients");
const escapeStringRegexp = require('escape-string-regexp');

module.exports = (function () {
    /**
     * @params body, decoded,files
     * @For creating a new recipe
     */
    this.createRecipe = async ({ body,decoded,files }) => {
      //get the varibles
      const {recipeName,serves,servesType,cookTime,prepTime} = body;
      const {recipeMedia} = files

      //check if all varibles are available
      if(!recipeName || !serves || !servesType || !cookTime || !prepTime){
        throw new Error("Recipe validation failed: recipeName: Recipe Name is required, serves: Serves is required, servesType: Serves Type is required, cookTime: Cook Time is required, prepTime: Prepration Time is required")
      }

      const userId = decoded._id

      //create new recipe instance
      let newRecipe = new Recipe({
          recipeName,
          serves,
          servesType,
          cookTime,
          prepTime,
          createdByUser:userId
        })

        //if any media is available than upload to S3
        if(recipeMedia){
          
            let response = await ImageUpload(recipeMedia)
            newRecipe.recipeMedia = 
              {
                recipeMediaUrl:response.Location,
                recipeMediaType:getExtensions(recipeMedia.originalFilename)[1],
              }
        }

        //save the instance to db
        await newRecipe.save();


        // add recipeId to User instance
        const user = await User.findById(userId);
        user.recipes.push(newRecipe._id);
        user.save();

        return {data:{newRecipe}}
    };


    this.getRecipeSuggestions = async({decoded,query}) => {
      // get varibles
      const {q} = query
      const $regex = escapeStringRegexp(q);
      console.log($regex)
      let result = await Recipe.find({recipeName:{$regex}}).select("recipeName recipeMedia")
      return {data:{result}}
    }


    /**
     * @params decoded,query
     * @For get all the current recipes of users
     */
    this.getAllRecipes = async({decoded,query}) => {
      const {page} = query
      const userId = decoded._id
      console.log(query)
      var limit =  parseInt(query.limit) || 10;
      console.log(parseInt(query.limit))
      var skip = (parseInt(page)-1) * parseInt(limit);
      let userRecipes = await User.findById(userId).select('recipes').populate({path:'recipes',select:'recipeName recipeMedia cookTime prepTime', options: {limit: limit, skip: skip}})
      return {data:{userRecipes}}
    }

    /**
     * @params body, decoded,files
     * @For update the receipt
     */
    this.updateRecipe = async ({decoded,body}) => {
      //get all the varibales
      const userId = decoded._id
      const {recipeName,serves,cookTime,prepTime,recipeId} = body;

      // check if recipeId is present
      if(!recipeId || !verifyObjectId(recipeId)){
        throw new Error("Cannot found recipe id in body");
      }
      // check if user owns the recipe id
      const user = await User.findById(userId).select('recipes')

      // check whether user owns the recipe
      if(!user.recipes.includes(recipeId)){
        throw new Error("User does not own recipe id: " + userId)
      }

      const recipe = await Recipe.findById(recipeId)
      if(!recipe){
        throw new Error('Cannot Found Recipe with id ' + recipeId)
      }

      if(recipeName){
        recipe.recipeName = recipeName;
      }
      if(serves){
        recipe.serves = serves;
      }
      if(cookTime){
        recipe.cookTime = cookTime;
      }
      if(prepTime){
        recipe.prepTime = prepTime;
      }
      
      await recipe.save();
      const getUpdatedRecipe = await Recipe.findById(recipeId).populate('ingredients').populate('recipeStep')
      return {data:{"recipe":getUpdatedRecipe}}
    }

    this.createIngredient = async ({body,decoded}) => {
       //get all the params for insert of ingredient
        const {ingredientName,ingredientQuality,ingredientMeasure,recipeId} = body;
        const userId = decoded._id
        //check if params is valid
        if(!ingredientName || !ingredientQuality || !ingredientMeasure){
          throw new Error("Invalid Parameters:ingredientName,ingredientQuality,ingredientMeasure")
        }

        //check if recipeId is valid
        if(!recipeId){
          throw new Error('Invalid recipeId')
        }
        
        const user = await User.findById(userId).select('recipes')
        if(!user.recipes.includes(recipeId)){
          throw new Error("Recipe Dont belongs to user")
        }

        //check if recipe is valid
        const recipe = await Recipe.findById(recipeId).select('ingredients')
        if(!recipe){
          throw new Error("Invalid Recipe Id")
        }

        let ingredientString =  ingredientName+" "+ingredientQuality+" "+ingredientMeasure

        //insert new ingredient
        const newIngredient = await Ingredient.create({
          ingredientName,ingredientQuality,ingredientMeasure,ingredientString
        })

        recipe.ingredients.push(newIngredient._id)
        await recipe.save();

        const getAllIngredientRecipes = await Recipe.findById(recipeId).select('ingredients').populate('ingredients')
        return {data:{getAllIngredientRecipes}}
    }

    this.updateIngredient = async ({decoded,body}) => {
      const userId = decoded._id
      const {ingredientId,ingredientName,ingredientQuality,ingredientMeasure,recipeId} = body
      if(!ingredientId){
        throw new Error("Validation Error: ingredientId,ingredientName,ingredientQuality,ingredientMeasure required")
      }

      const user = await User.findById(userId).select('recipes')
      if(!user.recipes.includes(recipeId)){
        throw new Error("Recipe dont belongs to user")
      }
      const updateIngredient = await Ingredient.findById(ingredientId)
      if(!updateIngredient){
        throw new Errror("Cannot Found the Ingredient")
      }
      if(ingredientName)
        updateIngredient.ingredientName = ingredientName
      if(ingredientQuality)
        updateIngredient.ingredientQuality = ingredientQuality
      if(ingredientMeasure)
        updateIngredient.ingredientMeasure = ingredientMeasure
      
      updateIngredient.ingredientString =  ingredientName+" "+ingredientQuality+" "+ingredientMeasure
      await updateIngredient.save()


      const getAllIngredient = await Recipe.findById(recipeId).select('ingredients').populate('ingredients')
      return {data:{getAllIngredient,"message":"Ingredient Updated"}}
    }
    this.deleteIngredient = async({params}) => {
      //get the varibles
      const {recipeId,ingredientId} = params

      if(!recipeId || !ingredientId){
        throw new Error("Cannot Found recipeId or ingredientId")
      }

      //get the recipe
      const recipe = await Recipe.findById(recipeId)
      if(!recipe){
        throw new Error("Cannot Find recipe")
      }

      if(!recipe.ingredients.includes(ingredientId)){
        throw new Error("Cannot Find Ingredient in recipe")
      }

      //remove ingredient from recipe
      recipe.ingredients.pop(ingredientId)
      await recipe.save();

      //delete the ingerient
      const deleteTheIngredient = await Ingredient.findById(ingredientId).remove()
      if(deleteTheIngredient.deletedCount != 1){
        throw new Error("Error Occur while deleting ingredient")
      }

      const getAllIngredient = await Recipe.findById(recipeId).select('ingredients').populate('ingredients')
      return {data:{getAllIngredient,"message":"Ingredient Deleted"}}
    }

    /**
     * Create the recipeStep for the recipe
    */
    this.createProcedure = async ({body,decoded,files}) => {
      const {stepName,stepIntructions,stepPersonalTouch,recipeId} = body
      
      const userId = decoded._id

      if(!stepName || !stepIntructions || !userId || !recipeId) {
        throw new Error('Validation Error: stepName, stepIntructions, recipeId, userId')
      }

      //check if recipe exists
      const recipe = await Recipe.findById(recipeId)
      if(!recipe) {
        throw new Error('Recipe not found')
      }
      // check if user is exists
      const userRecipes = await User.findById(userId).select('recipes')
      if(!userRecipes.recipes.includes(recipeId)){
        throw new Error('Recipe is not belong to user')
      }
      //create new step instance
      const newStep = new RecipeStep({
        stepName,stepIntructions,stepPersonalTouch,createdByUser:userId,
      })

      // if any media is available than upload to S3
      if(files != undefined){
        const {recipeStepMedia} = files
        if(recipeStepMedia){
          let response = await ImageUpload(recipeStepMedia)
          newStep.recipeStepMedia = 
            {
              recipeStepMediaUrl:response.Location,
              recipeStepMediaType:getExtensions(recipeStepMedia.originalFilename)[1],
            }
        }
      }
      

      await newStep.save();
      //store new step._id to recipe
      recipe.recipeStep.push(newStep._id)
      await recipe.save();

      //get All steps from recipe
      const getAllSteps = await Recipe.findById(recipeId).select('recipeStep').populate('recipeStep')
      return {data:{getAllSteps}}
    }

    /** Get all the recipe steps from recipe */
    this.getAllRecipeSteps = async({params}) => {
      const {recipeId} = params
      if(!recipeId){
        throw new Error("Cannot Found recipeId")
      }
      const recipeSteps = await Recipe.findById(recipeId).select('recipeStep').populate('recipeStep')
      return {data:{recipeSteps}}
    }

    
    /** update the recipe Step given */
    this.updateProcedure = async({decoded,body,files}) => {
      //get the varibles
      const {stepName,stepIntructions,stepPersonalTouch,recipeId,recipeStepId} = body
      const {recipeStepMedia} = files
      const userId = decoded._id

      if(!stepName || !stepIntructions || !userId || !recipeId || !recipeStepId) {
        throw new Error('Validation Error: stepName, stepIntructions, recipeId, userId, recipeStepId')
      }

      // check if user is exists
      const userRecipes = await User.findById(userId).select('recipes')
      if(!userRecipes.recipes.includes(recipeId)){
        throw new Error('Recipe is not belong to user')
      }

      //update the procedure or step
      const procedure = await RecipeStep.findById(recipeStepId)
      if(stepName){
        procedure.stepName = stepName
      }
      if(stepIntructions){
        procedure.stepIntructions = stepIntructions
      }
      if(stepPersonalTouch){
        procedure.stepPersonalTouch = stepPersonalTouch
      }

      //if any media is available than upload to S3
      if(recipeStepMedia){
        let response = await ImageUpload(recipeStepMedia)
        procedure.recipeStepMedia = {
            recipeStepMediaUrl:response.Location,
            recipeStepMediaType:getExtensions(recipeStepMedia.originalFilename)[1],
          }
      }
      //update the recipewith new data
      procedure.save()
      const getAllSteps = await Recipe.findById(recipeId).select('recipeStep').populate('recipeStep')
      return {data:{getAllSteps,"message":"Recipe Step updated successfully"}}
    }
    
    this.deleteProcedure = async({params}) => {
      const {stepId,recipeId} = params
      if(!recipeId || !stepId){
        throw new Error("Invalid Parameters: stepId,recipeId is required")
      }

      //get the recipe
      const recipe = await Recipe.findById(recipeId)
      if(!recipe){
        throw new Error("Cannot Find recipe")
      }

      //check is recipe step is part of recipe
      if(!recipe.recipeStep.includes(stepId)){
        throw new Error("Cannot Find Recipe Step in recipe")
      }

      //remove ingredient from recipe
      recipe.recipeStep.pop(stepId)
      await recipe.save();

      //delete the recipeStep
      const deleteTheRecipeStep = await RecipeStep.findById(stepId).remove()
      if(deleteTheRecipeStep.deletedCount != 1){
        throw new Error("Error Occur while deleting step")
      }

      const getAllIngredient = await Recipe.findById(recipeId).select('recipeStep').populate('recipeStep')
      return {data:{getAllIngredient,"message":"RecipeStep Deleted"}}
    }

    this.getRecipe = async({params}) => {
      //get the recipeId varable
      const {recipeId} = params
      
      if(!recipeId)
        throw new Error('Missing recipeId')
      
      //get the recipe
      const recipe = await Recipe.findById(recipeId).populate('ingredients').populate('recipeStep')
      if(!recipe)
        throw new Error("Cannot find recipe with recipeId")

        return {data:{recipe}}
    }
    

    this.deleteRecipeImage = async({params}) => {
      //get all the varibles
      const {recipeId,recipeImageId} = params

      //check if parameters is valid
      if(!recipeImageId || !recipeId){
        throw new Error("Invalid Parameter: recipeImageId,recipeId")
      }

      //get the recipe instance
      const recipe = await Recipe.findById(recipeId)

      //check if recipe media is available in instance
      if(recipe.recipeMedia.filter(media => media.id == recipeImageId).length == 0)
      {
        throw new Error("Cannot Find Image in Recipe")
      }

      recipe.recipeMedia.pop(recipeImageId)
      await recipe.save();
      const updateRecipeImages = await Recipe.findById(recipeId).select('recipeMedia')
      return {data:{updateRecipeImages,"message":"Recipe Media Deleted"}}
    }

    this.addRecipeImage = async({params,body,files}) => {
      //get all varibles
      const {recipeId} = params
      const {recipeMedia} = files
      //check if parameters is valid
      if(!recipeMedia || !recipeId){
        throw new Error("Invalid Parameter: recipeMedia,recipeId")
      }

      //get the recipe instance
      const recipe = await Recipe.findById(recipeId)

      // if images are avaible than go with loop
      if(recipeMedia){
        //if only one image than upload one
        if(recipeMedia.length > 1){
            let response = await ImageMultipleUpdate(recipeMedia)
            response.forEach(element => {
              recipe.recipeMedia.push({
                recipeMediaUrl:element[0],
                recipeMediaType:element[1],
              })
            });
        }else{
          //if more than one image than upload
          let response = await ImageUpload(recipeMedia)
          recipe.recipeMedia.push(
            {
              recipeMediaUrl:response.Location,
              recipeMediaType:getExtensions(recipeMedia.originalFilename)[1],
            }
          )
        }
      }
      await recipe.save();
      const updateRecipeImages = await Recipe.findById(recipeId).select('recipeMedia')
      return {data:{updateRecipeImages,"message":"Recipe Media updated successfully"}}
    }

    this.getRecipeImage = async({params}) => {
      //get all varibles
      const {recipeId} = params
      //check if parameters is valid
      if(!recipeId){
        throw new Error("Invalid Parameter: recipeId")
      }

      //get the recipe instance
      const recipeMedia = await Recipe.findById(recipeId).select('recipeMedia')
      return {data:{recipeMedia}}
    }
    return this;
  })();