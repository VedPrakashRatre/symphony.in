import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const { path: segments } = req.query;
    const folderPath = path.join(process.cwd(), "public", ...(Array.isArray(segments) ? segments : [segments]));

    try {
        const files = fs.readdirSync(folderPath);
        res.status(200).json({ files });
    } catch (e) {
        res.status(404).json({ files: [], error: "Not found" });
    }
}
