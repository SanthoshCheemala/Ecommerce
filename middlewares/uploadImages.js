import multer from "multer"
import sharp from "sharp"
import path from 'path'

const multerStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,path.join(__dirname,"../Public/Images"))
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1e9)
        cb(null,file.fieldname + "-" + uniqueSuffix + ".jpeg")
    },
})


const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('images')){
        cb(null,true)
    } else {
        cb(
            {
                message:"Unsupported file format"
            },
            false
        )
    }
}
export const uploadPhoto = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
    limits:{ fileSize: 2000000 }
})


export const productImgResize = async (req,res,next) => {
    if (!req.files || !Array.isArray(req.files)) {
    return next(new Error('No files uploaded'));
    }

    await Promise.all(
    req.files.map(async (file) => {
        const filename = file.filename.replace('.jpeg', '');
        await sharp(file.path)
        .resize(300, 300)
        .jpeg({ quality: 90 })
        .toFile(`/Public/Images/prooducts/${filename}.jpeg`);

        return fs.unlinkSync(file.path);
    })
    );
    next();
}

export const bloagImgResize = async (req,res,next) => {
    if (!req.files || !Array.isArray(req.files)) {
        return next(new Error('No files uploaded'));
    }
    await Promise.all(
        req.files.map(async (file)=>{
            await sharp(file.path)
            .resize(300,300)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`Public/Images/blogs/${file.filename}`)

            return fs.unlinkSync(file.path);
        })
    )
    next();
}