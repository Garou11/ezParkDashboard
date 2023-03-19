const tblSpaceId = require('../models/tblSpace_ID_Mapping');
const tblCompanySpace = require('../models/tblCompany_Space_Mapping');
const sequelize = require('sequelize');
const operators = require('../models/operators');

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

const getOpDetails = async function (spaceid) {
    try {
        let opInfo = await operators.findAll({
            where: {
                spaceId : spaceid
            },
            raw: true
        });

        return opInfo;
    } catch (e) {
        console.log(e);
        return;
    }

}

const generateRandomNumberOp = async function (spaceid) {
    let code = Math.floor(Math.random() * 899999 + 100000);
    let opcode = await operators.findOne({
        where: {
            operatorId: code
        },
        attributes: ['operatorId'],
        raw: true
    });
    if (opcode && opcode.operatorId) {
       return await generateRandomNumberOp(spaceid);
    }
    
    return code;
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
            let updateAvailableCarSlots = companyData.carSlots - checkexisting.carSlots + checkexisting.availableCarSlots;
            let updateAvailableScooterSlots = companyData.scooterSlots - checkexisting.scooterSlots + checkexisting.availableScooterSlots;
            if (updateAvailableCarSlots < 0) {
                updateAvailableCarSlots = 0;
            }
            if (updateAvailableScooterSlots < 0) {
                updateAvailableScooterSlots = 0;
            }
            let companyUpdate = await tblCompanySpace.update(
                {
                    carSlots: companyData.carSlots,
                    scooterSlots: companyData.scooterSlots,
                    totalSlots: companyData.totalSlots,
                    availableCarSlots: updateAvailableCarSlots,
                    availableScooterSlots: updateAvailableScooterSlots
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
                availableCarSlots: companyData.carSlots,
                availableScooterSlots: companyData.availableScooterSlots,
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

const addUpdateOperator = async function (opData, spaceid) {
    try {
        let checkexisting = await operators.findOne({
            where: {
                operator: opData.opName
            },
            raw: true
        })

        if (checkexisting && checkexisting.operatorId) {
            let opUpdate = await operators.update(
                {
                    operator: opData.opName,
                    contact: opData.opContact,
                    meta: opData.opOther
                },
                {
                    where: {
                        operatorId: checkexisting.operatorId
                    }
                }
            );
            return true;
        } else {
            let generatedCode = await generateRandomNumberOp(spaceid);
            console.log(generatedCode);
            let addOp = await operators.create({
                operatorId: generatedCode,
                operator: opData.opName,
                contact: opData.opContact,
                meta: opData.opOther,
                spaceId: spaceid
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
const removeOp = async function(data){
    try{
        let archived = await operators.destroy({
            where:{
                operatorId: data.opCode,
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
    removeTenant,
    getOpDetails,
    addUpdateOperator,
    removeOp
}