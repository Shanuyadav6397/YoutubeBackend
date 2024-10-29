import multer from "multer";

const storageConfiguration = multer.diskStorage({
  //multer.diskStorage() creates a storage space for storing files.
  destination: (req, file, next) => {
    //destination is used to specify the folder where the files will be stored.
    next(null, "./src/public/temp"); //public is the folder where the files will be stored.
  },
  filename: (req, file, next) => {
    //filename is used to specify the name of the file.
    // Here more functions add in filename to make the file name unique after project completion
    next(null, Date.now() + "_" + file.originalname);
    //console.log(file);
  },
});

export const upload = multer({
  //multer() is used to specify the storage space for storing files.
  storage: storageConfiguration,
});
