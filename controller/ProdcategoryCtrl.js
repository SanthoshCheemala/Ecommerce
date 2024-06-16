import AsyncHandler from 'express-async-handler'
import {Category} from '../models/ProdcategoryModel.js'
import { validateMongoDbId } from '../utils/validateMongodbid.js'

export const createCategory = AsyncHandler(async (req,res)=>{
    try {
        const NewCat = await Category.create(req.body)
        res.json(NewCat)
    } catch (error) {
        throw new Error(error)
    }
})


export const updateCategory = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const upCat = await Category.findByIdAndUpdate(id,req.body,{
            new:true
        })
        res.json(upCat)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteCategory = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const upCat = await Category.findByIdAndDelete(id)
        res.json(upCat)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetCategory = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id);
    try {
        const Cat = await Category.findById(id)
        res.json(Cat)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetallCategory = AsyncHandler(async (req,res)=>{

    try {
        const Cat = await Category.find()
        res.json(Cat)
    } catch (error) {
        throw new Error(error)
    }
})