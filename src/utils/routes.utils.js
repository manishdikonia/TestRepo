// file system
const normalizePath = require('path').join(__dirname, '../app/routes');
const path = '../app/routes/';

module.exports = app => {
    require('fs')
        .readdirSync(normalizePath)
        .forEach(file => {
            // uncomment this for testing
            // //console.log(file," route loaded");
            require(path + file)(app);
        });
};
