
import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"quickNest",
        format:"webp",
        allowed_formats:["jpg","jpeg","png","webp"],
        transformation:[
            {width:800,height:600,crop:"limit"},
            {quality:"auto"},
            {fetch_format:"auto"}
        ]
    }
})

const uploads = multer({storage,limits:{fileSize: 5*1024*1024 }});

export default uploads;
// const storage = new CloudinaryStorage({
//     cloudinary,
//     params:{
//         folder:"quickNest",
//         format:"webp",
//         allowed_formats:["jpg","jpeg","png","webp"],
//         transformation:[
//             {width:800,height:600,crop:"limit"},
//             {quality:"auto"},
//             {fetch_format:"auto"}
//         ]
//     }
// })

// const uploads = multer({storage,limits:{fileSize: 5*1024*1024 }});

//export default uploads;

const createUpload = ({
    folder,
    formats,
    mimeTypes = [],
    transformation,
    fileSize = 5 * 1024 * 1024,
    resource_type = "auto",
}) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => ({
            folder,
            allowed_formats: formats,
            public_id: `${file.fieldname + "-" + Date.now() + path.extname(file.originalname)}`,
            transformation,
        })
    });
    return multer({
        storage,
        limits: { fileSize },
        fileFilter: (req, file, cb) => {
            if (mimeTypes.length === 0 || mimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`file format is not valid please select from these files format ${mimeTypes.join(",").split(" ")}`), false);
            }
        }
    })
}

export const uploadProfile = createUpload({
    folder: "quickNest/profilePicture",
    format: ["jpg", "jpeg", "png"],
    mimeTypes: ["image/jpg", "image/jpeg", "image/png"],
    fileSize: 2 * 1024 * 1024,
    resource_type: "image",
    transformation: [
        {
            height: 500,
            width: 500,
            crop: "fill",
            gravity: "face",
            quality: "auto",
            fetch_format: "auto"
        },
    ],
});

export const uploadDocument = createUpload({
    folder: "quickNest/Documents",
    format: ["jpeg", "jpeg", "png", "pdf"],
    mimeTypes: ["image/jpg", "image/jpeg", "image/png", "application/pdf"],
    fileSize: 15 * 1024 * 1024,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
});

// for only single file upload
// uploadDocument.single("avatar")

// for multiple same file
// uploadDocument.array("document",5);

// for multiple different different file

// uploadDocument.fields({ document: maxCount - 2 });

// for any file upload

// uploadDocument.any()