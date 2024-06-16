import mongoose  from "mongoose"; 


var BlogCatSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
},{
    timestamps:true,
});


export const BlogCat = mongoose.model('BlogCat',BlogCatSchema);