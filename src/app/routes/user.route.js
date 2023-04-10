module.exports = app => {
    const {
        createUser,
        getUsers,
        getUser,
        deleteUser,
        updateUser,
    } = require('../controllers/user.controller');
    const { authenticateToken } = require('../../middlewares/auth.middleware');

    app.post('/user', createUser);
    app.get('/user', authenticateToken, getUsers);
    app.get('/user/:id', getUser);
    app.put('/user/:id', authenticateToken, updateUser);
    app.delete('/user/:id', deleteUser);
}