var app = getApp();
Page({
  data:{
    startTime:"08:30",
    endTime:"17:30",
    list:[{
      id:1,
      name:'一',
      selected:true
    },{
      id:2,
      name:'二',
      selected:true
    },{
      id:3,
      name:'三',
      selected:true
    },{
      id:4,
      name:'四',
      selected:true
    },{
      id:5,
      name:'五',
      selected:true
    },{
      id:6,
      name:'六',
      selected:false
    },{
      id:0,
      name:'日',
      selected:false
    }
  ]
  },
  onLoad:function(option){
    if(option.ruleId){
      this.ruleId = option.ruleId;
    }

    this.checkUserConfig();
  },
  checkUserConfig:function(){
    var _this = this;

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);
      _this.userConfig = userConfig;

      _this.userKey = app.globalData.userInfo.nickName;

      if(userConfig.currentRule){
        var curRuleList = [];
        var curweekList = [{
          id:1,
          name:'一',
          selected:false
        },{
          id:2,
          name:'二',
          selected:false
        },{
          id:3,
          name:'三',
          selected:false
        },{
          id:4,
          name:'四',
          selected:false
        },{
          id:5,
          name:'五',
          selected:false
        },{
          id:6,
          name:'六',
          selected:false
        },{
          id:0,
          name:'日',
          selected:false
        }];

        userConfig.currentRule.workDay.forEach(function(item){
          curweekList.forEach(function(subItm){
            if(subItm.id == item){
              subItm.selected = true;
            }
          });

        });

        _this.setData({
          list:curweekList,
          currentRule:curRuleList,
          startTime:userConfig.currentRule.workOnTime,
          endTime:userConfig.currentRule.workOffTime,
          address:userConfig.currentRule.addressName,
          name:userConfig.currentRule.addressName
        })
      }
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
        // console.log(JSON.stringify(res));
        //把选择的地点和公司名提交到服务器

        _this.setData({
          isActive:false,
          isSuccessActive:true,
          address:res.name,
          addressName:res.address,
          latitude:res.latitude,
          longitude:res.longitude,
        });
      },
      fail:function(){

      }
    })
  },
  saveRule:function(){
    var _this = this;
    var pickedWeekDay=[];
    var pickedRule = {};
    this.data.list.forEach(function(item){
      if(item.selected == true){
        pickedWeekDay.push(item.id);
      }
    });

    pickedRule = {
      address:_this.data.address,
      addressName:_this.data.name,
      latitude:_this.data.latitude,
      longitude:_this.data.longitude,
      name:_this.data.name,
      workOnTime:_this.data.startTime,
      workOffTime:_this.data.endTime,
      workDay:pickedWeekDay
    }

    if(this.userConfig.currentRule){
      pickedRule.signScope = this.userConfig.currentRule.signScope;
      this.userConfig.currentRule = pickedRule;
      this.userConfig.ruleList[_this.ruleId] = pickedRule;
    } else{
        pickedRule.signScope =1000;
        this.userConfig.ruleList.push(pickedRule);
    }
    wx.setStorage({
      key:_this.userKey,
      data:_this.userConfig,
      success:function(){
        wx.showToast({
          icon:'success',
          title:'保存成功',
          success:function(){
            setTimeout(function(){
              wx.navigateBack({
                delta:1
              });
            },1500);
          }
        });
      }
    });
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
  }
})
