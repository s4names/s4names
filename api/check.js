const kv = require('@vercel/kv');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    try {
        const url = new URL(req.url, 'http://localhost');
        const id = url.searchParams.get('id');

        if (!id || id.length < 10) return res.status(400).json({ error: 'Invalid ID' });

        const raw = await kv.get('user:' + id);
        if (!raw) return res.status(200).json({ verified: false });

        const user = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return res.status(200).json({
            verified: user.verified || false,
            stats: user.stats || { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 }
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
