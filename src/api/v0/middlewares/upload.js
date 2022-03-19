import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.MULTER_STORAGE);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const fileFilter = (req, res, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(err, false);
  }
};

const upload = multer({ storage: storage }).array('files', 10); //.multerErr()
const avatar = multer({ storage: storage }, { fileFilter: fileFilter }).single(
  'avatar'
); //.multerErr()

export { upload, avatar };
