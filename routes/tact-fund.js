const express  = require('express');
const path = require('path');
const router = express.Router();
const bp = require('body-parser');
const fundJsonData = require('../file/fund-data')


//-------------
//in-memory storage.
const funds = [
{fund_number : '11000014', fund_abbr : 'abbr14'}, 
{fund_number : '11000020', fund_abbr : 'abbr20'}
] ;

//const funds1= 'abc'
//const funds2 = 20 ;
//const funds3 = {p1 : 1 , p2: 2};

//-------------
// MWE to parse  JSON input body from request.
router.use(express.json());

//1.1 sending String, html, redirection
router.get('/fund-status',(req,resp,next)=> {
    //resp.redirect('./status2')
    //resp.send('<html><h1>status : Fund Services is running</h1></html>');
    resp.send({status : 'running'});
});

//1.2 Sending array, number, object,etc
router.get('/funds',(req,resp,next)=> {
    console.log('/tact/funds get',req.body);
    //resp.redirect('./status2')
    //resp.send(JSON.stringify(funds)); 
    resp.send(funds); //same as above.
    // [{"fund_number":"11000014","fund_abbr":"abbr14"},{"fund_number":"11000020","fund_abbr":"abbr20"}]
});

//2. reading body
router.post('/add-fund-1',(req,resp,next)=> {
    console.log('/tact/funds post',req.body);
    funds.push({fund_number : req.body.num, fund_abbr : req.body.abbr});
    resp.send(funds);
});

//3. below route would take input from form body which come as url-encoded string.
router.use(bp.urlencoded());
router.post('/add-fund-2',(req,resp,next)=> {
    console.log('/tact/funds post',req.body);
    funds.push({fund_number : req.body.num, fund_abbr : req.body.abbr});
    resp.send(funds);
});

//4. dynamic path - path param, qp, fragments
router.get('/funds/:abbr/:num',(req,resp,next)=> {
    console.log('/funds/a/b get',req.body);
    funds.push({fund_number : req.params.num, fund_abbr : req.params.abbr});
    resp.send(funds);
});

//----------- FS ---------------------
//5.1. store in JSON file not in Mongo
router.get('/add-fund-data/:abbr/:num',(req,resp,next)=> {
    
    let f = new fundJsonData(req.params.abbr, req.params.num );
    console.log('writing to json file', f.abbr, f.num);
    f.save(f);
    resp.sendFile(path.join(path.dirname(process.mainModule.filename), 'data', 'fund-data.json'));
});

//5.2. read from JSON file not in Mongo ********
router.get('/fund-data',(req,resp,next)=> {
    
    //way1 - directly send file contect
    //resp.sendFile(path.join(path.dirname(process.mainModule.filename), 'data', 'fund-data.json'));

    //way2 - read json file and parse them into JS array/obj. send that then. 
    const ret =   fundJsonData.fetchAll((ret) => {
        resp.send(ret)
    });
    
});


module.exports = router ;