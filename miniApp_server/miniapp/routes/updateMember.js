var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');

router.post('/:uid',function(req,res,next){
    var uid = req.params.uid;
    var isNewDay = req.body.isNewDay;
    var query = {
      _id:uid
    };
    Member.findByIdAndUpdate(uid, {isNewDay:isNewDay},function(err,member){
      
    })
});

module.exports = router;
