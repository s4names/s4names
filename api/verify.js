const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) { body = {}; }
        }

        const discordId = body && body.discordId;
        if (!discordId) {
            res.status(400).json({ error: 'Discord ID required' });
            return;
        }

        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const filePath = path.join(dataDir, 'users.json');
        let users = {};
        
        if (fs.existsSync(filePath)) {
            try {
                const raw = fs.readFileSync(filePath, 'utf8');
                if (raw.trim()) users = JSON.parse(raw);
            } catch(e) {
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

        fs.writeFileSync(filePath, JSON.stringify(users));

        res.status(200).json({ verified: true, success: true });
    } catch (e) {
        res.status(500).json({ error: 'Internal error' });
    }
};
