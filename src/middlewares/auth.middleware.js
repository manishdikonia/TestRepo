const jwt = require('jsonwebtoken');
const SECRET = 'nDpb&z!!md:m;x&r;7cmi5;wg-K-~E:c;:K-`K/KDsdieyUV+s=~qC3`,vGCR9,P]"Mg';

const generateAccessToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '365d' });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            console.log(err, 'err');
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = {
    generateAccessToken,
    authenticateToken,
};
