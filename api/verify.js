const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
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
        const body = req.body;
        const discordId = body && body.discordId;

        if (!discordId) {
            return res.status(400).json({ error: 'Discord ID required' });
        }

        const filePath = '/tmp/users.json';
        let users = {};

        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            if (raw.trim()) users = JSON.parse(raw);
        }

        if (!users[discordId]) {
            users[discordId] = {
                verified: true,
                verifiedAt: new Date().toISOString(),
                stats: { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 }
            };
        } else {
            users[discordId].verified = true;
        }

        fs.writeFileSync(filePath, JSON.stringify(users));

        return res.status(200).json({ verified: true, success: true });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
