var app = getApp();
var config = require('../../config');

Page({
  data:{
    noRuleIcon:config.icon.noRule,
    addIcon:config.icon.addIcon
  },
  onLoad:function(){

  },
  onShow:function(){
    this.checkUserConfig();
  },
  checkUserConfig:function(){
    var _this = this;

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

      _this.userKey = app.globalData.userInfo.nickName;
      _this.ruleList = userConfig.ruleList;
      _this.userConfig = userConfig;

      if(userConfig.hasRule){
        if(userConfig.ruleList && userConfig.ruleList.length){

          var workDayRule = _this.ruleList[0].workDay;
          var formatRuleList = [];
          _this.ruleList.forEach(function(item,index){
            var workDayRule = item.workDay;
            var workRule = [];
            formatRuleList.push(item);

            workDayRule.forEach(function(itm,index){
              switch(Number(itm)){
                case 1:
                  workRule.push('周一');
                  break;
                case 2:
                  workRule.push('周二');
                  break;
                case 3:
                  workRule.push('周三');
                  break;
                case 4:
                  workRule.push('周四');
                  break;
                case 5:
                  workRule.push('周五');
                  break;
                case 6:
                  workRule.push('周六');
                  break;
                case 0:
                  workRule.push('周日');
                  break;
              }
            });
            formatRuleList[index].formatWorkDay = workRule.join('、');
          });

          if(_this.ruleList.length ===1){
            _this.ruleList[0].status = true;
            formatRuleList[0].status = true;
          }

          _this.setData({
            noRule:false,
            ruleList:formatRuleList
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
  enableRule:function(e){
    var _this = this;
    var formatRuleList = this.data.ruleList;
    _this.userConfig.ruleList.forEach(function(item,index){
      if(index == e.currentTarget.id){
          _this.userConfig.ruleList[index].status = true;
      }else{
          _this.userConfig.ruleList[index].status = false;
      }
    });

    formatRuleList.forEach(function(item,index){
      if(index == e.currentTarget.id){
          formatRuleList[index].status = true;
      }else{
          formatRuleList[index].status = false;
      }
    });
    _this.updateRuleList(e.currentTarget.dataset.rid,formatRuleList);



    // this.setData({
    //   ruleList:formatRuleList
    // });

  },
  updateRuleList:function(rid,formatRuleList){
    var _this = this;
    wx.request({
      url:config.server+'/enableRule/'+rid,
      method:'POST',
      data:{
        cid:_this.userConfig.cid
      },
      success:function(res){
        if(res.data.status===0){
          wx.setStorage({
            key:_this.userKey,
            data:_this.userConfig,
            success:function(){
              wx.showToast({
                title:'已启用',
                icon:'success'
              });
            }
          });
          _this.setData({
            ruleList:formatRuleList
          });
        }
      }
    })
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
      url:'../setRule/rule?ruleId='+id+'&rid='+e.currentTarget.dataset.rid
    })

  },
  onShareAppMessage:function(){
    return {
      title: '移动考勤-考勤规则列表',
      desc: '移动考勤，简化流程一步到位打卡签到',
      path: 'pages/ruleList/ruleList'
    }
  }
});
