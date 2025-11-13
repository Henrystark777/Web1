const fs = require('fs');
const path = require('path');
const baseDir = path.join(__dirname, '../data');

function openWorkspace(password) {
    const wsPath = path.join(baseDir, password);
    if (!fs.existsSync(wsPath)) {
        fs.mkdirSync(wsPath);
        return { path: wsPath, message: "New workspace created!" };
    } else {
        return { path: wsPath, message: "Workspace opened!" };
    }
}

function deleteWorkspace(password) {
    const wsPath = path.join(baseDir, password);
    if (fs.existsSync(wsPath)) {
        fs.rmSync(wsPath, { recursive: true, force: true });
        return "Workspace deleted!";
    } else return "No workspace found!";
}

module.exports = { openWorkspace, deleteWorkspace };
