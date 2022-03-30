import multer from 'multer';
import path from 'path';
import config from '../../../config/config.js';
import fs from 'fs';

const uploadFolder = config.multer_storage;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix =
    //   Date.now() +
    //   '-' +
    //   Math.round(Math.random() * 1e9) +
    //   path.extname(file.originalname);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, res, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(err, false);
  }
};

const upload = multer({ storage: storage }).array('files', 10);
const avatar = multer({ storage: storage }, { fileFilter: fileFilter }).single(
  'avatar'
);

export { upload, avatar };
