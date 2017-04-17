var app = getApp();
var config = require('../../config');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min');
var mapApi;

Page({
  data:{
    isActive:true,
    isSuccessActive:false,
    btnDisabled:true
  },
  onLoad:function(){
    mapApi = new QQMapWX({
      key:config.mapKey
    })
  },
  inputCompany:function(e){
    e.detail.value.trim().length && this.setData({
      companyName:e.detail.value,
      btnDisabled:false
    });
  },
  chooseLocation: function () {
    // this.mapCtx.moveToLocation()
    var _this = this;
    wx.chooseLocation({
      success:function(res){
        console.log(JSON.stringify(res));
        //把选择的地点和公司名提交到服务器
        // _this.activeSignApp();
        // _this.saveActiveInfo(res);
        _this.submitActiveInfo(res);

        // _this.setData({
        //   isActive:false,
        //   isSuccessActive:true
        // });
      },
      fail:function(){
          //toast
          wx.showToast({
            title:'提交错误，请重新选择',
            icon:'success',
          })
      }
    })
  },
  submitActiveInfo:function(activeData){
    var _this = this;
    wx.request({
      url:'http://127.0.0.1:3000/createCompany',
      method:'POST',
      data:{
        memberName:app.globalData.userInfo.nickName,
        companyName:_this.data.companyName,
        rule:{
          name:activeData.name,
          address:activeData.address,
          latitude:activeData.latitude,
          longitude:activeData.longitude,
          addressName:activeData.name
        }
      },
      success:function(res){
        console.log(JSON.stringify(res));
        if(res.data.status === 0){
          wx.showToast({
            title:'保存成功',
            icon:'success',
            success:function(){
              _this.setData({
                isActive:false,
                isSuccessActive:true
              });
            }
          });
        } else {
          wx.showToast({
            title:res.data.msg,
            icon:'succcess'
          });
        }
      }
    })
  },
  saveActiveInfo:function(signData){
    var _this = this;
    var rule = {
      name:signData.name.length?signData.name : signData.address,
      address:signData.address,
      latitude:signData.latitude,
      longitude:signData.longitude,
      addressName:signData.name,
      signScope:1000,
      workOnTime:'08:30',
      workOffTime:'17:30',
      workDay:[1,2,3,4,5]
    };

    // var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName) ||app.getUserInfo(function(){
    //   return wx.getStorageSync(app.globalData.userInfo.nickName);
    // });
    app.getUserInfo(function(userInfo){

      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName) || {ruleType:0,hasCompany:false,hasRule:false};

      userConfig.ruleList = [];
      userConfig.ruleType = 1;//1为管理员
      userConfig.hasRule = true;
      userConfig.hasCompany = true;
      userConfig.company = {
        name:_this.data.companyName
      };
      userConfig.ruleList.push(rule);

      wx.setStorage({
        key:app.globalData.userInfo.nickName,
        data:userConfig,
        success:function(){
          wx.showToast({
            title:'保存成功',
            icon:'success',
            success:function(){
              _this.setData({
                isActive:false,
                isSuccessActive:true
              });
            },
            fail:function(){

            }
          });

        },
        fail:function(){
          wx.showToast({
            title:'保存数据失败',
            icon:'success',
          })
        }
      });

    });

  },
  activeSignApp:function(){
    wx.request({
      url:'your server',
      data:{

      },
      method:'post',
      success:function(res){
        //提交成功后跳到成功提示页面

      },
      fail:function(res){
        //提交失败，进行提示
      }
    })
  },
  startSign:function(){
    wx.switchTab({
      url:'../signIn/sign'
    });
  },
  shareQRcode:function(){
    wx.navigateTo({
      url:'../QRCode/QRCode'
    })
  }
});
