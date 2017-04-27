var app = getApp();
var config = require('../../config');
Page({
  data:{
    btnDisabled:true
  },
  onLoad:function(option){
     this.cid = option.cid;

    this.getCompanyInfo(this.cid);
    // this.getWildData();
  },
  getWildData:function(){
    var _this = this;

    app.wildDogData.child('company').once('value', function(data){
      console.log(data.val());
      _this.setData({
        companyName:data.val().name
      })
    });

  },
  getCompanyInfo:function(cid){
    var _this = this;
    wx.request({
      url:config.server+'/getCompany/'+cid,
      method:'GET',
      success:function(res){
        if(res.data.status ===0){
          _this.setData({
            companyName:res.data.company.name
          })
        }
      },
      fail:function(){

      }
    })
  },
  inputName:function(e){
    e.detail.value.trim().length && this.setData({
      name:e.detail.value,
      btnDisabled:false
    });
  },
  inputAddInfo:function(e){
    this.setData({
      addInfo:e.detail.value
    });
  },
  submitInfo:function(){
    var _this = this;
    wx.request({
      url:config.server+'/joinCompany/'+_this.cid,
      method:'POST',
      data:{
        name:app.globalData.userInfo.nickName,
        nickName:_this.data.name,
        approveInfo:_this.data.addInfo
      },
      success:function(res){
        if(res.data.status===0){
          wx.showToast({
            title:'提交成功',
            icon:'success',
            success:function(){
              wx.redirectTo({
                url:'../memberStatus/status?uid='+res.data.uid+'&cid='+res.data.cid
              });
            }
          });

        }
      },
      fail:function(){
        wx.showToast({
          title:'网络错误',
          icon:'success'
        });
      }
    })
  }
});
