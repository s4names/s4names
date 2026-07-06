const { db } = require('../lib/firebase');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { uid, username, picture } = body;

        if (!uid) return res.status(400).json({ error: 'UID required' });

        const snapshot = await db.collection('users').where('uid', '==', uid).limit(1).get();

        if (!snapshot.empty) {
            await snapshot.docs[0].ref.update({ username, picture });
        }

        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
