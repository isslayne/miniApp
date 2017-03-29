var app = getApp();
var config = require('../../config');

Page({
  data:{

  },
  onload:function(){
    this.checkUserConfig();
  },
  checkUserConfig:function(){
    var _this = this;

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

      if(userConfig.hasRule){
        if(userConfig.ruleList && userConfig.ruleList.length){
          //已经设置规则，开始定位打卡
          _this.ruleList = userConfig.ruleList;
          _this.userConfig = userConfig;

          _this.setData({
            noRule:false,
            ruleList:_this.ruleList
          });

        }else{
          _this.setData({
            noRule:true,
            roleType:userConfig.ruleType
          });
        }
      }else{
        //显示无规则页面
        _this.setData({
          noRule:true
        });
      }

    });


  },
});
