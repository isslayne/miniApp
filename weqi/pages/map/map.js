var app = getApp();
Page({
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  onload:function(){

  },
  moveToLocation: function () {
    // this.mapCtx.moveToLocation()
    wx.chooseLocation({
      success:function(res){

      },
      fail:function(){

      }
    })
  }
})
