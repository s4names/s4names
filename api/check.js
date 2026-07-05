const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID required' });

    let users = {};
    if (fs.existsSync(DATA_FILE)) {
        users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    const user = users[id];
    if (user) {
        res.json({ verified: true, stats: user.stats });
    } else {
        res.json({ verified: false });
    }
};
