var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');

router.get('/:cid', function(req,res,next){
  var query = {
    _id:req.params.cid
  };
    Company.findOne(query, function(err,company){
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
        res.json({
          status:0,
          msg:'success',
          company:company
        });
      }


    })
});

module.exports = router;
