const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const discordId = body && body.discordId;

        if (!discordId || discordId.length < 17) {
            return res.status(400).json({ error: 'Invalid Discord ID' });
        }

        const usersRef = db.collection('users');
        const existing = await usersRef.where('discordId', '==', discordId).limit(1).get();

        if (!existing.empty) {
            const doc = existing.docs[0];
            await doc.ref.update({ verified: true });
            return res.status(200).json({ verified: true, success: true });
        }

        await usersRef.add({
            discordId: discordId,
            verified: true,
            verifiedAt: new Date().toISOString(),
            stats: { totalSnipes: 0, rareSnipes: 0, goodSnipes: 0, normalSnipes: 0, checkedCount: 0 }
        });

        return res.status(200).json({ verified: true, success: true });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
