const fs = require('fs');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    try {
        const filePath = '/tmp/users.json';
        let users = {};

        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            if (raw.trim()) users = JSON.parse(raw);
        }

        const entries = [];

        for (const id in users) {
            if (users[id] && users[id].verified) {
                const s = users[id].stats || { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 };
                entries.push({
                    discordId: id,
                    totalSnipes: s.totalSnipes || 0,
                    rareSnipes: s.rareSnipes || 0,
                    goodSnipes: s.goodSnipes || 0,
                    normalSnipes: s.normalSnipes || 0,
                    checkedCount: s.checkedCount || 0
                });
            }
        }

        let totalSnipes = 0, rareSnipes = 0, goodSnipes = 0, normalSnipes = 0, checkedCount = 0;
        for (let i = 0; i < entries.length; i++) {
            totalSnipes += entries[i].totalSnipes;
            rareSnipes += entries[i].rareSnipes;
            goodSnipes += entries[i].goodSnipes;
            normalSnipes += entries[i].normalSnipes;
            checkedCount += entries[i].checkedCount;
        }

        entries.sort(function(a, b) { return b.totalSnipes - a.totalSnipes; });
        const leaderboard = entries.slice(0, 10);

        return res.status(200).json({
            totalSnipes: totalSnipes,
            rareSnipes: rareSnipes,
            goodSnipes: goodSnipes,
            normalSnipes: normalSnipes,
            checkedCount: checkedCount,
            verifiedCount: entries.length,
            leaderboard: leaderboard
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
