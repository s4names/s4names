const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

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

        const entries = Object.entries(users)
            .filter(function([_, data]) { return data.verified; })
            .map(function([id, data]) {
                var s = data.stats || { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 };
                return {
                    discordId: id,
                    totalSnipes: s.totalSnipes || 0,
                    rareSnipes: s.rareSnipes || 0,
                    goodSnipes: s.goodSnipes || 0,
                    normalSnipes: s.normalSnipes || 0,
                    checkedCount: s.checkedCount || 0
                };
            });

        var totalSnipes = 0, rareSnipes = 0, goodSnipes = 0, normalSnipes = 0, checkedCount = 0;
        for (var i = 0; i < entries.length; i++) {
            totalSnipes += entries[i].totalSnipes;
            rareSnipes += entries[i].rareSnipes;
            goodSnipes += entries[i].goodSnipes;
            normalSnipes += entries[i].normalSnipes;
            checkedCount += entries[i].checkedCount;
        }

        entries.sort(function(a, b) { return b.totalSnipes - a.totalSnipes; });
        var leaderboard = entries.slice(0, 10);

        res.status(200).json({
            totalSnipes: totalSnipes,
            rareSnipes: rareSnipes,
            goodSnipes: goodSnipes,
            normalSnipes: normalSnipes,
            checkedCount: checkedCount,
            verifiedCount: entries.length,
            leaderboard: leaderboard
        });
    } catch (e) {
        res.status(500).json({ error: 'Internal error' });
    }
};
