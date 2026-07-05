const fs = require('fs');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    try {
        const url = new URL(req.url, 'http://localhost');
        const id = url.searchParams.get('id');

        if (!id || id.length < 10) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const filePath = '/tmp/users.json';
        let users = {};

        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            if (raw.trim()) users = JSON.parse(raw);
        }

        const user = users[id];
        if (user && user.verified) {
            return res.status(200).json({
                verified: true,
                stats: user.stats || { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 }
            });
        }

        return res.status(200).json({ verified: false });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
