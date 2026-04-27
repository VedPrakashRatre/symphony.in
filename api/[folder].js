import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { folder } = req.query;
  const dirPath = path.join(process.cwd(), folder);

  try {
    const files = fs.readdirSync(dirPath);
    res.status(200).json({ files });
  } catch (e) {
    res.status(404).json({ files: [], error: "Not found" });
  }
}
