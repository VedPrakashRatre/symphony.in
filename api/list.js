const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
    // Get folder from URL path correctly
    const folder = req.url.split("/api/list/")[1];
    const dirPath = path.join(process.cwd(), folder);
    
    try {
        const files = fs.readdirSync(dirPath);
        res.status(200).json({ files });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}