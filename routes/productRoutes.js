const express = require('express');
const multer = require('multer');
const { uploadCSV, downloadCSV , createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const fs = require("fs");

// Configure Multer Storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = "uploads/";
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage });
//csv upload and downloads
router.post('/csv', authMiddleware,  upload.single('file'), uploadCSV);
router.get('/exportCSV', authMiddleware, downloadCSV);
//product crud
router.post('/addProduct', authMiddleware, createProduct);
router.get('/list', getProducts);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
