import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
   product:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
        },
        Count:Number,
        color:String
    }
   ],
   paymentIntent:{},
   orderStatus:{
    type:String,
    default:"Not Processed",
   enum:[
    "Not Processed",
    "Cash On Delivery",
    "processing",
    "Dispatched",
    "Cancelled",
    "Delivered",
   ]
    },
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},
{
    timestamps:true,
}
);

//Export the model
export const Order = mongoose.model('Order', orderSchema);