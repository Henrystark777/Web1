const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('./controllers/authController');
const text = require('./controllers/textController');

const app = express();
app.use(cors());
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use(bodyParser.json());

// 📁 Create uploads folder if not exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 🧱 Multer setup (for image upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 🧭 Health check
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'VaultX backend is running' });
});

// 🧩 Open/Create workspace
app.post('/api/auth/workspace', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const ws = auth.openWorkspace(password);
  res.json(ws);
});

// 💾 Upload text or image
app.post('/api/text/upload', upload.single('file'), (req, res) => {
  const { password, textInput } = req.body;
  const file = req.file;

  if (!password) return res.status(400).json({ error: 'Password required' });

  const ws = auth.openWorkspace(password);
  let message = '';

  if (textInput) message += text.saveText(ws.path, textInput);
  if (file) {
    const destPath = path.join(ws.path, file.originalname);
    fs.renameSync(file.path, destPath);
    message += ` File uploaded: ${file.originalname}`;
  }

  res.json({ message: message || 'Nothing uploaded' });
});

// ❌ Delete workspace
app.post('/api/text/delete', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const message = auth.deleteWorkspace(password);
  res.json({ message });
});

app.listen(3000, () => console.log('VaultX backend running at http://localhost:3000'));


// 🗂 Fetch workspace contents
app.post('/api/text/fetch', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const ws = auth.openWorkspace(password);
  const files = fs.readdirSync(ws.path).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  // fetch text
  let textData = '';
  const textFile = path.join(ws.path, 'text.json');
  if (fs.existsSync(textFile)) {
    const data = JSON.parse(fs.readFileSync(textFile, 'utf-8'));
    textData = data.text || '';
  }

  res.json({ files, text: textData });
});
