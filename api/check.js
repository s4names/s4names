const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    try {
        const url = new URL(req.url, 'http://localhost');
        const id = url.searchParams.get('id');

        if (!id || id.length < 17) return res.status(400).json({ error: 'Invalid ID' });

        const snapshot = await db.collection('users').where('discordId', '==', id).limit(1).get();

        if (snapshot.empty) return res.status(200).json({ verified: false });

        const data = snapshot.docs[0].data();

        return res.status(200).json({
            verified: data.verified || false,
            stats: data.stats || { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 }
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
