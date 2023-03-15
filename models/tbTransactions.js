const ezParkSequelize=require('./index');
const sequelize = require('sequelize');

const tblTransactions = ezParkSequelize.define('tblTransactions', {
    transactionId: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId: {type: sequelize.STRING, allowNull: false},
    operatorId: {type: sequelize.STRING, allowNull: false},
    vehicleType: {type:sequelize.STRING, allowNull: false},
    inTime: {type: 'TIMESTAMP', allowNull:false},
    outTime: {type: 'TIMESTAMP', allowNull:false, defaultValue: sequelize.NOW},
    charges: {type: sequelize.INTEGER}
},{timestamps: false});

module.exports = tblTransactions;