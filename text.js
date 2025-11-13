const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../controllers/authController');
const text = require('../controllers/textController');

// ⚙️ Configure Multer for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const ws = auth.openWorkspace(req.body.password);
      if (!fs.existsSync(ws.path)) fs.mkdirSync(ws.path, { recursive: true });
      cb(null, ws.path);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});

// 🧠 Upload text or image
router.post('/upload', upload.single('file'), (req, res) => {
  const { password, textInput } = req.body;
  const file = req.file;

  if (!password) return res.status(400).json({ error: 'Password required' });

  const ws = auth.openWorkspace(password);

  if (textInput) text.saveText(ws.path, textInput);

  if (file) {
    return res.json({
      message: `File "${file.originalname}" uploaded successfully.`,
      filePath: file.path
    });
  }

  res.json({ message: 'Text saved successfully!' });
});

// 🧨 Delete entire workspace
router.post('/delete', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const result = auth.deleteWorkspace(password);
  res.json(result);
});

module.exports = router;
