var config = require('./config');

App({
  onLaunch: function () {
    this.getUserInfo();
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo;
              var myselfInfo = wx.getStorageSync(res.userInfo.nickName) || {ruleType:0,hasCompany:false,hasRule:false};
              wx.setStorage({
                key:res.userInfo.nickName,
                data:myselfInfo
              });
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
});
