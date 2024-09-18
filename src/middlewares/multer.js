import multer from "multer";

const storage = multer.diskStorage({//multer.diskStorage() creates a storage space for storing files.
    destination: (req, file, cb) => {//destination is used to specify the folder where the files will be stored.
        cb(null, "./public/temp");//public is the folder where the files will be stored.
    },
    filename: (req, file, cb) => {//filename is used to specify the name of the file.
        // Here more functions add in filename to make the file name unique after project completion
        cb(null, Date.now() + '_' + file.originalname);
    }
});

export const upload = multer({//multer() is used to specify the storage space for storing files.
    storage, 
});