const ezParkSequelize=require('./index');
const sequelize = require('sequelize');
const tblSpaceId =  require('./tblSpace_ID_Mapping');
const activeTransactions = ezParkSequelize.define('activeTransactions', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId: {type: sequelize.STRING, allowNull: false},
    operatorId: {type: sequelize.STRING, allowNull: false},
    vehicleType: {type:sequelize.STRING, allowNull: false},
    inTime: {type: 'TIMESTAMP', allowNull:false, defaultValue: sequelize.NOW},
},{timestamps: false});

module.exports = activeTransactions;