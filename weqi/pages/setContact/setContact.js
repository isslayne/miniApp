var app = getApp();
var config = require('../../config');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min');
var mapApi;
Page({
  data:{
    title:'打卡',
    signInfo:{},
    icon_contact:config.icon.avatar,
    icon_invite:config.icon.icon_invite,
    noContactIcon:config.icon.contact
  },
  onLoad:function(){

    //验证用户是否添加公司，管理员否，跳转至不同页面


    // this.setData({
    //   noContact:false,
    //   roleType:0,
    //   noContactIcon:config.icon.contact
    // })

  },
  onShow:function(){
    this.getSignRule();
  },
  inviteContact:function(){
    wx.navigateTo({
      url:'../QRCode/QRCode'
    })
  },
  getSignRule:function(){
    var _this = this;
    var localUserConfig;
    app.getUserInfo(function(userInfo){
      this.localUserConfig = localUserConfig = wx.getStorageSync(app.globalData.userInfo.nickName);
    });

    wx.request({
      url:config.server+'/getInviteUser',
      method:'POST',
      data:{
        cid:localUserConfig.cid
      },
      success:function(res){
        if(res.data.status ===0){
          if(res.data.member.length){
            _this.setData({
              noContact:false,
              invitedUser:res.data.member
            });
          } else{
            _this.setData({
              noContact:true
            });
          }

        }else{
          wx.showToast({
            title:res.data.msg,
            icon:'success'
          });
        }
      }
    });
  },
  setDetailRule:function(e){
    var status = e.currentTarget.dataset.status;
    var uid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'./detail/detail?status='+status+'&uid='+uid
    })
  },
  inviteUser:function(){
    wx.navigateTo({
      url:'../QRCode/QRCode'
    })
  },
  approveContact:function(e){
    var _this = this;
    wx.request({
      url:config.server+'/updateMemberInfo/'+e.currentTarget.dataset.id,
      method:'POST',
      data:{
        approveStatus:1,
        cid:this.localUserConfig.cid
      },
      success:function(res){
        if(res.data.status !== 0){
          wx.showToast({
            title:res.data.msg,
            icon:'success'
          });
        }else {
          _this.data.invitedUser.forEach(function(item){
            if(item._id === e.currentTarget.dataset.id){
              item.approveStatus = 1;
            }
          });
          _this.setData({
            invitedUser:_this.data.invitedUser
          })
          wx.showToast({
            title:'已同意',
            icon:'success'
          })
        }
      }
    })
  }
});
