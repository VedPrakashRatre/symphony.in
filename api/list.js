import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const folder = req.query.folder || "musics";
  const dirPath = path.join(process.cwd(), folder);

  if (!fs.existsSync(dirPath)) {
    return res.status(404).json({ files: [] });
  }

  const files = fs.readdirSync(dirPath);
  res.status(200).json({ files });
}
