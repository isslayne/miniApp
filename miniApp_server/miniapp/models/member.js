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
    nickName:{
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
    isNewDay:{
      type:String,
      default:''
    },
    company:{
       type:Schema.ObjectId,
       ref:'Company'
    },
    cid:{
      type:String,
      default:''
    },
    recordList:[{
      type:Schema.ObjectId,
      ref:'RecordList'
    }]
});

// module.exports = Member;
module.exports = mongoose.model('Member', Member);
