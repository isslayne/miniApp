var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Member = Schema({
    uid:Schema.ObjectId,
    type:{
      type:String,
      default:''
    },
    name:{
      type:String,
      default:''
    },
    approveStatus:{
      type:Number,
      default:0
    },
    approveInfo:{
      type:String,
      default:''
    },
    roleType:{
      type:Number,
      default:0
    },
    company:{
       type:Schema.ObjectId,
       ref:'Company'
    },
    recordList:[{
      type:Schema.ObjectId,
      ref:'RecordList'
    }]
});

// module.exports = Member;
module.exports = mongoose.model('Member', Member);
