const multer = require('multer');
const path = require('path');
  
       
const storage = multer.diskStorage({   
    destination: function (req, file, cb) {
      cb(null, './public/temp');  
    },//                                                 
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  });


  
const uploadFiles = () => {
    return multer({ storage: storage });
};
  


module.exports = {
    uploadFiles,
};
  