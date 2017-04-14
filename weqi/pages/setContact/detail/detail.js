var app = getApp();
var config = require('../../../config');
Page({
  data:{
    icon_contact:config.icon.icon_contact,
    approveStatus:true
  },
  onLoad:function(option){
    var status = option.status;
    this.setData({
      approveStatus:status
    })
  },
  submit:function(){
    wx.showToast({
      title:'已同意',
      icon:'success',
      success:function(){
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2000)
      }
    })
  },
  refuseApplycation:function(){
    wx.showToast({
      title:'已拒绝',
      icon:'success',
      success:function(){
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2000)

      }
    })
  }
});
