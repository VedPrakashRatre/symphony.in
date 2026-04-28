import indexData from '../index.json' assert { type: 'json' };

export default function handler(req, res) {
    const { path: segments } = req.query;
    const parts = Array.isArray(segments) ? segments : [segments];
    const folderPath = parts.join("/");

    const files = indexData[folderPath] || [];
    res.status(200).json({ files });
}
