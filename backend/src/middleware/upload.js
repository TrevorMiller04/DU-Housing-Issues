import multer from 'multer'

const ALLOWED_TYPES = ['image/jpeg', 'image/png']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG and PNG files are allowed'))
    }
  },
})

export default upload
