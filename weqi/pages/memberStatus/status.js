var app = getApp();
Page({
  data:{
    approveStatus:0
  },
  onLoad:function(){
    this.checkLogin();
  },
  checkLogin:function(){
    wx.request({
      url:'http://apis.isslayne.com/signin?name=layne',
      success:function(res){
        console.log(res.data.status);
      }
    })
  },
  getWildDogData:function(){
    var userInfo = {};
    var _this = this;
    app.wildDogData.orderByValue().on('value', function(snapshot){
      snapshot.forEach(function(data){
        var key = data.key();
        userInfo[data.key()] =  data.val();
      });
      _this.saveInfo(userInfo);
    });
  },
  saveInfo:function(data){
    var _this = this;
    var second =5;
    var userKey = app.globalData.userInfo.nickName;
    var userInfo ={};

    _this.setData({
      approveStatus:1
    });
    userInfo.ruleList = data.ruleList;
    userInfo.company = data.company;
    userInfo.hasRule = true;
    userInfo.hasCompany = true;
    userInfo.ruleType = 0;

    _this.setData({
      second:second
    });
    setInterval(function(){
        second --;
      _this.setData({
        second:second
      });
    },1000);

    wx.setStorage({
      key:userKey,
      data:userInfo,
      success:function(){
        setTimeout(function(){
          wx.switchTab({
            url:'../signIn/sign'
          });
        },5000);
      }
    })
  },
  jumpTosign:function(){
    wx.switchTab({
      url:'../signIn/sign'
    });
  },
  checkStatus:function(){
    var _this = this;

    var userKey = app.globalData.userInfo.nickName;

    // wx.setStorage({
    //   key:userKey,
    //   data:userConfig,
    //   success:function(){
    //     _this.getLocation(userConfig.ruleList);
    //   }
    // }
    wx.request({
      url:'http://10.16.33.62/signin?name=layne',
      success:function(res){
        var second =5;
        console.log(res.data.status);
        if(res.data.status ===0){
          var userInfo ={};
          _this.setData({
            approveStatus:1
          });
          userInfo.ruleList = res.data.ruleList;
          userInfo.company = res.data.company;
          userInfo.hasRule = true;
          userInfo.hasCompany = true;
          userInfo.ruleType = 0;

          _this.setData({
            second:second
          });
          setInterval(function(){
              second --;
            _this.setData({
              second:second
            });
          },1000);

          wx.setStorage({
            key:userKey,
            data:userInfo,
            success:function(){
              setTimeout(function(){
                wx.switchTab({
                  url:'../signIn/sign'
                });
              },5000);
            }
          })
        }
      },
      fail:function(){
        wx.showToast({
          title:'请求失败',
          icon:'loading'
        })
      }
    })
  },
  cancelApplication:function(){
    wx.redirectTo({
      url:'../activeSignInfo/active'
    });
  },
  reapply:function(){
    wx.redirectTo({
      url:'../addMember/member'
    })
  },
  createCompany:function(){
    wx.redirectTo({
      url:'../activeSignInfo/active'
    })
  }
});
