import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const { path: segments } = req.query;
    const parts = Array.isArray(segments) ? segments : [segments];
    
    // Try both with and without "public"
    const folderPath1 = path.join(process.cwd(), "public", ...parts);
    const folderPath2 = path.join(process.cwd(), ...parts);

    let folderPath = fs.existsSync(folderPath1) ? folderPath1 : folderPath2;

    try {
        const files = fs.readdirSync(folderPath);
        res.status(200).json({ files });
    } catch (e) {
        res.status(500).json({ files: [], error: e.message, tried: [folderPath1, folderPath2] });
    }
}
