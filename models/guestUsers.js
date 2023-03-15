const ezParkSequelize=require('./index');
const sequelize = require('sequelize');
const tblCompanySpace = require('./tblCompany_Space_Mapping');

const guestUsers = ezParkSequelize.define('guestUsers', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    vehicleNumber: {type: sequelize.STRING, allowNull: false},
    createdOn: {type: 'TIMESTAMP', allowNull:false, defaultValue: sequelize.NOW},
    meta: {type:sequelize.JSON},
},{timestamps: false});

module.exports = guestUsers;