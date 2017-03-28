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
    console.log(e.detail.value.trim().length);
  },
  chooseLocation: function () {
    // this.mapCtx.moveToLocation()
    var _this = this;
    wx.chooseLocation({
      success:function(res){
        console.log(JSON.stringify(res));
        //把选择的地点和公司名提交到服务器
        // _this.activeSignApp();
        _this.saveActiveInfo(res);

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
  saveActiveInfo:function(signData){
    var _this = this;
    var rule = {
      name:signData.name,
      address:signData.address,
      latitude:signData.latitude,
      longitude:signData.longitude,
      addressName:signData.name
    };

    var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName) ||app.getUserInfo(function(){
      return wx.getStorageSync(app.globalData.userInfo.nickName);
    });

    userConfig.ruleList = [];
    userConfig.ruleType = 1;
    userConfig.hasRule = true;
    userConfig.hasCompany = true;
    userConfig.company = {
      name:_this.data.companyName
    };
    userConfig.ruleList.push(rule);

    wx.setStorage({
      key:'Layne',
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
    wx.redirectTo({
      URL:'../QRCode/QRCode'
    })
  }
});
