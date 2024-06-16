import AsyncHandler from "express-async-handler";
import { Product } from "../models/ProductModel.js";
import slugify from 'slugify';
import { User } from "../models/userModel.js";
import {cloudinaryUploadImage} from "../utils/cloudinary.js"
export const CreateProduct = AsyncHandler( async (req,res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const NewProduct = await Product.create(req.body)
        res.json(NewProduct)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetaProduct = AsyncHandler (async (req,res)=>{
    const {id} = req.params
    try {
        const findproduct = await Product.findById(id)
        res.json(findproduct)
    } catch (error) {
        throw new Error(error)
    }
})

export const GetAllProducts = AsyncHandler(async (req,res)=>{
    try {
        //filtering
        const queryObj = { ...req.query };
        const excludeobjects = ["sort","page","limit","fields"];
        excludeobjects.forEach((el)=> delete queryObj[el]);
        let queryStr =JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
        let query = Product.find(JSON.parse(queryStr))
        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        //limiting the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }   
        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1) * limit;
        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const ProdcutCount = await Product.countDocuments();
            if(skip >= ProdcutCount){
                throw new Error("This Page Doesn't Exist")
            }
        }
        const AllProducts = await query
        res.json({AllProducts})
    } catch (error) {
        throw new Error(error)
    }
})

export const UpdatedProduct = AsyncHandler( async (req,res)=>{
    const id  = req.params.id; 
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const UpdatedProduct =  await Product.findByIdAndUpdate(id,req.body,{new:true});
        res.json(UpdatedProduct);
    } catch (error) {
        throw new Error(error);
    }
});

export const DeleteProduct = AsyncHandler( async (req,res)=>{
    const {id} = req.params
    try {
        const DeletedProduct =  await Product.findByIdAndDelete(id)
        res.json(DeletedProduct);
    } catch (error) {
        throw new Error(error)
    }
})


export const AddtoWishlist = AsyncHandler(async (req,res)=>{
    const { _id } = req.findUser;
    const { prodId } = req.body;
    try {
        const foundUser = await User.findById(_id)
        const isAlreadyadded = foundUser.wishlist.find((id) =>id.toString() === prodId);

        if(isAlreadyadded){
            let updateUser =await User.findByIdAndUpdate(_id,{
                $pull:{wishlist:prodId}
            },{
                new:true
            })
            res.json(updateUser)
        } else {
            const updateUser =await User.findByIdAndUpdate(_id,{
                $push:{wishlist:prodId}
            },{
                new:true
            })
            res.json(updateUser)
        }
    } catch (error) {
        throw new Error(error)
    }
})

export const rating = AsyncHandler(async (req, res) => {
    const { _id } = req.findUser;
    const { star,comment, prodId } = req.body;

    let product = await Product.findById(prodId);

    let isAlreadyRated = product.Ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
    );
    if (isAlreadyRated) {
        const updatedProduct = await Product.findOneAndUpdate(
            {
                "Ratings.postedby": _id,
            },
            {
                $set: { "Ratings.$.star": star, "Ratings.$.comment": comment },
            },
            {
                new: true,
            }
        );
    } else {
        const updatedProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                $push: {
                    Ratings: {
                        star: star,
                        comment:comment,
                        postedby: _id,
                    },
                },
            },
            {
                new: true,
            }
        );
    }
    const getAllRatings  = await Product.findById(prodId);
    let totalRatings = getAllRatings.Ratings.length
    let ratingSum = getAllRatings.Ratings
    .map((item) => item.star).reduce((prev,curr)=>prev+curr,0)
    let actualRating =  Math.round(ratingSum/totalRatings);
    let finalProduct = await Product.findByIdAndUpdate(prodId
    ,{
        totalratings:actualRating,
    },
    {
        new:true
    }
    )
    res.json(finalProduct)
});



export const uploadImages = AsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const uploader = (path) => cloudinaryUploadImage(path,"images")
        const urls = [];
        console.log(req);
        const files = req.files;
        for (const file of files){
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
        }
        const findproduct = await Product.findByIdAndUpdate(id,{
            images:urls.map((file)=>{
                return file
            })
        },{new:true});
        res.json(findproduct);
    } catch (error) {
        throw new Error(error)
    }
 })