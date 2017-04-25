var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');

router.post('/:uid',function(req,res,next){
    var uid = req.params.uid;
    var updateData ={};
    var isNewDay = req.body.isNewDay;
    var approveStatus = req.body.approveStatus || 0;
    if(approveStatus){
      updateData.approveStatus = req.body.approveStatus;
    }else{
      updateData.isNewDay = isNewDay
    }
    if(isNewDay){
      updateData.isNewDay = isNewDay;
    }else{
      updateData.approveStatus = req.body.approveStatus;
    }

    var query = {
      _id:uid
    };
    Member.findByIdAndUpdate(uid, updateData,function(err,member){
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
});

module.exports = router;
