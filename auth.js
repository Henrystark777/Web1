const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/workspace', (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });
    const ws = auth.openWorkspace(password);
    res.json(ws);
});

router.delete('/workspace/:password', (req, res) => {
    const { password } = req.params;
    const message = auth.deleteWorkspace(password);
    res.json({ message });
});

module.exports = router;
