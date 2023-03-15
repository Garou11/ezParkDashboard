const ezParkSequelize=require('./index');
const sequelize = require('sequelize');
const tblSpaceId = require('./tblSpace_ID_Mapping');

const operators = ezParkSequelize.define('operators', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    operatorId: {type: sequelize.STRING, allowNull: false},
    operator: {type: sequelize.STRING, allowNull: false},
    chargeConfig: {
        type: sequelize.TEXT,
           get: function () {
                return JSON.parse(this.getDataValue('value'));
            },
            set: function (value) {
                this.setDataValue('value', JSON.stringify(value));
            }
    },
    spaceId : { type: sequelize.INTEGER},
    validationCode: {type:sequelize.STRING},
    createdAt: {type: 'TIMESTAMP', allowNull:false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')}
},{timestamps: false});

operators.hasOne(tblSpaceId, {foreignKey: 'spaceId', sourceKey:'spaceId'});
module.exports = operators;