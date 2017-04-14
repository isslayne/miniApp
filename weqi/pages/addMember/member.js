var app = getApp();
Page({
  data:{
    btnDisabled:true
  },
  onLoad:function(){
    // this.getCompanyInfo();

    this.getWildData();
  },
  getWildData:function(){
    var _this = this;
    // app.wildDogData.bindAsObject(this,'userInfo',function(err){
    //   if(err != null){
    //     console.log(userInfo);
    //   }
    // });

    app.wildDogData.child('company').once('value', function(data){
      console.log(data.val());
      _this.setData({
        companyName:data.val().name
      })
    });

  },
  getCompanyInfo:function(){
    var _this = this;
    wx.request({
      url:'http://10.16.33.62/signin?name=layne',
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
    wx.redirectTo({
      url:'../memberStatus/status'
    });
  }
});
