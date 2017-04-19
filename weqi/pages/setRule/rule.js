var app = getApp();
Page({
  data:{
    btnDisabled:true,
    startTime:"08:30",
    endTime:"17:30",
    distance:['200米','500米','700米','1000米','1200米','1500米'],
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
      this.checkUserConfig(this.ruleId);
    }else{
      this.checkUserConfig();
    }


  },
  checkUserConfig:function(ruleId){
    var _this = this;

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);
      _this.userConfig = userConfig;

      _this.userKey = app.globalData.userInfo.nickName;

      if(userConfig.currentRule && ruleId !=null){
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
          showDelBtn:true,
          btnDisabled:false,
          list:curweekList,
          currentRule:curRuleList,
          latitude:userConfig.currentRule.latitude,
          longitude:userConfig.currentRule.longitude,
          startTime:userConfig.currentRule.workOnTime,
          endTime:userConfig.currentRule.workOffTime,
          address:userConfig.currentRule.addressName,
          addressName:userConfig.currentRule.addressName,
          name:userConfig.currentRule.name,
          pickedDistance:userConfig.currentRule.signScope+'米'
        });
      }else{
        _this.setData({
          pickedDistance:'500米'
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
  bindDistance:function(e){
    var _this = this;
    var filterList = this.data.list.filter(function(item){
      return item.selected === true;
    });

    this.setData({
      index:e.detail.value,
      pickedDistance: _this.data.distance[e.detail.value]
    });

    if(this.data.name && this.data.name.length && filterList.length && this.data.pickedDistance && this.data.pickedDistance.length){
      this.setData({
        btnDisabled:false
      })
    }else {
      this.setData({
        btnDisabled:true
      })
    }

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
          address:res.name.length ? res.name : res.address,
          addressName:res.address,
          latitude:res.latitude,
          longitude:res.longitude,
        });
      },
      fail:function(){

      }
    })
  },
  inputCompanyName:function(e){
    var filterList = this.data.list.filter(function(item){
      return item.selected === true;
    });

    if(e.detail.value.trim().length && filterList.length && this.data.pickedDistance && this.data.pickedDistance.length){
      this.setData({
        btnDisabled:false
      })
    }else {
      this.setData({
        btnDisabled:true
      })
    }
    this.setData({
      name:e.detail.value.trim()
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
      addressName:_this.data.addressName,
      latitude:_this.data.latitude,
      longitude:_this.data.longitude,
      name:_this.data.name,
      workOnTime:_this.data.startTime,
      workOffTime:_this.data.endTime,
      workDay:pickedWeekDay
    }

    if(this.userConfig.currentRule &&   this.ruleId !=null){
      // pickedRule.signScope = this.userConfig.currentRule.signScope;
      pickedRule.signScope = this.data.pickedDistance.split('米')[0];
      this.userConfig.currentRule = pickedRule;
      this.userConfig.ruleList[_this.ruleId] = pickedRule;
    } else{
        pickedRule.status = false;
        pickedRule.signScope = this.data.pickedDistance.split('米')[0];
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
  deleteRule:function(){
    var _this = this;

      wx.showModal({
        title: "确定要删除吗？",
        content: "删除后将无法恢复",
        showCancel: true,
        cancelText:'再想想',
        cancelColor:'#000',
        confirmText: "删除",
        confirmColor:'#f00',
        success:function(res){
          if(res.confirm){
            _this.userConfig.currentRule = null;
            _this.userConfig.ruleList.splice(this.ruleId,1);
            if(!_this.userConfig.ruleList.length){
                _this.userConfig.hasRule =false;
            }

            wx.setStorage({
              key:_this.userKey,
              data:_this.userConfig,
              success:function(){
                wx.showToast({
                  icon:'success',
                  title:'删除成功',
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
          }
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

    var filterList = list.filter(function(item){
      return item.selected === true;
    });

    if(this.data.name && this.data.name.length && filterList.length && this.data.pickedDistance && this.data.pickedDistance.length){
      this.setData({
        btnDisabled:false
      })
    }else {
      this.setData({
        btnDisabled:true
      })
    }

    this.setData({
      list:list
    });

  }
})
