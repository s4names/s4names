const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('id') || url.pathname.split('/').pop();

    if (!id || id.length < 10) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    try {
        const filePath = path.join(process.cwd(), 'data', 'users.json');
        let users = {};
        
        if (fs.existsSync(filePath)) {
            try {
                const raw = fs.readFileSync(filePath, 'utf8');
                if (raw.trim()) users = JSON.parse(raw);
            } catch(e) {
                users = {};
            }
        }

        const user = users[id];
        if (user && user.verified) {
            res.status(200).json({
                verified: true,
                stats: user.stats || { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 }
            });
        } else {
            res.status(200).json({ verified: false });
        }
    } catch (e) {
        res.status(500).json({ error: 'Internal error' });
    }
};
