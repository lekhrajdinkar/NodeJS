const Joi = require('joi');
const config = require('config');
//const sgt = require('nodemailer-sendgrid-transport');
//const nm = require('nodemailer');
const fundModel = require('./../../model/fund-model')


//---Email- nodemailer
// const transporter = nm.createTransport(sendgridTransport({
//     auth:{
//         api_key:config.get('sendgrid-api-key')
//     }
// }));



getAll = (req,resp,next)=> {
    fundModel.getAll(resp);
}

getLatest = (req,resp,next)=> {
    fundModel.getLatest(resp);
}

getByUser = (req,resp,next)=> {
    fundModel.getByUser(req,resp);
}

getById  = (req,resp,next)=> {
    fundModel.getById(req,resp);
}

addFund = (req,resp,next)=> {
    
    console.log('adding fund ',req.body.abbr, req.body.num );

    // JOI-validate http request body
    const result = Joi.validate(req.body, schema);
    //console.log('JOI result  : ', result);
    if(result.error) {
        let err = new Error();
        err.status = 422 ;
        err.msg = result.error.details[0].message;
        return next(err);
    }

    //Store  in Mongo
    fundModel.add(new fundModel.Fund (req.body.abbr, req.body.num, req.body.created_by) );

    //send response
    resp.send('success...');
}

deleteById = (req,resp,next)=> {
    fundModel.deleteById(req,resp);
}

updateById = (req,resp,next)=> {
    fundModel.updateById(req,resp);
}


//----------- JOI Validator ----------

const schema = { 
    abbr: Joi.string().min(5).required(),
    num : Joi.string().min(8).max(8).required(),
    created_by : Joi.string().min(8).required()
}

module.exports = {
    addFund : addFund
    ,getAll : getAll
    ,getLatest : getLatest
    ,getByUser : getByUser
    ,getById :getById
    ,deleteById : deleteById
    ,updateById : updateById
}