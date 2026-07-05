const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { discordId } = body || {};

        if (!discordId) {
            return res.status(400).json({ error: 'Discord ID required' });
        }

        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let users = {};
        if (fs.existsSync(DATA_FILE)) {
            try {
                const raw = fs.readFileSync(DATA_FILE, 'utf8');
                users = JSON.parse(raw);
            } catch (e) {
                users = {};
            }
        }

        if (!users[discordId]) {
            users[discordId] = {
                verified: true,
                verifiedAt: new Date().toISOString(),
                stats: {
                    totalSnipes: 0,
                    rareSnipes: 0,
                    goodSnipes: 0,
                    normalSnipes: 0,
                    checkedCount: 0
                }
            };
        } else {
            users[discordId].verified = true;
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

        return res.status(200).json({ verified: true, success: true });
    } catch (e) {
        return res.status(500).json({ error: 'Server error', details: e.message });
    }
};
