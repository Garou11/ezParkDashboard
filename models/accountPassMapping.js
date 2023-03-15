const ezParkSequelize=require('./index');
const sequelize = require('sequelize');

const accountPassMapping = ezParkSequelize.define('accountPassMapping', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    username: {type: sequelize.STRING, allowNull: false},
    password: {type: sequelize.STRING, allowNull: false},
    spaceId: {type:sequelize.INTEGER},
    redirectUrl: {type: sequelize.STRING},
},{timestamps: false});

module.exports = accountPassMapping;