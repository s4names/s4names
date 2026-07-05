const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    try {
        const snapshot = await db.collection('users').where('verified', '==', true).get();
        const entries = [];

        snapshot.forEach(function(doc) {
            const data = doc.data();
            const s = data.stats || {};
            entries.push({
                discordId: data.discordId || doc.id,
                totalSnipes: s.totalSnipes || 0,
                rareSnipes: s.rareSnipes || 0,
                goodSnipes: s.goodSnipes || 0,
                normalSnipes: s.normalSnipes || 0,
                checkedCount: s.checkedCount || 0
            });
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

        return res.status(200).json({
            totalSnipes: totalSnipes,
            rareSnipes: rareSnipes,
            goodSnipes: goodSnipes,
            normalSnipes: normalSnipes,
            checkedCount: checkedCount,
            verifiedCount: entries.length,
            leaderboard: entries.slice(0, 10)
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
