const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, 'assets/imgs/uploads/');
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname);
}
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
   
    cb(null, true); 
  }
});

module.exports = upload