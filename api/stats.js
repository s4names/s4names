const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    try {
        let users = {};
        if (fs.existsSync(DATA_FILE)) {
            try {
                users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            } catch (e) {
                users = {};
            }
        }

        const entries = Object.entries(users)
            .filter(([_, data]) => data.verified)
            .map(([id, data]) => ({
                discordId: id,
                ...(data.stats || { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 })
            }));

        const totalSnipes = entries.reduce((s, u) => s + u.totalSnipes, 0);
        const rareSnipes = entries.reduce((s, u) => s + u.rareSnipes, 0);
        const goodSnipes = entries.reduce((s, u) => s + u.goodSnipes, 0);
        const normalSnipes = entries.reduce((s, u) => s + u.normalSnipes, 0);
        const checkedCount = entries.reduce((s, u) => s + u.checkedCount, 0);

        const leaderboard = entries
            .sort((a, b) => b.totalSnipes - a.totalSnipes)
            .slice(0, 10);

        return res.status(200).json({
            totalSnipes,
            rareSnipes,
            goodSnipes,
            normalSnipes,
            checkedCount,
            verifiedCount: entries.length,
            leaderboard
        });
    } catch (e) {
        return res.status(500).json({ error: 'Server error' });
    }
};
