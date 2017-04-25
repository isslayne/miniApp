var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');
var RuleList = require('../models/ruleList');
router.post('/:rid', function(req,res,next){
  RuleList.remove({_id:req.params.rid},function(err){
    if(err){
      res.json({
        status:10000,
        msg:'fail'
      });
      return
    }
    Company.update({_id:req.body.cid},{
      $pull:{ruleList:req.params.rid}
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
        msg:'success'
      });
    })

  })
});

module.exports = router;
