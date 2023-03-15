const express = require('express');
const app = express();
let fetch = require('node-fetch');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function(req,res,next){
    res.locals.userValue = null;
    next();
});

app.get('/', function (req, res) {
    let data ={};
    data.username='';
    data.pass='';
    res.render('home',data);
});

app.post('/dashboard', async function (req, res) {
    try {
        if (req.body && req.body.loguser && req.body.logpass) {
            let loginResp ={};
            const url ='http://ec2-13-233-136-37.ap-south-1.compute.amazonaws.com/dashBoard/getUserLogin?username='+req.body.loguser+
                '&pass='+req.body.logpass;
            await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
            ).then(async(response) =>  {
                loginResp = await response.json();
            }
            ).catch(err => {
                console.log(err);
                return res.redirect(301,'/');
            });
            if( loginResp.success === true && loginResp.data) {
                return res.redirect(301, loginResp.data.redirectUrl);
            } else{
                return res.redirect(301,'/');
            }
        } else {
            return res.redirect(301,'/');
        }

    } catch (err) {
        console.log(err);
        return res.redirect(301,'/');
    }
});

app.get('/aurbis', async (req,res) => {
    let data ={};
    res.render('dashboardView');
});

app.listen(8081);