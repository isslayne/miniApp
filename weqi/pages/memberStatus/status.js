var app = getApp();
var config = require('../../config');
Page({
  data:{
    approveStatus:0
  },
  onLoad:function(option){
    this.option = option;
    this.checkLogin(option);
  },
  checkLogin:function(option){
    var _this = this;
    wx.request({
      url:config.server+'/getUserStatus',
      method:'POST',
      data:{
        uid:option.uid,
        cid:option.cid
      },
      success:function(res){
        console.log(res.data.status);
        if(res.data.status ===0){
          _this.saveInfo(res.data.userInfo);
        }
      },
      fail:function(){
        wx.showToast({
          title:'网络错误',
          icon:'success'
        });
      }
    })
  },
  saveInfo:function(data){
    var _this = this;
    var second =5;
    var userKey = app.globalData.userInfo.nickName;
    var userInfo ={};

    _this.setData({
      approveStatus:data.member.approveStatus
    });

    userInfo.ruleType = data.member.roleType;
    userInfo.ruleList = data.company.ruleList;
    userInfo.company = data.company;
    userInfo.hasRule = true;
    userInfo.hasCompany = true;
    userInfo.uid = data.member._id;
    userInfo.cid = data.company._id;
    userInfo.isNewDay = data.member.isNewDay;

    data.company.ruleList.forEach(function(item){
      item.workDay = item.workDay.split(',');
    });

    if(data.member.approveStatus === 1){
      _this.setData({
        second:second,
        approveStatus:data.member.approveStatus
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
    }else{
      wx.setStorage({
        key:userKey,
        data:userInfo
      })
    }

  },
  refreshStatus:function(){
    var _this = this;
    this.checkLogin(_this.option);
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
      url:config.server+'/signin?name=layne',
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
