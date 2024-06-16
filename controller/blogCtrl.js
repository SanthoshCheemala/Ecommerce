import AsyncHandler from "express-async-handler";
import { Blog } from "../models/blogModel.js";
import { User } from "../models/userModel.js";
import { validateMongoDbId } from "../utils/validateMongodbid.js";


export const  createBlog = AsyncHandler(async (req,res)=>{
    try {
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
     } catch (error) {
        throw new Error(error)
    }
})


export const updateBlog = AsyncHandler(async (req,res)=>{
    const {id}  = req.params
    validateMongoDbId(blogId);
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new:true,
        })
        res.json(updatedBlog)
    } catch (error) {
        throw new Error(error)
    }
})


export const getBlog = AsyncHandler(async (req,res)=>{
    const {id}  = req.params
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id).populate("likes")
       const foundedBlog =  await Blog.findByIdAndUpdate(id, {
            $inc:{ numViews: 1}
        }, {
            new:true,
        })
        res.json(getBlog)
    } catch (error) {
        throw new Error(error)
    }
})


export const GetAllBlogs = AsyncHandler(async (req,res)=>{
    try {
        const AllBlogs = await Blog.find()
        res.json(AllBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteBlog = AsyncHandler(async (req,res)=>{
    const {id}  = req.params
    validateMongoDbId(blogId);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        res.json(deletedBlog)
    } catch (error) {
        throw new Error(error)
    }
})


export const likeBlog = AsyncHandler(async (req,res)=>{
    const {blogId} = req.body
    validateMongoDbId(blogId);
    try {
        // find the blog which you want to like
        const findblog = await Blog.findById(blogId)
        //  find the login user
        const loginUserId = req?.findUser?._id;
        // find if the user has liked the blog
        const isLiked = findblog?.isLiked;
        // find if the user has liked the blog
        const alreadyDisliked = findblog?.dislikes?.find(
            (userId) => userId?.toString() == loginUserId?.toString()
        );
        if(alreadyDisliked) {
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{ dislikes:loginUserId},
                isDisliked:false
            },{
                new:true
            })
        }
        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{ likes:loginUserId},
                isLiked:false
            },{
                new:true
            })
            res.json(blog)
        } else {
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $push:{ likes:loginUserId},
                isLiked:true
            },{
                new:true
            })
            res.json(blog)
        }

    } catch (error) {
        throw new Error(error)
    }
})


export const dislikeBlog = AsyncHandler(async (req,res)=>{
    const {blogId} = req.body
    validateMongoDbId(blogId);
    try {
        // find the blog which you want to like
        const findblog = await Blog.findById(blogId)
        //  find the login user
        const loginUserId = req?.findUser?._id;
        // find if the user has liked the blog
        const isDisliked = findblog?.isDisliked;
        // find if the user has liked the blog
        const alreadyLiked = findblog?.likes?.find(
            (userId) => userId?.toString() == loginUserId?.toString()
        );
        if(alreadyLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{ likes:loginUserId},
                isLiked:false
            },{
                new:true
            })
        }
        if(isDisliked){
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{ dislikes:loginUserId},
                isDisliked:false
            },{
                new:true
            })
            res.json(blog)
        } else {
            const blog = await Blog.findByIdAndUpdate(blogId,{
                $push:{ dislikes:loginUserId},
                isDisliked:true
            },{
                new:true
            })
            res.json(blog)
        }

    } catch (error) {
        throw new Error(error)
    }
})

export const uploadImages = AsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const uploader = (path) => cloudinaryUploadImage(path,"images")
        const urls = [];
        const files = req.files;
        for (const file of files){
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
        }
        const findblog = await Blog.findByIdAndUpdate(id,{
            images:urls.map((file)=>{
                return file
            })
        },{new:true});
        console.log(findblog);
    } catch (error) {
        throw new Error(error)
    }
 })