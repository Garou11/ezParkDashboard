const ezParkSequelize=require('./index');
const sequelize = require('sequelize');
const tblCompanySpace = require('./tblCompany_Space_Mapping');

const users = ezParkSequelize.define('users', {
    userId: {
        type: sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {type: sequelize.STRING},
    companyId: {type: sequelize.INTEGER},
    tblCompanySpaceMappingId: {
        type: sequelize.INTEGER,
        field:'companyId'
    },
},{timestamps: false});

users.belongsTo(tblCompanySpace, {foreignkey: 'companyId', targetKey:'companyId'});
module.exports = users;