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
    signListIcon:config.icon.signListIcon,
    signListIconSelected:config.icon.signListIconSelected,
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

    // this.getLocation();
    //
    // this.setData({
    //   noRule:1,
    //   roleType:0
    // });

    this.liveTime();

    this.rotateAnimation();
  },
  onShow:function(){
      // this.checkUserConfig();
  },
  onPullDownRefresh:function(){
    // this.checkUserConfig();
    wx.stopPullDownRefresh();
  },
  liveTime:function(time){
    var _this = this;
    var date  = new Date();
    var nowHour = date.getHours();
    var nowMinute = date.getMinutes();
    var nowSecond = date.getSeconds();

    _this.setData({
      liveTime:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)+':'+_this.toTenFormat(nowSecond)
    });

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
    var _this = this;
    //ruleType:1 普通员工，0 管理员
    // var uid = app.globalData.userInfo? (app.globalData.userInfo.nickName || null) : null;
    // var userConfig = wx.getStorageSync(uid) ||app.getUserInfo(function(){
    //   return wx.getStorageSync(app.globalData.userInfo.nickName);
    // });

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

      if(userConfig.hasRule){
        if(userConfig.ruleList && userConfig.ruleList.length){
          //已经设置规则，开始定位打卡
          _this.ruleList = userConfig.ruleList;
          _this.userConfig = userConfig;

          //每天第一次打卡
          _this.getLocation(userConfig.ruleList);

          _this.setData({
            noRule:2,
            roleType:userConfig.ruleType
          })
        }else{
          _this.setData({
            noRule:0,
            roleType:userConfig.ruleType
          })
        }
      }else{
        wx.redirectTo({
          url:'../activeSignInfo/active'
        });
      }

    });


  },
  signIn:function(){
    //打卡判断考勤规则
    // wx.navigateTo({
    //   url:'../map/map'
    // });

    // wx.redirectTo({
    //   url:'../QRCode/QRCode'
    // });
    // wx.redirectTo({
    //   url:'../activeSignInfo/active'
    // });
    this.setData({
      noRule:1,
      roleType:this.userConfig.ruleType
    });
    this.getLocation(this.userConfig.ruleList);
    // this.getLocation();
  },
  setRule:function(){
    wx.navigateTo({
      url:'../setRule/rule'
    })
  },
  getSignRule:function(){

  },
  getLocation:function(ruleList){
    //定位
    var _this = this;
    wx.getLocation({
      type:'gcj02',
      success:function(res){
          console.log(JSON.stringify(res));
          var latitude = res.latitude;
          var longitude = res.longitude;
          var accuracy = res.accuracy;

          // _this.setData({
          //   signInfo:{
          //     address:accuracy
          //   }
          // });
          // if(latitude === undefined || longitude === undefined || accuracy === undefined){
          if(latitude === undefined || longitude === undefined){
            //重新定位
            _this.getLocation(_this.ruleList);
          }else{
            // getAddress(500);
            //获取具体位置信息, 比较距离
            mapApi.calculateDistance({
              from:{
                latitude:latitude,
                longitude:longitude
              },
              to:[{
                latitude:ruleList[0].latitude,
                longitude:ruleList[0].longitude
              }],
              success:function(res){
                _this.distance = res.result.elements[0].distance;
                getAddress(_this.distance);

              },
              fail:function(res){
                wx.showToast({
                  title:res.message,
                  icon:'success',
                })
              }
            });


            function getAddress(distance){
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
                    if(Number(_this.distance) <= ruleList[0].signScope){
                      wx.showToast({
                        title:'打卡成功',
                        icon:'success',
                      });

                      // _this.setData({
                      //   noRule:2,
                      //   roleType:_this.userConfig.ruleType,
                      //   signInfo:{
                      //     address:res.result.address
                      //   }
                      // });
                      //打卡成功，清除实时时间
                      clearInterval(_this.timer);
                      //和考勤时间比较，是否迟到

                      // 保存打卡数据
                      _this.saveSignInfo(distance,res.result.address);


                    }else if(Number(_this.distance) <=1100){
                      //距离远
                      wx.showModal({
                        title: "打卡失败",
                        content: "差一点就进入考勤范围了，加油哦！",
                        showCancel: true,
                        confirmText: "重新打卡"
                      })
                    }else{
                      wx.showModal({
                        title: "打卡失败",
                        content: "离考勤地点有点远，加把劲",
                        showCancel: true,
                        confirmText: "重新打卡"
                      })
                    }

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
      }
    })
  },
  saveSignInfo:function(distance,address){
    var _this = this;
    var nowDate = this.getNowTime();
    var recordList = this.userConfig.recordList || [];

    recordList.push({
      signInTime:nowDate.nowTimeDate,
      signOffTime:nowDate.nowTimeDate,
      distance:distance,
      address:address,
      signStatus:0 //标识迟到早退等状态
    });

    this.userConfig.recordList = recordList;

    wx.setStorage({
      key:app.globalData.userInfo.nickName,
      data:_this.userConfig
    });

    _this.setData({
      noRule:2,
      roleType:_this.userConfig.ruleType,
      signTime:nowDate.nowTimeS,
      signInfo:{
        address:address,
        recordList:recordList
      }
    })
  },
  getNowTime:function(){
    var _this = this;
    var date  = new Date();
    var nowYear = date.getFullYear();
    var nowMonth = date.getMonth()+1;
    var nowDay = date.getDate();
    var nowHour = date.getHours();
    var nowMinute = date.getMinutes();
    var nowSecond = date.getSeconds();

    var nowTime = {
      nowTimeDate:_this.toTenFormat(nowYear)+'-'+_this.toTenFormat(nowMonth)+'-'+_this.toTenFormat(nowDay)+' '+_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute),
      nowTimeS:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)+':'+_this.toTenFormat(nowSecond),
      nowTimeM:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)
    };

    return nowTime;
  }

});
