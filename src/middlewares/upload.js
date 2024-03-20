import multer from "multer";

// Set up storage for uploaded files

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        const fileType = file.mimetype.split('/')[0];

        if(fileType=='image'){
            cb(null , "public/images/");
        }
        
        else{
            cb(new Error("invalid file type"));
        }
     
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage });
  

export default upload;



