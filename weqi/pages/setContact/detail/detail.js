var app = getApp();
var config = require('../../../config');
Page({
  data:{
    icon_contact:config.icon.avatar,
    approveStatus:true
  },
  onLoad:function(option){
    this.option = option;
    var status = option.status;
    this.setData({
      approveStatus:status
    });
    this.getUserInfo(option.uid);
  },
  getUserInfo:function(uid){
    var _this = this;
    wx.request({
      url:config.server+'/getDetailUserInfo/'+uid,
      method:'GET',
      success:function(res){
        if(res.data.status !== 0){
          wx.showToast({
            title:res.data.msg,
            icon:'success'
          });
        }else {
          _this.setData({
            member:res.data.member
          })
        }
      }
    })
  },
  submit:function(){
    var _this = this;
    wx.request({
      url:config.server+'/updateMemberInfo/'+_this.option.uid,
      method:'POST',
      data:{
        approveStatus:1,
      },
      success:function(res){
        if(res.data.status !== 0){
          wx.showToast({
            title:res.data.msg,
            icon:'success'
          });
        }else {
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
        }
      }
    })
    // wx.showToast({
    //   title:'已同意',
    //   icon:'success',
    //   success:function(){
    //     setTimeout(function(){
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     },2000)
    //   }
    // })
  },
  refuseApplycation:function(){
    var _this = this;
    wx.request({
      url:config.server+'/updateMemberInfo/'+_this.option.uid,
      method:'POST',
      data:{
        approveStatus:2
      },
      success:function(res){
        if(res.data.status !== 0){
          wx.showToast({
            title:res.data.msg,
            icon:'success'
          });
        }else {

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
      }
    })

    // wx.showToast({
    //   title:'已拒绝',
    //   icon:'success',
    //   success:function(){
    //     setTimeout(function(){
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     },2000)
    //
    //   }
    // })
  }
});
