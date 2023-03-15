const ezParkSequelize=require('./index');
const sequelize = require('sequelize');

const tblSpaceId = ezParkSequelize.define('tblSpace_ID_Mapping', {  
    spaceId : { type: sequelize.INTEGER, primaryKey:true , autoIncrement: true, allowNull: false},
    spaceName: {type: sequelize.STRING}
},{timestamps: false});

module.exports = tblSpaceId;