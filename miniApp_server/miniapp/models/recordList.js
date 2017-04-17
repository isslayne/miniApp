var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordList = new Schema({
  recordId:{
    type:Schema.ObjectId,
    ref:'Member'
  },
  signDate:{
    type:String,
    default:''
  },
  signInTime:{
    type:String,
    default:''
  },
  signInAddress:{
    type:String,
    default:''
  },
  signInDistance:{
    type:Number
  },
  signInStatus:{
    type:Number
  },
  signOffTime:{
    type:String,
    default:''
  },
  signOffAddress:{
    type:String,
    default:''
  },
  signOffDistance:{
    type:Number
  },
  signOffStatus:{
    type:Number
  }
});

// module.exports = RecordList;

module.exports = mongoose.model('RecordList',RecordList);
