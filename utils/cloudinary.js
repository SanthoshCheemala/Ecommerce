import cloudinary from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

export const cloudinaryUploadImage = async (filetoUploads)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(filetoUploads,(results)=>{
            resolve(
                {
                    url: results.secure_url
                },
                {
                    resoure_type:"auto",
                }
            )
        })
    })

}