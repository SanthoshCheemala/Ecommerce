import AsyncHandler from 'express-async-handler'
import { validateMongoDbId } from '../utils/validateMongodbid.js'
import { Brand } from '../models/brandModel.js'

export const createBrand = AsyncHandler(async (req,res)=>{
    try {
        const NewCat = await Brand.create(req.body)
        res.json(NewCat)
    } catch (error) {
        throw new Error(error)
    }
})


export const updateBrand = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const upCat = await Brand.findByIdAndUpdate(id,req.body,{
            new:true
        })
        res.json(upCat)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteBrand = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const upCat = await Brand.findByIdAndDelete(id)
        res.json(upCat)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetBrand = AsyncHandler(async (req,res)=>{
    const { id } = req.params
    validateMongoDbId(id);
    try {
        const Cat = await Brand.findById(id)
        res.json(Cat)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetallBrand = AsyncHandler(async (req,res)=>{

    try {
        const Cat = await Brand.find()
        res.json(Cat)
    } catch (error) {
        throw new Error(error)
    }
})