const tblSpaceId = require('../models/tblSpace_ID_Mapping');
const tblCompanySpace = require('../models/tblCompany_Space_Mapping');
const sequelize = require('sequelize');

const getSpaceAndCompany = async function (spaceid) {
    try {
        let space = await tblSpaceId.findOne({
            where: {
                spaceId: spaceid
            },
            raw: true
        });

        let companyInfo = [];
        if (space) {
            companyInfo = await tblCompanySpace.findAll({
                where: {
                    spaceId: spaceid
                },
                raw: true
            });
        }

        return [space, companyInfo];
    } catch (e) {
        console.log(e);
        return;
    }

}

const generateRandomNumber = async function (spaceid) {
    let code = Math.floor(Math.random() * 899999 + 100000);
    let companycode = await tblCompanySpace.findOne({
        where: {
            companyId: code
        },
        attributes: ['companyId'],
        raw: true
    });
    if (companycode && companycode.companyId) {
       return await generateRandomNumber(spaceid);
    }
    
    return code;
}
const addUpdateCompany = async function (companyData, spaceid) {
    try {
        let checkexisting = await tblCompanySpace.findOne({
            where: {
                companyName: companyData.companyName
            },
            raw: true
        })

        if (checkexisting && checkexisting.companyId) {
            let updateAvailableSlots = companyData.totalSlots - checkexisting.totalSlots + checkexisting.availableSlots;
            if (updateAvailableSlots < 0) {
                updateAvailableSlots = 0;
            }
            let companyUpdate = await tblCompanySpace.update(
                {
                    carSlots: companyData.carSlots,
                    scooterSlots: companyData.scooterSlots,
                    totalSlots: companyData.totalSlots,
                    availableSlots: updateAvailableSlots
                },
                {
                    where: {
                        companyId: checkexisting.companyId
                    }
                }
            );
            return true;
        } else {
            let generatedCode = await generateRandomNumber(spaceid);
            console.log(generatedCode);
            let addCompany = await tblCompanySpace.create({
                companyName: companyData.companyName,
                companyId: generatedCode,
                spaceId: spaceid,
                totalSlots: companyData.totalSlots,
                availableSlots: companyData.totalSlots,
                carSlots: companyData.carSlots,
                scooterSlots: companyData.scooterSlots
            });
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }

}

const removeTenant = async function(data){
    try{
        let archived = await tblCompanySpace.destroy({
            where:{
                companyId: data.company,
                spaceId: data.space
            }
        });
        return true;
    }catch (e){
        return false;
    }
}

module.exports = {
    getSpaceAndCompany,
    addUpdateCompany,
    removeTenant
}