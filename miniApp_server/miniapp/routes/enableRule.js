var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');
var RuleList = require('../models/ruleList');

router.post('/:rid', function(req,res,next){
  Company.findOne({_id:req.body.cid})
  .populate('ruleList')
  .exec(function(err, company){
    if(err){
      res.json({
        status:10000,
        msg:'fail'
      });
      return
    }

    if(company === null){
      res.json({
        status:100001,
        msg:'null'
      });
    }else{

      company.ruleList.forEach(function(item,index){
        if(item._id == req.params.rid){
          RuleList.findByIdAndUpdate(req.params.rid,{status:true}, function(err){
            if(err){
              res.json({
                status:10000,
                msg:'fail'
              });
              return
            }
            if(index === (company.ruleList.length -1)){
              res.json({
                status:0,
                msg:'success'
              });
            }
          })


        } else{
          RuleList.findByIdAndUpdate(item._id,{status:false}, function(err){
            if(err){
              res.json({
                status:10000,
                msg:'fail'
              });
              return
            }
            if(index === (company.ruleList.length-1)){
              res.json({
                status:0,
                msg:'success'
              });
            }
          });
        }
      });
    }
  })
});

module.exports = router;
