var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Member = require('../models/member');
var RuleList = require('../models/ruleList');

router.post('/',function(req,res,next){
  // var name = req.body.name;
  // console.log(req);
  var ruleList = req.body.rule;
  ruleList.signScope = 1000;
  ruleList.workOnTime ='08:30';
  ruleList.workOffTime ='17:30';
  ruleList.workDay ='1,2,3,4,5';
  ruleList.status =true;

  var company = new Company({name:req.body.companyName});

  var member = new Member({
    name:req.body.memberName,
    nickName:req.body.nickName,
    approveStatus:1,
    roleType:1
  });

  // member.company.push(company);
  member.save(function(err){
    if(err){
      res.json({
        status:10000,
        msg:'fail'
      });
      return
    }

    var curRuleList = new RuleList(ruleList);
    curRuleList.save(function(err){
      if(err){
        res.json({
          status:10000,
          msg:'fail'
        });
        return
      }

      console.log('member');
      console.log(member);
      company.member.push(member);
      company.ruleList.push(curRuleList);
      company.save(function(err){
        if(err){
          res.json({
            status:10000,
            msg:'fail'
          });
          return
        }
        Member.update({
          _id:member._id
        },{
          $addToSet:{company:company._id},
          cid:company._id
        },function(err){
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
          })

        })
      });

    });

  })


});

module.exports = router;
