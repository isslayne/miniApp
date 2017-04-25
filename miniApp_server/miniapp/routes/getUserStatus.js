var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');

router.post('/', function(req,res,next){
  Company.findOne({_id:req.body.cid})
  .populate('ruleList')
  .exec(function(err,company){
    if(err){
      res.json({
        status:10000,
        msg:'fail'
      });
      return
    }

    if(company === null){
      res.json({
        status:10001,
        msg:'company null'
      });
    }else{
      Member.findOne({_id:req.body.uid},function(err,member){
        if(err){
          res.json({
            status:10000,
            msg:'fail'
          });
          return
        }

        if(member === null){
          res.json({
            status:10002,
            msg:'member null'
          });
        } else{
          res.json({
            status:0,
            msg:'success',
            userInfo:{
              company:company,
              member:member
            }
          });
        }
      })
    }
  })
});

module.exports = router;
