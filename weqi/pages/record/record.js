var app = getApp();
var config = require('../../config');

Page({
  data:{
    icon_contact:config.icon.icon_contact,
    date:'2017-03-30'
  },
  onLoad:function(){
    var _this = this;
    this.setData({
      localDate:_this.formatLocalDate(_this.getNowDate())
    })
    this.checkUserConfig();
    //加载当前日期考勤记录

  },
  getRecord(){
    //获取考勤记录数据
  },
  checkUserConfig:function(){
    var _this = this;
    var hasRecord = true;
    var nowDate = this.getNowDate();

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

      if(userConfig.hasRule){
        if(userConfig.ruleList && userConfig.ruleList.length){

          _this.ruleList = userConfig.ruleList;
          _this.userConfig = userConfig;

          if(_this.userConfig.recordList &&_this.userConfig.recordList.length === 0){
            hasRecord = false;
          }
          _this.setData({
            noRule:2,
            roleType:userConfig.ruleType,
            name:app.globalData.userInfo.nickName,
            company:_this.userConfig.company.name
            // signInfo:{
            //   recordList: _this.userConfig.recordList,
            //   hasRecord: hasRecord
            // }
          });

          _this.renderRecordList(nowDate.split('-')[0],nowDate.split('-')[1]);

        }else{
          _this.setData({
            noRule:0,
            roleType:userConfig.ruleType
          })
        }
      }else{
        wx.redirectTo({
          url:'../activeSignInfo/active'
        });
      }

    });
  },
  bindDateChange: function(e) {
    var _this = this;
    var singleDate = this.getSingleDate(e.detail.value);

    var singleYear = Number(singleDate.year);
    var singleMonth = Number(singleDate.month);

    this.setData({
      date: e.detail.value,
      localDate:_this.formatLocalDate(e.detail.value)
    });
    this.renderRecordList(singleYear,singleMonth);
  },
  getPrevDate:function(){
    var _this = this;
    var nowDate = this.getNowDate();
    var pickDate = this.data.date;
    var singleDate = this.getSingleDate(pickDate);

    var singleYear = Number(singleDate.year);
    var singleMonth = Number(singleDate.month);

    if(singleMonth === 1) {
      singleMonth = 12;
      singleYear --;
    } else {
      singleMonth --;
    }

    //更新查询记录列表
    this.renderRecordList(singleYear,singleMonth);
  },
  getNextDate:function(){
    var nowDate = this.getNowDate();
    var pickDate = this.data.date;
    var singleDate = this.getSingleDate(pickDate);

    var singleYear = Number(singleDate.year);
    var singleMonth = Number(singleDate.month);

    if(pickDate >= nowDate){
      wx.showToast({
        title:'暂无考勤记录',
        icon:'success'
      });
    } else{
      if(singleMonth === 12) {
        singleMonth = 1;
        singleYear ++;
      } else {
        singleMonth ++;
      }

      this.renderRecordList(singleYear,singleMonth);
    }
  },
  renderRecordList:function(singleYear,singleMonth){
    var _this = this;
    var recordList = this.userConfig.recordList;
    var pickedList = [];
    var pickedDate = _this.toTenFormat(singleYear)+'-'+_this.toTenFormat(singleMonth);

    recordList && recordList.length && recordList.forEach(function(item){
      var curItemDateArray =  item.signDate.split('-');
      var curItemDate = curItemDateArray[0]+'-'+curItemDateArray[1];
      if(curItemDate === pickedDate){
        pickedList.push(item);
      }
    })

    if(pickedList.length === 0){
      var hasRecord = false;
    }else {
      hasRecord = true;
    }
    this.setData({
      date:_this.toTenFormat(singleYear)+'-'+_this.toTenFormat(singleMonth),
      localDate: _this.toTenFormat(singleYear)+'年'+_this.toTenFormat(singleMonth)+'月',
      recordList:pickedList,
      signInfo:{
        recordList:pickedList,
        hasRecord:hasRecord
      }
    });

    //筛选对应日期记录
    this.filterMonthStatus(pickedList);

  },
  getTypeData:function(e){
    var type = e.currentTarget.dataset.type;
    this.filterMonthStatus(this.data.recordList,type);
  },
  filterMonthStatus:function(list,type){
    var curType = type || 'normal';
    var formatDataList = [];

    var filterList = list.filter(function(item){
      if(curType == 'normal'){
        return item.signInStatus ==0 && item.signOffStatus ==0;

      }else if(curType == 'late'){

        return item.signInStatus ==1;
      } else if (curType == 'early') {
        return item.signInStatus ==2;
      } else{
        filterList =[];
      }

    });

    filterList.forEach(function(item){
      if(curType == 'normal'){
        formatDataList.push({
          signInTime:item.signInTime,
          signInStatus:item.signInStatus,
          signInAddress:item.signInAddress
        });

      }else if(curType == 'late'){
        formatDataList.push({
          signInTime:item.signInTime,
          signInStatus:item.signInStatus,
          signInAddress:item.signInAddress
        });
      } else if (curType == 'early') {
        formatDataList.push({
          signOffTime:item.signInTime,
          signOffStatus:item.signInStatus,
          signOffAddress:item.signInAddress
        });
      } else{
        formatDataList =[];
      }
    });


    var hasRecord = filterList.length? true : false;
    this.setData({
      curType:curType,
      signInfo:{
        filterRecordList:formatDataList,
        hasRecord:hasRecord
      }
    })

  },
  getNowDate:function(){
    var _this = this;
    var date  = new Date();
    var nowYear = date.getFullYear();
    var nowMonth = date.getMonth()+1;
    var nowDay = date.getDate();
    var nowHour = date.getHours();
    var nowMinute = date.getMinutes();
    var nowSecond = date.getSeconds();

    // var nowTime = {
    //   nowTimeDate:_this.toTenFormat(nowYear)+'-'+_this.toTenFormat(nowMonth)+'-'+_this.toTenFormat(nowDay)+' '+_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute),
    //   nowTimeS:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)+':'+_this.toTenFormat(nowSecond),
    //   nowTimeM:_this.toTenFormat(nowHour) + ":"+_this.toTenFormat(nowMinute)
    // };

    var nowDate = _this.toTenFormat(nowYear)+'-'+_this.toTenFormat(nowMonth)

    return nowDate;
  },
  toTenFormat:function(number){
    number = Number(number) < 10 ? "0"+Number(number) : Number(number);
    return number;
  },
  formatLocalDate:function(date){
    var dateArray = date.split('-');
    var LocalDate = dateArray[0] +'年'+dateArray[1]+'月';
    return LocalDate;
  },
  getSingleDate:function(date){
    var singleDateArray = date.split('-');
    var year = this.toTenFormat(singleDateArray[0]);
    var month = this.toTenFormat(singleDateArray[1]);
    var singleDate = {
      year:year,
      month:month
    };

    return singleDate;
  },
  getDetailRecord:function(){
    wx.navigateTo({
      url:'../detailRecord/detailRecord'
    });
  }
});
