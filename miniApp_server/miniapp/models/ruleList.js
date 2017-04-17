var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RuleList = new Schema({
  id:Schema.Types.ObjectId,
  name:{
    type:String,
    default:''
  },
  address:{
    type:String,
    default:''
  },
  latitude:{
    type:Number
  },
  longitude:{
    type:Number
  },
  addressName:{
    type:String,
    default:''
  },
  signScope:{
    type:Number,
    default:1000
  },
  workOnTime:{
    type:String,
    default:''
  },
  workOffTime:{
    type:String,
    default:''
  },
  workDay:{
    type:String
  }
});

// module.exports = RuleList;
module.exports = mongoose.model('RuleList', RuleList);
