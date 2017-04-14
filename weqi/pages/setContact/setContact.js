var app = getApp();
var config = require('../../config');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min');
var mapApi;
Page({
  data:{
    title:'打卡',
    signInfo:{},
    icon_contact:config.icon.icon_contact
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
  }
});
