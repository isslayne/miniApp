var app = getApp();
var config = require('../../config');
Page({
  data:{
    icon_qrcode:config.icon.icon_qrcode,
    icon_createCompany:config.icon.icon_createCompany
  },
  createCompany:function(){
    wx.redirectTo({
      url:'../activeSignInfo/active'
    })
  },
  scanQRcode:function(){
    wx.scanCode({
      success:function(res){
        var decodeUrl = res.result && res.result.split('#');
        if(decodeUrl && decodeUrl.length>1 && (decodeUrl[0]==config.inviteCode|| decodeUrl[0]==config.expCode)){
          wx.redirectTo({
            url:'../addMember/member?cid='+decodeUrl[1]
          });
        }else{
          wx.showToast({
            title:'识别错误，请重新扫描',
            icon:'success'
          });
        }

      },
      fail:function(res){
        wx.showToast({
          title:'网络错误',
          icon:'success'
        });
      }
    })
  },
  onShareAppMessage:function(){
    return {
      title: '移动考勤-扫一扫',
      desc: '移动考勤，简化流程一步到位打卡签到',
      path: 'pages/setContact/detail/detail'
    }
  }
})
