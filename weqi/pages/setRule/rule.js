var app = getApp();
Page({
  data:{
    startTime:"08:30",
    endTime:"17:30",
    list:[{
      id:1,
      name:'一',
      selected:true
    },{
      id:2,
      name:'二',
      selected:true
    },{
      id:3,
      name:'三',
      selected:true
    },{
      id:4,
      name:'四',
      selected:true
    },{
      id:5,
      name:'五',
      selected:true
    },{
      id:6,
      name:'六',
      selected:false
    },{
      id:7,
      name:'日',
      selected:false
    }
  ]
  },
  bindStartTime:function(e){
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTime:function(e){
    this.setData({
      endTime: e.detail.value
    })
  },
  chooseLocation: function () {
    // this.mapCtx.moveToLocation()
    var _this = this;
    wx.chooseLocation({
      success:function(res){
        console.log(JSON.stringify(res));
        //把选择的地点和公司名提交到服务器

        _this.setData({
          isActive:false,
          isSuccessActive:true,
          address:res.name
        });
      },
      fail:function(){

      }
    })
  },
  toggleDay:function(e){
    var id = e.currentTarget.id;
    var list = this.data.list;
    for(var i=0,len = list.length;i<len;++i){
      if (list[i].id == id) {
        list[i].selected = !list[i].selected;
      }
    }
    this.setData({
      list:list
    });
  }
})
