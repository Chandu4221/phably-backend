const User = require('../../models/user')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const RecipeStep = require("../../models/recipeStep")
const Recipe = require("../../models/recipe")
const Ingredient = require("../../models/ingredients");
const RecipeComment = require("../../models/recipeComment")
const { render, param } = require('../../app');
module.exports = (function () {
    /**
     * @params request, response
     * @For creating a new user
     */
    this.createRecipe = async ({ body,decoded,files }) => {
        const {recipeName,serves,cookTime,prepTime} = body;
        const {recipeMedia} = files
        const userId = decoded._id

        let newRecipe = new Recipe({
          recipeName,
          serves,
          cookTime,
          prepTime,
          recipeMedia:[],
          createdByUser:decoded._id
        })

        if(recipeMedia){
          if(recipeMedia.length > 1){
              let response = await ImageMultipleUpdate(recipeMedia)
              response.forEach(element => {
                newRecipe.recipeMedia.push({
                  recipeMediaUrl:element[0],
                  recipeMediaType:element[1],
                })
              });
          }else{
            let response = await ImageUpload(recipeMedia)
            newRecipe.recipeMedia.push(
              {
                recipeMediaUrl:response.Location,
                recipeMediaType:getExtensions(recipeMedia.originalFilename)[1],
              }
            )
          }
        }

        await newRecipe.save();
        return {data:{newRecipe}}
    };


    this.getAllRecipes = async({decoded,query}) => {
      const {page} = query
      var limit = parseInt(10);
      var skip = (parseInt(page)-1) * parseInt(limit);
      let AllReceipt = await Recipe.find({createdByUser:decoded._id}).populate('recipeStep').populate('ingredients').skip(skip).limit(limit)
      return {data:{AllReceipt}}
    }

    this.updateRecipe = async ({params,body}) => {

      const {recipeId} = params;
      const {recipeName,serves,cookTime,prepTime} = body;

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
      const getUpdatedRecipe = await Recipe.findById(recipeId)
      return {data:{"recipe":getUpdatedRecipe}}
    }
    this.createIngredient = async ({ params,body}) => {
       //get all the params for insert of ingredient
        const {ingredientName,ingredientQuality,ingredientMeasure,ingredientId} = body;
        const {recipeId} = params;

        //check if params is valid
        if(!ingredientName || !ingredientQuality || !ingredientMeasure){
          throw new Error("Invalid Parameters:ingredientName,ingredientQuality,ingredientMeasure")
        }

        //check if recipeId is valid
        if(!recipeId){
          throw new Error('Invalid recipeId')
        }

        //check if recipe is valid
        const recipe = await Recipe.findById(recipeId).select('ingredients')
        if(!recipe){
          throw new Error("Invalid Recipe Id")
        }

        //insert new ingredient
        const newIngredient = await Ingredient.create({
          ingredientName,ingredientQuality,ingredientMeasure
        })

        recipe.ingredients.push(newIngredient._id)
        await recipe.save();

        const getAllIngredientRecipes = await Recipe.findById(recipeId).select('ingredients').populate('ingredients')
        return {data:{getAllIngredientRecipes}}
    }

    this.createProcedure = async ({params,body,decoded}) => {
      const {procedureTitle,procedureDetails} = body
      const userId = decoded._id
      const {recipeId} = params

      if(!procedureDetails || !procedureTitle || !userId || !recipeId) {
        throw new Error('Validation Error: procedureTitle, procedureDetails, recipeId')
      }

      //check if recipe exists
      const recipe = await Recipe.findById(recipeId)
      if(!recipe) {
        throw new Error('Recipe not found')
      }

      //create new step instance
      const newStep = new RecipeStep({
        procedureTitle,procedureDetails,createdByUser:userId,
      })
      await newStep.save();

      //store new step._id to recipe
      recipe.recipeStep.push(newStep._id)
      await recipe.save();

      //get All steps from recipe
      const getAllSteps = await Recipe.findById(recipeId).select('recipeStep').populate('recipeStep')
      return {data:{getAllSteps}}
    }
    this.updateProcedure = async({params,body}) => {
      //get the varibles
      const {procedureId,procedureTitle,procedureDetails} = body
      const {recipeId} = params
      if(!procedureId || !procedureTitle || !procedureDetails || !recipeId){
        throw new Error('Invalid parameters, procedureId,procedureTitle,procedureDetails,recipeId require')
      }

      //update the procedure or step
      const procedure = await RecipeStep.findById(procedureId)
      procedure.procedureTitle = procedureTitle
      procedure.procedureDetails = procedureDetails
      procedure.save()

      const getAllSteps = await Recipe.findById(recipeId).select('recipeStep').populate('recipeStep')
      return {data:{getAllSteps}}
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
    this.updateIngredient = async ({params,body}) => {
      const {recipeId} = params
      const {ingredientId,ingredientName,ingredientQuality,ingredientMeasure} = body
      if(!ingredientId || !ingredientName || !ingredientQuality || !ingredientMeasure){
        throw new Error("Validation Error: ingredientId,ingredientName,ingredientQuality,ingredientMeasure required")
      }

      const updateIngredient = await Ingredient.findById(ingredientId)
      updateIngredient.ingredientName = ingredientName
      updateIngredient.ingredientQuality = ingredientQuality
      updateIngredient.ingredientMeasure = ingredientMeasure
      updateIngredient.save()

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