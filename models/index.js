const Sequelize = require('sequelize');

const ezParkSequelize = new Sequelize('node', 'admin', '#e4O2n98OacO', {host:'ezparkusers.cn14hycosypl.ap-south-1.rds.amazonaws.com', dialect:'mysql' ,
    define: {
        freezeTableName: true
    }});

module.exports= ezParkSequelize;