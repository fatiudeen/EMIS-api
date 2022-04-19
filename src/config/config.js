import 'dotenv/config';

export default {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  jwt_timeout: process.env.JWT_TIMEOUT,
  mongodb_uri: process.env.MONGODB_URI,
  multer_storage: process.env.MULTER_STORAGE,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  multer_storage_avi: process.env.MULTER_STORAGE_AVI,
};
