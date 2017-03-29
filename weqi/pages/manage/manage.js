var app = getApp();
var config = require('../../config');

Page({
  data:{
    icon_setting:config.icon.icon_setting,
    icon_contact:config.icon.icon_contact,
    icon_add:config.icon.icon_add
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
      url:'../setting/setting'
    })
  }
})
