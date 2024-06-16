import AsyncHandler from 'express-async-handler'
import { validateMongoDbId } from '../utils/validateMongodbid.js'
import { BlogCat } from '../models/blogCatModel.js'

export const createCategory = AsyncHandler(async (req,res)=>{
    try {
        const NewCat = await BlogCat.create(req.body)
        res.json(NewCat)
    } catch (error) {
        throw new Error(error)
    }
})


export const updateCategory = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const upCat = await BlogCat.findByIdAndUpdate(id,req.body,{
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
        const upCat = await BlogCat.findByIdAndDelete(id)
        res.json(upCat)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetCategory = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id);
    try {
        const Cat = await BlogCat.findById(id)
        res.json(Cat)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetallCategory = AsyncHandler(async (req,res)=>{

    try {
        const Cat = await BlogCat.find()
        res.json(Cat)
    } catch (error) {
        throw new Error(error)
    }
})