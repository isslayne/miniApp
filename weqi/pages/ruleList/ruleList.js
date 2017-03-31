var app = getApp();
var config = require('../../config');

Page({
  data:{
    noRuleIcon:config.icon.noRule,
    addIcon:config.icon.addIcon
  },
  onLoad:function(){
    this.checkUserConfig();
  },
  checkUserConfig:function(){
    var _this = this;

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

      _this.userKey = app.globalData.userInfo.nickName;
      if(userConfig.hasRule){
        if(userConfig.ruleList && userConfig.ruleList.length){

          _this.ruleList = userConfig.ruleList;
          _this.userConfig = userConfig;

          var workDayRule = _this.ruleList[0].workDay;

          _this.ruleList.forEach(function(item){
            var workDayRule = item.workDay;
            var workRule = [];

            workDayRule.forEach(function(itm,index){
              switch(itm){
                case 1:
                  workRule.push('一');
                  break;
                case 1:
                  workRule.push('二');
                  break;
                case 3:
                  workRule.push('三');
                  break;
                case 4:
                  workRule.push('四');
                  break;
                case 5:
                  workRule.push('五');
                  break;
                case 6:
                  workRule.push('六');
                  break;
                case 7:
                  workRule.push('七');
                  break;
              }
            });
            item.workDay = workRule;
          });


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
  createRule:function(){
    var _this = this;
    this.userConfig.currentRule ={};
    wx.setStorage({
      key:_this.userKey,
      data:_this.userConfig
    })
    wx.navigateTo({
      url:'../setRule/rule'
    })
  },
  setDetailRule:function(e){
    var _this = this;
    console.log(JSON.stringify(e));
    var id= e.currentTarget.id;
    //所选的规则
    this.userConfig.currentRule = this.userConfig.ruleList[id];
    wx.setStorage({
      key:_this.userKey,
      data:_this.userConfig
    })

    wx.navigateTo({
      url:'../setRule/rule'
    })

  }
});
