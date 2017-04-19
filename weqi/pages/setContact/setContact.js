var app = getApp();
var config = require('../../config');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min');
var mapApi;
Page({
  data:{
    title:'打卡',
    signInfo:{},
    icon_contact:config.icon.avatar,
    icon_invite:config.icon.icon_invite
  },
  onLoad:function(){

    //验证用户是否添加公司，管理员否，跳转至不同页面


    this.setData({
      noContact:false,
      roleType:0,
      noContactIcon:config.icon.contact
    })
  },
  inviteContact:function(){
    wx.navigateTo({
      url:'../QRCode/QRCode'
    })
  },
  getSignRule:function(){

  },
  setDetailRule:function(e){
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url:'./detail/detail?status='+status
    })
  },
  inviteUser:function(){
    wx.navigateTo({
      url:'../QRCode/QRCode'
    })
  },
  approveContact:function(){
    wx.showToast({
      title:'已同意',
      icon:'success',
      success:function(){
        // setTimeout(function(){
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // },2000)
      }
    })
  }
});
