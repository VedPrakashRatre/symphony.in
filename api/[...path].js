import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const indexData = require('../index.json');

export default function handler(req, res) {
    const { path: segments } = req.query;
    const parts = Array.isArray(segments) ? segments : [segments];
    const folderPath = parts.join("/");

    const files = indexData[folderPath] || [];
    res.status(200).json({ files });
}
