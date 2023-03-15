const ezParkSequelize=require('./index');
const sequelize = require('sequelize');
const tblSpaceId = require('./tblSpace_ID_Mapping');

const tblCompanySpace = ezParkSequelize.define('tblCompany_Space_Mapping', {
    companyId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    spaceId : { type: sequelize.INTEGER},
    companyName: {type:sequelize.STRING, allowNull: false},
    totalSlots: {type: sequelize.INTEGER},
    availableSlots: {type: sequelize.INTEGER}
},{timestamps: false});

tblCompanySpace.belongsTo(tblSpaceId, {foreignKey: 'spaceId', sourceKey: 'spaceId'});
module.exports = tblCompanySpace;