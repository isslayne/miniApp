var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Company = require('../models/company');
var Member = require('../models/member');

router.get('/', function(req,res,next){
  console.log(req.query);
  var query = {
    name:req.query.uid
  };
  Member.findOne(query, function(err,member){
    if(err ){
      res.json({
        status:10000,
        msg:'fail'
      });
      return
    }

    if(member === null){
      res.json({
        status:10002,
        msg:'null'
      });
    }else {
      Company.findOne({_id:member.cid})
      .populate('ruleList')
      .exec(function(err,company){
        console.log(member.cid);
        if(err){
          res.json({
            status:10000,
            msg:'fail company'
          });
          return
        }

        if(company === null){
          res.json({
            status:100001,
            msg:'null'
          });
        }else{
          res.json({
            status:0,
            msg:'success',
            company:company,
            member:member
          });
        }

      })
    }

  });
  // Member.findOne(query)
  //   .populate('company')
  //   .exec(function(err,member){
  //     console.log(member.company);
  //     if(member === null){
  //       res.json({
  //         status:100001,
  //         msg:'null'
  //       });
  //     }else{
  //       res.json({
  //         status:0,
  //         msg:'success',
  //         company:member
  //       });
  //     }
  //   })

});

module.exports = router;
