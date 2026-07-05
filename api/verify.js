const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { discordId } = req.body;
    if (!discordId) {
        return res.status(400).json({ error: 'Discord ID required' });
    }

    let users = {};
    if (fs.existsSync(DATA_FILE)) {
        users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    if (!users[discordId]) {
        users[discordId] = {
            verified: true,
            verifiedAt: new Date().toISOString(),
            stats: { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    }

    res.json({ verified: true, success: true });
};
