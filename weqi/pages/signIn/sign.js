var app = getApp();
var config = require('../../config');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min');
var mapApi;
Page({
  data:{
    title:'打卡',
    signInfo:{},
    noRuleIcon:config.icon.noRule,
    signInIcon:config.icon.signInIcon,
    signSucIcon:config.icon.signSucIcon,
    rotateCount:0
  },
  onReady:function(){

  },
  onLoad:function(){
    // wx.redirectTo({
    //   url:'../logs/logs'
    // });
    // wx.redirectTo({
    //   url:'../activeSignInfo/active'
    // });

    this.animation = wx.createAnimation({
        duration:100
    });

    mapApi = new QQMapWX({
      key:config.mapKey
    });
    //验证用户是否添加公司，管理员否，跳转至不同页面
    this.checkUserConfig();

    this.getLocation();

    this.setData({
      noRule:1,
      roleType:0
    });

    this.rotateAnimation();

    this.liveTime();
  },
  liveTime:function(time){
    var _this = this;
    var date  = new Date();
    var nowHour = date.getHours();
    var nowMinute = date.getMinutes();
    var nowSecond = date.getSeconds();

    this.timer = setInterval(function(){
      nowSecond ++;
      if(nowSecond >=60){
        nowMinute ++;
        nowSecond =0;
      }
      if(nowMinute >=60){
        nowMinute = 0;
        nowHour ++;
      }
      if(nowHour >= 24){
        nowHour =0;
      }

      _this.setData({
        liveTime:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)+':'+_this.toTenFormat(nowSecond)
      })
    },1000);

  },
  toTenFormat:function(number){
    number = Number(number) < 10 ? "0"+Number(number) : Number(number);
    return number;
  },
  rotateAnimation:function(){
    var _this = this;
      setInterval(function(){
        _this.setData({
          animation:_this.animation.rotate((++_this.data.rotateCount)*20).step().export()
        })
      },100);
  },
  checkUserConfig:function(){
    //ruleType:1 普通员工，0 管理员
    var uid = app.globalData.userInfo? (app.globalData.userInfo.nickName || null) : null;
    var userConfig = wx.getStorageSync(uid) ||app.getUserInfo(function(){
      return wx.getStorageSync(app.globalData.userInfo.nickName);
    });

    if(userConfig.hasRule){
      if(userConfig.ruleList && userConfig.ruleList.length){
        this.setData({
          noRule:1,
          roleType:userConfig.ruleType
        })
      }else{
        this.setData({
          noRule:0,
          roleType:userConfig.ruleType
        })
      }
    }else{
      wx.redirectTo({
        url:'../activeSignInfo/active'
      });
    }
  },
  signIn:function(){
    //打卡判断考勤规则
    // wx.navigateTo({
    //   url:'../map/map'
    // });

    // wx.redirectTo({
    //   url:'../QRCode/QRCode'
    // });
    wx.redirectTo({
      url:'../activeSignInfo/active'
    });
    this.setData({
      signInfo:{
        address:'test'
      }
    });
    this.getLocation();
  },
  setRule:function(){
    wx.navigateTo({
      url:'../setRule/rule'
    })
  },
  getSignRule:function(){

  },
  getLocation:function(){
    //定位
    var _this = this;
    wx.getLocation({
      type:'wgs84',
      success:function(res){
          var latitude = res.latitude;
          var longitude = res.longitude;
          var accuracy = res.accuracy;

          // _this.setData({
          //   signInfo:{
          //     address:accuracy
          //   }
          // });
          if(latitude === undefined || longitude === undefined || accuracy === undefined){
            //重新定位
          }else{
            //获取具体位置信息

            mapApi.reverseGeocoder({
              location:{
                latitude:latitude,
                longitude:longitude
              },
              success:function(res){
                // console.log(res);
                // alert(JSON.stringify(res));

                if(res.status === 0){
                  console.log(res.result.address);
                  // alert(res.result.address);
                  _this.setData({
                    signInfo:{
                      address:res.result.address
                    }
                  })
                }
              },
              fail:function(res){
                console.log(JSON.stringify(res));

                _this.setData({
                  signInfo:{
                    address:'fail'
                  }
                });
              }
            })
          }
      }
    })
  }
});
