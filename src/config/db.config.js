const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'postgres', '0000', {
  host: 'localhost',
  dialect: 'postgres',
});

const models = {};
const modelFolder = path.join(__dirname, '../models');


console.log("\x1b[32m",'Loading Models')
// Read all files in the models folder
fs.readdirSync(modelFolder)
  .filter((file) => {
    // Only import files that have a .js extension
    return file.endsWith('.js');
  })
  .forEach((file) => {
    // Import the model and add it to the models object
    const model = sequelize.define(path.join(modelFolder, file));
    console.log("\x1b[33m",model.name)
    models[model.name] = model;
  });

// Loop through the models and associate them if any
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
