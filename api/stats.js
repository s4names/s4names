const kv = require('@vercel/kv');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    try {
        const keys = await kv.keys('user:*');
        const entries = [];

        for (const key of keys) {
            const raw = await kv.get(key);
            if (!raw) continue;
            const user = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (!user.verified) continue;

            const s = user.stats || {};
            entries.push({
                discordId: key.replace('user:', ''),
                totalSnipes: s.totalSnipes || 0,
                rareSnipes: s.rareSnipes || 0,
                goodSnipes: s.goodSnipes || 0,
                normalSnipes: s.normalSnipes || 0,
                checkedCount: s.checkedCount || 0
            });
        }

        let totalSnipes = 0, rareSnipes = 0, goodSnipes = 0, normalSnipes = 0, checkedCount = 0;
        for (const e of entries) {
            totalSnipes += e.totalSnipes;
            rareSnipes += e.rareSnipes;
            goodSnipes += e.goodSnipes;
            normalSnipes += e.normalSnipes;
            checkedCount += e.checkedCount;
        }

        entries.sort((a, b) => b.totalSnipes - a.totalSnipes);

        return res.status(200).json({
            totalSnipes,
            rareSnipes,
            goodSnipes,
            normalSnipes,
            checkedCount,
            verifiedCount: entries.length,
            leaderboard: entries.slice(0, 10)
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
