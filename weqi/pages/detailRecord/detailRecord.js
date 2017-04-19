var app = getApp();
var config = require('../../config');

const conf = {
  data: {
    icon_contact:config.icon.avatar,
    signListIcon:config.icon.signListIcon,
    hasEmptyGrid: false,
    pickedDay:''
  },
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        scrollViewHeight: res.windowHeight * res.pixelRatio || 667
      });
    } catch (e) {
      console.log(e);
    }
  },
  getThisMonthDays(year, month) {
    //获取该月份最后一天
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {

    //获取第一天对应的周几
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      var item ={};
      item.day = i;
      item.date = this.formatDate(year)+ '-'+this.formatDate(month) +'-'+ this.formatDate(i);
      days.push(item);
    }

    this.setData({
      days
    });
  },
  formatDate:function(num){
    return num = Number(num) <10 ? '0'+num : num;
  },
  getDayRecord:function(e){
    var targetDay = e.currentTarget.dataset.date;
    var nowDate = this.getNowDate();
    var pickedRecord = this.userConfig.recordList.filter(function(item){
      return item.signDate == targetDay;
    });

    var hasPickedDay = pickedRecord.length? true:false;
    if(targetDay <= nowDate){
      this.setData({
        hasPickedDay:hasPickedDay,
        pickedDay:targetDay,
        pickedDayRecord:hasPickedDay ? pickedRecord[0] :{signInTime:'',signInAddress:'',signOffTime:'',signOffAddress:''}
      });
    }

  },
  getFirstDayRecord:function(targetDay){
    var pickedRecord = this.userConfig.recordList.filter(function(item){
      return item.signDate == targetDay;
    });

    var hasPickedDay = pickedRecord.length? true:false;
    this.setData({
      hasPickedDay:hasPickedDay,
      pickedDay:targetDay,
      pickedDayRecord:hasPickedDay ? pickedRecord[0] :{signInTime:'',signInAddress:'',signOffTime:'',signOffAddress:''}
    });

  },
  onLoad(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_day = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    const cur_dateDay = this.formatDate(cur_year) +'-'+this.formatDate(cur_month)+'-'+this.formatDate(cur_day);

    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);

    this.checkUserConfig();
    //this.getSystemInfo();
    this.setData({
      pickedDay:cur_dateDay,
      cur_dateDay,
      cur_year,
      cur_month,
      weeks_ch
    })
  },
  handleCalendar(e) {
    var _this = this;
    var nowMonth = this.getNowDate('month');

    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        pickedDay:_this.toTenFormat(newYear)+'-'+_this.toTenFormat(newMonth)+'-01',
        cur_year: newYear,
        cur_month: newMonth
      })
      this.getFirstDayRecord(_this.toTenFormat(newYear)+'-'+_this.toTenFormat(newMonth)+'-01');

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      var pickedMonth = this.toTenFormat(newYear)+'-'+this.toTenFormat(newMonth);
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      if(pickedMonth<nowMonth){
        this.calculateDays(newYear, newMonth);
        this.calculateEmptyGrids(newYear, newMonth);

        console.log(_this.toTenFormat(newYear)+'-'+_this.toTenFormat(newMonth)+'-01');
        this.setData({
          pickedDay:_this.toTenFormat(newYear)+'-'+_this.toTenFormat(newMonth)+'-01',
          cur_year: newYear,
          cur_month: newMonth
        });
        this.getFirstDayRecord(_this.toTenFormat(newYear)+'-'+_this.toTenFormat(newMonth)+'-01');
      }else if(pickedMonth==nowMonth){
        this.calculateDays(newYear, newMonth);
        this.calculateEmptyGrids(newYear, newMonth);

        console.log()
        this.setData({
          pickedDay:_this.getNowDate(),
          cur_year: newYear,
          cur_month: newMonth
        });
        this.getFirstDayRecord(_this.getNowDate());
      }else{
        wx.showToast({
          title: '暂无考勤记录',
          image: ''
        });
      }

    }
  },
  checkUserConfig:function(){
    var _this = this;
    var hasRecord = true;

    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_day = date.getDate();
    const cur_dateDay = this.formatDate(cur_year) +'-'+this.formatDate(cur_month)+'-'+this.formatDate(cur_day);

    app.getUserInfo(function(userInfo){
      var userConfig = wx.getStorageSync(app.globalData.userInfo.nickName);

      if(userConfig.hasRule){
        if(userConfig.ruleList && userConfig.ruleList.length){
          //已经设置规则，开始定位打卡
          _this.ruleList = userConfig.ruleList;
          _this.userConfig = userConfig;

          if(_this.userConfig.recordList.length === 0){
            hasRecord = false;
          }

          var pickedRecord = _this.userConfig.recordList.filter(function(item){
            return item.signDate == cur_dateDay;
          })

          var hasPickedDay = pickedRecord.length? true:false;

          _this.setData({
            noRule:2,
            roleType:userConfig.ruleType,
            name:app.globalData.userInfo.nickName,
            company:_this.userConfig.company.name,
            signInfo:{
              recordList: _this.userConfig.recordList,
              hasRecord: hasRecord
            },
            hasPickedDay:hasPickedDay,
            pickedDayRecord:pickedRecord[0]
          })
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
  getRecordStatistic:function(){
    wx.navigateBack({
      delta:1
    })
  },
  getNowDate:function(type){
    var _this = this;
    var date  = new Date();
    var nowYear = date.getFullYear();
    var nowMonth = date.getMonth()+1;
    var nowDay = date.getDate();

    var nowDate = type ? _this.toTenFormat(nowYear)+'-'+_this.toTenFormat(nowMonth) : _this.toTenFormat(nowYear)+'-'+_this.toTenFormat(nowMonth)+'-'+_this.toTenFormat(nowDay);

    return nowDate;
  },
  toTenFormat:function(number){
    number = Number(number) < 10 ? "0"+Number(number) : Number(number);
    return number;
  },
  onShareAppMessage() {
    return {
      title: '移动考勤小程序',
      desc: '移动考勤',
      path: 'pages/signIn/sign'
    }
  }
};

Page(conf);
