export default async function handler(req, res) {
    const { path: segments } = req.query;
    const parts = Array.isArray(segments) ? segments : [segments];
    const folderPath = parts.join("/");

    try {
        const baseUrl = `https://${req.headers.host}`;
        const response = await fetch(`${baseUrl}/index.json`);
        const index = await response.json();

        const files = index[folderPath] || [];
        res.status(200).json({ files });
    } catch (e) {
        res.status(500).json({ files: [], error: e.message });
    }
}
