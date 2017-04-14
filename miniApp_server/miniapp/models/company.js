var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Company = new Schema({
  type:{
    type:String,
    default:''
  },
  name:{
    type:String,
    default:''
  },
  member:[{
    type:Schema.ObjectId,
    ref:'Member'
  }],
  ruleList:[{
    type:Schema.ObjectId,
    ref:'RuleList'
  }]
});

module.exports = Company;

// mongoose.model('Company',Company);
