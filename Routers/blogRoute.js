import express from "express";
import { GetAllBlogs, createBlog, deleteBlog, dislikeBlog, getBlog, likeBlog, updateBlog, uploadImages } from "../controller/blogCtrl.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { bloagImgResize, uploadPhoto } from "../middlewares/uploadImages.js";
const router = express.Router();

router.get('/Getallblogs',authMiddleware,isAdmin,GetAllBlogs)
router.post('/create-blog',authMiddleware,isAdmin,createBlog)
router.put('/update-blog/:id',authMiddleware,isAdmin,updateBlog)
router.put('/getblog/:id',authMiddleware,getBlog)
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images",2),
    bloagImgResize,
    uploadImages
)
router.put('/likes',authMiddleware,likeBlog)
router.put('/dislikes',authMiddleware,dislikeBlog)
router.delete('/delete-blog/:id',authMiddleware,isAdmin,deleteBlog)


export default router;