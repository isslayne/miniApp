var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');
var RuleList = require('../models/ruleList');

router.post('/:rid', function(req,res,next){
  console.log(req.body);
  var updateInfo = {
    status:req.body.status,
    address:req.body.address,
    addressName:req.body.addressName,
    latitude:req.body.latitude,
    longitude:req.body.longitude,
    name:req.body.name,
    workOnTime:req.body.workOnTime,
    workOffTime:req.body.workOffTime,
    workDay:req.body.workDay,
    signScope:req.body.signScope
  };

  RuleList.findByIdAndUpdate(req.params.rid,updateInfo,function(err,ruleList){
    if(err){
      res.json({
        status:10000,
        msg:'fail'
      });
      return
    }

    res.json({
      status:0,
      msg:'success',
      rid:req.params.rid
    });
  })
})

module.exports = router;
