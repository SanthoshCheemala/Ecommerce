import express from "express";
import { AddtoWishlist, CreateProduct, DeleteProduct, GetAllProducts, GetaProduct, UpdatedProduct, rating, uploadImages } from "../controller/productCtrl.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImages.js";
const router = express.Router()

router.post("/create-product",authMiddleware,isAdmin,CreateProduct)
router.get("/getproduct/:id",GetaProduct)
router.get("/getallproducts",GetAllProducts)
router.put("/updateprduct/:id",authMiddleware,isAdmin,UpdatedProduct)
router.put("/ratings",authMiddleware,rating)
router.put("/addtowishlist",authMiddleware,AddtoWishlist)
router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images",10),
    productImgResize,
    uploadImages
)
router.delete("/deleteproduct/:id",authMiddleware,isAdmin,DeleteProduct)




export default router;