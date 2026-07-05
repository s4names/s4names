const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!id || id.length < 10) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        let users = {};
        if (fs.existsSync(DATA_FILE)) {
            try {
                users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            } catch (e) {
                users = {};
            }
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
        return res.status(500).json({ error: 'Server error' });
    }
};
