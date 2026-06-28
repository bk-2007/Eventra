const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getStudentCertificates,
  downloadCertificate,
} = require('../controllers/certificateController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/generate', protect, isAdmin, generateCertificate);
router.get('/:studentId', protect, getStudentCertificates);
router.get('/download/:id', protect, downloadCertificate);

module.exports = router;
