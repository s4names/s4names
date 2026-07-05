const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    let users = {};
    if (fs.existsSync(DATA_FILE)) {
        users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    const userList = Object.entries(users).map(([id, data]) => ({
        discordId: id,
        ...data.stats
    }));

    const totalSnipes = userList.reduce((sum, u) => sum + (u.totalSnipes || 0), 0);
    const rareSnipes = userList.reduce((sum, u) => sum + (u.rareSnipes || 0), 0);

    const leaderboard = userList
        .sort((a, b) => (b.totalSnipes || 0) - (a.totalSnipes || 0))
        .slice(0, 10);

    res.json({
        totalSnipes,
        rareSnipes,
        goodSnipes: userList.reduce((sum, u) => sum + (u.goodSnipes || 0), 0),
        normalSnipes: userList.reduce((sum, u) => sum + (u.normalSnipes || 0), 0),
        checkedCount: userList.reduce((sum, u) => sum + (u.checkedCount || 0), 0),
        verifiedCount: userList.length,
        leaderboard
    });
};
