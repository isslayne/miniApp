var app = getApp();
var config = require('../../config');
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min');
var mapApi;
Page({
  data:{
    title:'打卡',
    signInfo:{},
    icon_contact:config.icon.icon_contact
  },
  onLoad:function(){
    // wx.redirectTo({
    //   url:'../logs/logs'
    // });
    // wx.redirectTo({
    //   url:'../activeSignInfo/active'
    // });

    mapApi = new QQMapWX({
      key:config.mapKey
    })
    //验证用户是否添加公司，管理员否，跳转至不同页面
    this.getLocation();

    this.setData({
      noContact:true,
      roleType:0,
      noContactIcon:config.icon.contact
    })
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
  inviteContact:function(){
    wx.navigateTo({
      url:'../QRCode/QRCode'
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
