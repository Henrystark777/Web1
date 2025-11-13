const fs = require('fs');
const path = require('path');

function getPath(wsPath) {
    return path.join(wsPath, 'text.json');
}

// Save text
function saveText(wsPath, inputText) {
    const file = getPath(wsPath);
    fs.writeFileSync(file, JSON.stringify({ text: inputText }));
    return "Text saved!";
}

// Fetch text
function fetchText(wsPath) {
    const file = getPath(wsPath);
    if (!fs.existsSync(file)) return "No text found!";
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return data.text;
}

// Delete text
function deleteText(wsPath) {
    const file = getPath(wsPath);
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        return "Text deleted!";
    } else return "No text found!";
}

module.exports = { saveText, fetchText, deleteText };
