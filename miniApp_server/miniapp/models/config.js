var mongoose = require('mongoose');

var Company = require('./company');
var Memeber = require('./member');
var RecordList = require('./recordList');
var RuleList = require('./ruleList');

var config  = {
  init:function(){
    mongoose.model('Company',Company);
    mongoose.model('Memeber',Memeber);
    mongoose.model('RecordList',RecordList);
    mongoose.model('RuleList',RuleList);
  }
};

module.exports = config;
 
