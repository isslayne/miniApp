var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');

router.post('/:cid', function(req,res,next){
  var query = {
    _id:req.params.cid
  };

  var member = new Member({
    name:req.body.name,
    nickName:req.body.nickName,
    approveInfo:req.body.approveInfo,
    approveStatus:0
  });
  member.save(function(err){
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
      $addToSet : { member: member._id }
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
        uid:member._id,
        cid:req.params.cid
      });

    })

  })
});

module.exports = router;
