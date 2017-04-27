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
  onLoad:function(option){
    if(option.q && option.q.length ){
      this.inviteCode =decodeURIComponent(option.q);
    }

    mapApi = new QQMapWX({
      key:config.mapKey
    });
    this.liveTime();
  },
  onShow:function(){
    var decodeUrl = this.inviteCode && this.inviteCode.split('#');
    // if(this.inviteCode && (decodeUrl[0]==config.inviteCode|| this.inviteCode==config.expCode)){
    if(this.inviteCode && (decodeUrl[0]==config.inviteCode||decodeUrl[0] ==config.expCode)){
      wx.redirectTo({
        url:'../activeApp/activeApp'
      });
    }else{
      // this.checkUserConfig('switchTab');
      // wx.redirectTo({
      //   url:'../activeSignInfo/active'
      // });
      // wx.redirectTo({
      //     url:'../addMember/member?cid=58f8aee60662fb0d18b099e8'
      // })
      // wx.redirectTo({
      //   url:'../activeApp/activeApp'
      // })
      this.queryUserInfo('switchTab');
    }
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  },
  liveTime:function(type){
    var _this = this;
    var date  = new Date();
    var nowHour = date.getHours();
    var nowMinute = date.getMinutes();
    var nowSecond = date.getSeconds();

    _this.setData({
      liveTime:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)+':'+_this.toTenFormat(nowSecond),
      signTime:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)+':'+_this.toTenFormat(nowSecond)
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
      });
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
  queryUserInfo:function(type){
    var _this = this;
    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);
      wx.request({
        url:config.server+'/queryUser',
        method:'GET',
        data:{
          uid:app.globalData.userInfo.nickName
        },
        success:function(res){
          console.log(JSON.stringify(res));
          if(res.data.status ===0){
            _this.checkUserStatus(res.data.member,res.data.company);
            // _this.checkUser(res.data.member,res.data.company);
          }else if(res.data.status ===10002){
            wx.redirectTo({
              url:'../activeApp/activeApp'
            });
          } else{

          }
        },
        fail:function(){
          wx.showToast({
            title:'网络错误',
            icon:'success'
          });
        }
      })
    })

  },
  checkUserStatus:function(member,company){
    var _this = this;
    if(member.approveStatus == 0 || member.approveStatus == 2){
      wx.redirectTo({
        url:'../memberStatus/status?uid='+member._id+'&cid='+member.cid
      });
    }else {
      _this.checkUser(member,company);
    }

  },
  checkUser:function(user,data){
    var _this = this;
    var localUserConfig;
    app.getUserInfo(function(userInfo){
      localUserConfig = wx.getStorageSync(app.globalData.userInfo.nickName);
    });

    if(data.ruleList && data.ruleList.length){
      var userConfig = {
        ruleType : user.roleType,//1为管理员
        hasRule : true,
        hasCompany : true,
        company : data,
        ruleList : data.ruleList,
        uid:user._id,
        cid:user.cid,
        isNewDay:user.isNewDay
      };

      data.ruleList.forEach(function(item,index){
        item.workDay = item.workDay.split(',');
      })

      localUserConfig.ruleType = user.roleType;
      localUserConfig.company = data;
      localUserConfig.hasRule = true;
      localUserConfig.hasCompany = true;
      localUserConfig.ruleList = data.ruleList;
      localUserConfig.uid=user._id;
      localUserConfig.cid=user.cid;
      localUserConfig.isNewDay=user.isNewDay;

      wx.setStorage({
        key:app.globalData.userInfo.nickName,
        data:localUserConfig,
        success:function(){
          _this.getLocalData(localUserConfig);
        }
      })
      // this.getLocalData(userConfig);
    }else{
      this.setData({
        noRule:0,
        roleType:user.roleType
      })
    }
  },

  checkUserConfig:function(type){
    var _this = this;

    //ruleType:1 普通员工，0 管理员
    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

      //扫描二维码进来判断
      if(!userConfig.hasCompany && userConfig.ruleType && userConfig.ruleType ==0){
        wx.request({
          url:'http://10.16.33.62/signin?name=layne',
          success:function(res){
            console.log(res.data.status);
            if(res.data.status == 0){
              var rule = res.data.ruleList;
              userConfig.ruleList = [];

              userConfig.ruleType = 0;//1为管理员
              userConfig.hasRule = true;
              userConfig.hasCompany = true;
              userConfig.company = res.data.company;
              userConfig.ruleList = rule;

              wx.setStorage({
                key:app.globalData.userInfo.nickName,
                data:userConfig,
                success:function(){
                  _this.getLocation(userConfig.ruleList);
                }
              })

            }
          }
        });
      }else{
        _this.getLocalData(userConfig,type);
      }


    });


  },
  getLocalData:function(userConfig,type){
    var _this = this;
    if(userConfig.hasRule){
      if(userConfig.ruleList && userConfig.ruleList.length){
        //已经设置规则，开始定位打卡
        _this.ruleList = userConfig.ruleList;
        _this.userConfig = userConfig;

        //每天第一次打卡
        var isNewDay = _this.isNewDay();
        if(isNewDay){
            _this.setData({
              isNewDay:_this.getNowTime().nowDate
            });
            // _this.userConfig.isNewDay = _this.getNowTime().nowDate;
            isNewDay = _this.getNowTime().nowDate;
            wx.setStorage({
              key:app.globalData.userInfo.nickName,
              data:_this.userConfig
            });
              _this.setData({
                noRule:1
              });

            _this.getLocation(userConfig.ruleList,isNewDay);

        }else{
          app.getUserInfo(function(userInfo){
            clearInterval(_this.timer);
            _this.liveTime();

            var localUserConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

            if(localUserConfig.recordList && localUserConfig.recordList.length){
              var filterRecordList = localUserConfig.recordList.filter(function(item){
                return item.signDate == _this.getNowTime().nowDate;
              });
              _this.setData({
                noRule:2,
                roleType:localUserConfig.ruleType,
                signInfo:{
                  // address:address,
                  recordList:filterRecordList[0]
                }
              })
            }else {
              _this.setData({
                noRule:2,
                roleType:localUserConfig.ruleType,
                signInfo:{
                  // address:address,
                  recordList:[]
                }
              })
            }
          });

        }
      }else{
        _this.setData({
          noRule:0,
          roleType:userConfig.ruleType
        })
      }
    }else{
      wx.redirectTo({
        url:'../activeApp/activeApp'
      });
    }
  },
  isNewDay:function(){
    var nowDay = this.getNowTime().nowDate;
    var isNewDay = this.userConfig.isNewDay;
    if (isNewDay && nowDay == isNewDay){
      return false;
    }else{
      return true;
    }
  },
  signIn:function(){
    //打卡判断考勤规则
    var isNewDay = this.isNewDay();
    this.setData({
      noRule:1,
      roleType:this.userConfig.ruleType
    });
    this.getLocation(this.userConfig.ruleList,isNewDay);
  },
  setRule:function(){
    wx.navigateTo({
      url:'../setRule/rule'
    })
  },
  getSignRule:function(){

  },
  getLocation:function(ruleList,isNewDay){
    //筛选出为启用状态的考勤规则
    var enabledRuleList = ruleList.filter(function(item){
      return item.status === true;
    });
    //定位
    var _this = this;
    wx.getLocation({
      type:'gcj02',
      success:function(res){
          console.log(JSON.stringify(res));
          var latitude = res.latitude;
          var longitude = res.longitude;
          var accuracy = res.accuracy;

          // if(latitude === undefined || longitude === undefined || accuracy === undefined){
          if(latitude === undefined || longitude === undefined){
            //重新定位
            _this.getLocation(_this.ruleList,isNewDay);
          }else{
            //获取具体位置信息, 比较距离
            mapApi.calculateDistance({
              from:{
                latitude:latitude,
                longitude:longitude
              },
              to:[{
                latitude:enabledRuleList[0].latitude,
                longitude:enabledRuleList[0].longitude
              }],
              success:function(res){
                _this.distance = res.result.elements[0].distance;
                getAddress(_this.distance);

              },
              fail:function(res){
                wx.showToast({
                  title:res.message,
                  icon:'success'
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
                  if(res.status === 0){
                    console.log(res.result.address);
                    if(Number(_this.distance) <= enabledRuleList[0].signScope){
                      //考勤规则判断
                      var nowWeek = _this.getNowTime().nowWeek;
                      var hasRule = enabledRuleList[0].workDay.some(function(item){
                         return item ==nowWeek;
                      });

                      if(hasRule){
                        wx.showToast({
                          title:'打卡成功',
                          icon:'success'
                        });

                        //打卡成功，清除实时时间
                        // clearInterval(_this.timer);

                        //和考勤时间比较，是否迟到

                        // 保存打卡数据
                        if(isNewDay || (isNewDay&&isNewDay.length)){
                          _this.saveSignInfo(distance,res.result.address,isNewDay);
                        } else{
                          _this.saveSignInfo(distance,res.result.address,isNewDay);
                        }

                      } else {
                        _this.setData({
                          noRule:3
                        })
                      }

                    }else if(Number(_this.distance) <=1100){
                      //距离远
                      wx.showModal({
                        title: "打卡失败",
                        content: "差一点就进入考勤范围了，加油哦！",
                        showCancel: true,
                        confirmText: "重新打卡",
                        confirmColor:'#328fee',
                        success:function(res){
                          console.log(res.confirm);
                          if(res.confirm){
                            _this.setData({
                              noRule:1
                            });
                            _this.getLocation(_this.ruleList);
                          }else if(res.cancel){
                            _this.setData({
                              noRule:2
                            });
                          }
                        }
                      });
                    }else{
                      console.log("distance"+_this.distance);
                      wx.showModal({
                        title: "打卡失败",
                        content: "离考勤地点有点远，加把劲",
                        showCancel: true,
                        confirmText: "重新打卡",
                        confirmColor:'#328fee',
                        success:function(res){
                          console.log(res.confirm);
                          if(res.confirm){
                            _this.setData({
                              noRule:1
                            });
                            _this.getLocation(_this.ruleList);
                          }else if(res.cancel){
                            _this.setData({
                              noRule:2
                            });
                          }else{
                            _this.setData({
                              noRule:2
                            });
                          }
                        }
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
  saveSignInfo:function(distance,address,isNewDay){
    var _this = this;
    var nowDate = this.getNowTime();
    var recordList = this.userConfig.recordList || [];
    var curDay = nowDate.nowDate;

    var signStatus = 0;//记录迟到早退0，1，2

    var hasNowRecord = recordList.some(function(item){
      return item.signDate ==curDay;
    });
    if(hasNowRecord){
      recordList.forEach(function(item){
        if(item.signDate == curDay){
          item.signOffTime = nowDate.nowTimeDate;
          item.signOffDistance = distance;
          item.signOffAddress = address;
          item.signOffStatus = _this.checkSignStatus('off').status;
          // item.lateTime = _this.checkSignStatus('in').lateTime;
          item.earlyTime = _this.checkSignStatus('off').earlyTime;
        }
      });

      signStatus = _this.checkSignStatus('off');
      // recordList.push({
      //   signInTime:nowDate.nowTimeDate,
      //   signOffTime:nowDate.nowTimeDate,
      //   distance:distance,
      //   address:address,
      //   signStatus:0 //标识迟到早退等状态
      // });
    }else{
      recordList.push({
        signDate:nowDate.nowDate,
        signInTime:nowDate.nowTimeDate,
        signInDistance:distance,
        signInAddress:address,
        // signInStatus:_this.checkSignStatus('in'),
        signInStatus : _this.checkSignStatus('in').status,
        lateTime : _this.checkSignStatus('in').lateTime,
        // earlyTime : _this.checkSignStatus('in').earlyTime,
        earlyTime : '0',
        signOffTime:'',
        signOffDistance:'',
        signOffAddress:'',
        signOffStatus:'' //标识迟到早退等状态
      });

      signStatus = _this.checkSignStatus('in');
    }

    this.userConfig.recordList = recordList;
    if(isNewDay||(isNewDay&&isNewDay.length)){
      this.userConfig.isNewDay = isNewDay;
    } else{
      isNewDay = this.userConfig.isNewDay
    }

    wx.setStorage({
      key:app.globalData.userInfo.nickName,
      data:_this.userConfig
    });

    //保存isNewDay到服务器
    wx.request({
      url:config.server+'/updateMemberInfo/'+_this.userConfig.uid,
      method:'POST',
      data:{
        isNewDay:isNewDay
      },
      success:function(res){
        if(res.data.status !== 0){
          wx.showToast({
            title:res.data.msg,
            icon:'success'
          });
        }
      }
    });

    var filterRecordList = recordList.filter(function(item){
      return item.signDate == _this.getNowTime().nowDate;
    });
    _this.setData({
      noRule:2,
      roleType:_this.userConfig.ruleType,
      // signTime:nowDate.nowTimeS,
      signInfo:{
        address:address,
        recordList:filterRecordList[0]
      },
      curSignTime:nowDate.nowTime,
      signStatus:signStatus
    });

    // clearInterval(_this.timer);

  },
  checkSignStatus:function(type){
    var nowTime = this.getNowTime().nowTimeM;
    var enabledRule = this.userConfig.ruleList.filter(function(item){
      return item.status === true;
    });
    if(type == 'off'){
      if(nowTime <enabledRule[0].workOffTime){
        var earlyTime = this.calculateTime(nowTime,enabledRule[0].workOffTime,'off');
        var earlyInfo = {
          lateTime:0,
          earlyTime:earlyTime,
          status:2//早退
        }
        return earlyInfo;
      }else{
        earlyInfo = {
          lateTime:0,
          earlyTime:0,
          status:0
        }
        return earlyInfo;//正常下班
      }
    } else if(type == 'in'){
      if(nowTime >enabledRule[0].workOnTime && nowTime <enabledRule[0].workOffTime){
        var lateTime = this.calculateTime(nowTime,enabledRule[0].workOnTime,'in');
        var lateInfo = {
          lateTime:lateTime,
          earlyTime:0,
          status:1//迟到
        };
        return lateInfo;
      }else if(nowTime >=enabledRule[0].workOffTime){
        lateInfo = {
          lateTime:0,
          earlyTime:0,
          status:3//旷工
        };
        return lateInfo;//旷工
      }else{
        lateInfo = {
          lateTime:0,
          earlyTime:0,
          status:0//正常
        };
        return lateInfo;
      }
    }
  },
  calculateTime:function(nowTime,workTime,type){
    var calcNowTime = nowTime.split(':')[0]*60+nowTime.split(':')[1];
    var calcWorkTime = workTime.split(':')[0]*60+workTime.split(':')[1];
    if(type == 'in'){
      return calcNowTime -calcWorkTime;
    }
    if(type =='off'){
      return calcWorkTime - calcNowTime;
    }
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
      nowTimeM:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute),
      nowDate:_this.toTenFormat(nowYear)+'-'+_this.toTenFormat(nowMonth)+'-'+_this.toTenFormat(nowDay),
      nowWeek:date.getDay()
    };

    return nowTime;
  },
  onShareAppMessage:function(){
    return {
      title: '移动考勤小程序',
      desc: '移动考勤',
      path: 'pages/signIn/sign'
    }
  }
  
});
