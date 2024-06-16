import express from 'express';
import { config } from 'dotenv';
import { connectDB } from './config/DbConnect.js';
import authRoute from './Routers/authRoute.js';
import ProductRoute from './Routers/ProductRoute.js';
import CategoryRoute from './Routers/ProdcategoryRoute.js'
import BlogCatRoute from './Routers/blogCatRoute.js'
import BrandRoute from './Routers/brandRoute.js'
import CoupenRoute from './Routers/couponRoute.js'
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import BlogRoute from './Routers/blogRoute.js'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
config({
    path: './.env',
  });
  
const PORT = process.env.PORT
const app = express();
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended:true}))
connectDB();

app.use('/api/user',authRoute)
app.use('/api/product',ProductRoute                                                                                                 )
app.use('/api/blog',BlogRoute)
app.use('/api/category',CategoryRoute)
app.use('/api/blogcat',BlogCatRoute)
app.use('/api/brand',BrandRoute)
app.use('/api/coupon',CoupenRoute)

app.use(notFound)
app.use(errorHandler)
app.use(cookieParser());

app.listen(PORT,()=>{
    console.log(`PORT is eunning on ${PORT}`);
})