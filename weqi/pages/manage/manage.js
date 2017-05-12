var app = getApp();
var config = require('../../config');

Page({
  data:{
    icon_setting:config.icon.icon_setting,
    icon_contact:config.icon.icon_contact,
    icon_add:config.icon.icon_add,
    ruleType:0
  },
  onLoad:function(){
    this.checkUserConfig();
  },
  checkUserConfig:function(){
    var _this = this;
    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);
      _this.setData({
        ruleType:userConfig.ruleType
      })
    });
  },
  bindStartTime:function(e){
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTime:function(e){
    this.setData({
      endTime: e.detail.value
    })
  },
  chooseLocation: function () {
    // this.mapCtx.moveToLocation()
    var _this = this;
    wx.chooseLocation({
      success:function(res){
        console.log(JSON.stringify(res));
        //把选择的地点和公司名提交到服务器

        _this.setData({
          isActive:false,
          isSuccessActive:true,
          address:res.name
        });
      },
      fail:function(){

      }
    })
  },
  toggleDay:function(e){
    var id = e.currentTarget.id;
    var list = this.data.list;
    for(var i=0,len = list.length;i<len;++i){
      if (list[i].id == id) {
        list[i].selected = !list[i].selected;
      }
    }
    this.setData({
      list:list
    });
  },
  getRulePage:function(){
    wx.navigateTo({
      url:'../ruleList/ruleList'
    })
  },
  inputCompany:function(){
    wx.navigateTo({
      url:'../setContact/setContact'
    })
  },
  inviteContact:function(){
    wx.navigateTo({
      url:'../QRCode/QRCode'
    })
  },
  onShareAppMessage:function(){
    return {
      title: '移动考勤-个人中心',
      desc: '移动考勤，简化流程一步到位打卡签到',
      path: 'pages/manage/manage'
    }
  }
})
