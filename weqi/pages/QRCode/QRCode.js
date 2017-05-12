var app = getApp();
var config = require('../../config');
var jrQrcode =  require('../../lib/qrcode/index');

Page({
  data:{
    QRcode_icon:config.icon.inviteQRcode
  },
  onLoad:function(){
    this.checkUserConfig();
  },
  checkUserConfig:function(){
    var _this = this;

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);
      _this.userConfig = userConfig;
      var QRcodeUrl =  config.inviteCode+'#'+_this.userConfig.cid;
      var Qrcode = jrQrcode.toDataURL(QRcodeUrl,4);
      _this.setData({
        QRcode_icon:Qrcode
      })
    });
  },
  onShareAppMessage:function(){
    return {
      title: '移动考勤-邀请成员',
      desc: '移动考勤，简化流程一步到位打卡签到',
      path: 'pages/QRCode/QRCode'
    }
  }
});
