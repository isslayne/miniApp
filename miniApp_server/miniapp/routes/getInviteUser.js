var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');
var _ = require('lodash');

router.post('/', function(req,res,next){
    var query = {
      _id:req.body.cid
    };

    Company.findOne(query)
    .populate('member')
    .exec(function(err,company){
      console.log(company);
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
          msg:'null'
        });
      }else{
        var inviteUser = _.filter(company.member,{roleType:0});
        res.json({
          status:0,
          msg:'success',
          member:inviteUser
        });
      }
    })
});

module.exports = router;
