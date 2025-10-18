import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
  const allowedExtensions = ['.csv'];

  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    callback(null, true);
  } else {
    callback(new Error('Only CSV files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

export default upload;
