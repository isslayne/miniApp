var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');
var RuleList = require('../models/ruleList');

router.post('/:cid', function(req,res,next){
    var ruleList = new RuleList({
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
    });

    ruleList.save(function(err){
      if(err){
        res.json({
          status:10000,
          msg:'fail'
        });
        return
      }

      Company.update({
        _id:req.params.cid
      },{
        $addToSet : { ruleList: ruleList._id }
      }, function(err){
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
          cid:req.params.cid,
          rid:ruleList._id
        });

      })

    })
});

module.exports = router;
