import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/temp");
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.random()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
