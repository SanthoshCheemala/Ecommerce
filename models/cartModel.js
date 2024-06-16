import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var CartSchema = new mongoose.Schema({
   product:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
        },
        Count:Number,
        color:String,
        price:Number
    }
   ],
   CartTotal:Number,
   totalAfterDiscount:Number,
    OrderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},
{
    timestamps:true,
}
);

//Export the model
export const Cart = mongoose.model('Cart', CartSchema);