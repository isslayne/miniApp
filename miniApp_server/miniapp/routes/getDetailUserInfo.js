var express = require('express');
var router = express.Router();
var Member = require('../models/member');

router.get('/:uid', function(req,res,next){
  Member.findOne({_id:req.params.uid}, function(err,member){
    if(err){
      res.json({
        status:10000,
        msg:'fail'
      });
      return
    }

    if(member === null){
      res.json({
        status:10001,
        msg:'null'
      });
    }else{
      res.json({
        status:0,
        msg:'success',
        member:member
      });
    }
  })
});

module.exports = router;
