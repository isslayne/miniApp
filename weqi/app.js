//app.js
var config = require('./config');
var wildDog = require('lib/wilddog-weapp-all');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs)
    wildDog.initializeApp(config.wildDog);
    this.wildDogData = wildDog.sync().ref('signInfo');
    // this.wildDogData.child('company').set({
    //   'name':'testv1io'
    // });

    // this.wildDogData.bindAsObject(this,'company', function(err){
    //   if(err != null){
    //     console.log(userInfo);
    //   }
    // })
    this.getUserInfo();
  },
  getUserInfo:function(cb){
    var that = this
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
})
