const express = require('express');
const app = express();
let fetch = require('node-fetch');
const bodyParser = require('body-parser');
const {getSpaceAndCompany, addUpdateCompany, removeTenant,getOpDetails, addUpdateOperator, removeOp} = require('./utils/getSpaceConfig');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(function (req, res, next) {
    res.locals.userValue = null;
    next();
});

app.get('/', function (req, res) {
    let data = {};
    data.username = '';
    data.pass = '';
    res.render('home', data);
});

app.post('/', async function (req, res) {
    try {
        if (req.body && req.body.loguser && req.body.logpass) {
            let loginResp = {};
            const url = 'http://ec2-13-233-136-37.ap-south-1.compute.amazonaws.com/dashBoard/getUserLogin?username=' + req.body.loguser +
                '&pass=' + req.body.logpass;
            await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
            ).then(async (response) => {
                loginResp = await response.json();
            }
            ).catch(err => {
                console.log(err);
                return res.redirect(req.get('referer'));
            });
            if (loginResp.success === true && loginResp.data) {
                return res.redirect(301, loginResp.data.redirectUrl);
            } else {
                return res.redirect(req.get('referer'));
            }
        } else {
            return res.redirect(req.get('referer'));
        }

    } catch (err) {
        console.log(err);
        return res.redirect(req.get('referer'));
    }
});

app.get('/aurbis', async (req, res) => {
    try {
        if (!req.query.AuthToken || req.query.AuthToken != 'b4OCdksX14M4IC7guMwrmvuaF3yO3cpY') {
            res.redirect(301, '/');
        }
        let spaceId = 3;
        let [space, companyInfo] = await getSpaceAndCompany(spaceId);
        let opInfo = await getOpDetails(spaceId);
        let data = {};
        data.authToken = req.query.AuthToken;
        data.space = space;
        data.companyInfo = companyInfo;
        data.opInfo = opInfo;
        return res.render('dashboardView', data);
    } catch(e){
        console.log(e);
        return res.redirect(301,'/');
    }
});

app.post('/aurbis', async (req, res) => {
    try{
        if (req.body && req.body.companyName && (req.body.companyName).length>0) {
            let companyInfo ={};
            companyInfo.companyName = req.body.companyName;
            companyInfo.carSlots = parseInt(req.body.carSlots) || 0;
            companyInfo.scooterSlots = parseInt(req.body.scooterSlots) || 0;
            companyInfo.totalSlots = companyInfo.carSlots + companyInfo.scooterSlots;
            let isOperationDone = await addUpdateCompany(companyInfo, 3);
            return res.redirect(req.get('referer'));
        }
        else{
            throw new Error('invalid Details');
        }
    } catch(e){
        console.log(e);
        return res.redirect(req.get('referer'));
    }
});

app.post('/aurbisOperator', async(req, res)=>{
    try{
        if (req.body && req.body.opName ) {
            let opInfo ={};
            opInfo.opName = req.body.opName;
            opInfo.opContact = req.body.opContact || '';
            opInfo.opOther = req.body.opOther || '';
            let isOperationDone = await addUpdateOperator(opInfo, 3);
            return res.redirect(req.get('referer'));
        }
        else{
            throw new Error('invalid Details');
        }
    } catch(e){
        console.log(e);
        return res.redirect(req.get('referer'));
    }
})

app.get('/removeCompany', async(req,res) => {
    try{
        if (!req.query.AuthToken || req.query.AuthToken != 'b4OCdksX14M4IC7guMwrmvuaF3yO3cpY') {
            res.redirect(301, '/');
        }
        if(!req.query.companyCode || !req.query.space){
            res.redirect(301, '/');
        }
        let data={};
        data.company = parseInt(req.query.companyCode) || null;
        data.space = parseInt(req.query.space) || null;
        if(!data.company || !data.space) {
            res.redirect(301, '/');
        }
        let isRemoved = await removeTenant(data);
        console.log('deleted',isRemoved);
        res.redirect(301,'/aurbis?AuthToken=b4OCdksX14M4IC7guMwrmvuaF3yO3cpY');


    } catch(e){
        console.log(e);
        res.redirect(301, '/');
    }

});

app.get('/removeOperator', async(req,res) => {
    try{
        if (!req.query.AuthToken || req.query.AuthToken != 'b4OCdksX14M4IC7guMwrmvuaF3yO3cpY') {
            res.redirect(301, '/');
        }
        if(!req.query.opCode || !req.query.space){
            res.redirect(301, '/');
        }
        let data={};
        data.opCode = parseInt(req.query.opCode) || null;
        data.space = parseInt(req.query.space) || null;
        if(!data.opCode || !data.space) {
            res.redirect(301, '/');
        }
        let isRemoved = await removeOp(data);
        console.log('deleted',isRemoved);
        res.redirect(301,'/aurbis?AuthToken=b4OCdksX14M4IC7guMwrmvuaF3yO3cpY');


    } catch(e){
        console.log(e);
        res.redirect(301, '/');
    }

});

app.listen(8081, (err)=>{
    console.log("App Listening on port 8081");
});