// pages/pointLocation/pointLocation.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
let that;
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 月份
    isDate: true,
    isPickerShow: false,
    isPickerRender: false,
    todayStartTime: "起始日期",
    todayEndTime: "结束日期",
    monthStartTime: "起始月份",
    monthEndTime: "结束月份",
    pickerConfig: {
      endDate: true,
      column: "second",
      dateLimit: true,
      initStartTime: "2022-01-01",
      // initEndTime: "2021-12",
      limitStartTime: "2022-01-01",
      // limitEndTime: "2021-12",
      yearStart: "2021",
    },
    pointGenres: ["城市排行榜", "点位排行榜", "自定义查询"],
    tabchild: ['日排行', '月排行'],
    selected: 0,
    selectedChild: 0,
    pointListItem: '', //点位列表
    date: util.customFormatTime(new Date()),
    reportDetail: {
      titles: ['城市', '销售额', '销售量'],
      titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png'],
    },
    isSaleAmountSort: false,
    isSaleCountSort: false,
    pointSort: 1, //默认点位表排序按销售额升序
    pageNum: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    startMonth: '',
    endMonth: '',
    pointDetaillyDate: '',
    ballList: [],
    agencyId: '',
    fields: 'day',
    // 日历控件
    calendarConfig: {
      theme: 'elegant',
      // highlightToday: true,
      // markToday: '今日',
      // showHolidays: true,
      // emphasisWeek: true,
      chooseAreaMode: true,
      // defaultDate: '2020-9-8',
      // autoChoosedWhenJump: true
    },
    frequency: 0,
    startTime: '',
    endTime: ''
  },

  calendarFn() {
    that.setData({
      isShow: true
    })
    that.fadeIn();
  },

  // 日历、
  afterTapDate(e) {
    let frequency = that.data.frequency;
    if (e.detail.month <= 9) {
      e.detail.month = `0${e.detail.month}`
    }
    if (e.detail.date <= 9) {
      e.detail.date = `0${e.detail.date}`
    }
    if (frequency == 0) {
      that.setData({
        frequency: 1,
        startTimer: `${e.detail.year}-${e.detail.month}-${e.detail.date}`
      })
    } else {
      that.setData({
        frequency: 0,
        endTimer: `${e.detail.year}-${e.detail.month}-${e.detail.date}`
      })
      let startTimer = (new Date(that.data.startTimer.replace(/-/g, '/'))).getTime();
      let endTimer = (new Date(that.data.endTimer.replace(/-/g, '/'))).getTime();
      if (startTimer < endTimer) {
        startTimer = that.data.startTimer;
        endTimer = that.data.endTimer;
      } else {
        startTimer = that.data.endTimer;
        endTimer = that.data.startTimer;
      }
      this.setData({
        // pointDetaillyDate: startTimer + '~' + endTimer,
        startTime: startTimer,
        endTime: endTimer,
        isShow: false
      });
      that.fadeDown();
      that.rankingList();
    }
    // switch (e) {
    // 	case frequency: {
    // const calendar = this.selectComponent('#calendar').calendar;
    // const {
    // 	year,
    // 	month
    // } = calendar.getCurrentYM();
    // const selected = calendar['getSelectedDates']();
    // if (!selected || !selected.length)
    // 	return this.showToast('当前未选择任何日期')
    // console.log('当前选择时间', selected)
    // const rst = selected.map(item => JSON.stringify(item));
    // console.log(rst)
    //   break
    //  }
    // }
  },

  afterCalendarRender(e) {},

  cancelWindowFn() {
    that.setData({
      isShow: false
    })
    that.fadeDown();
  },


  fadeIn: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    animation.bottom(60).step()
    this.setData({
      animationData: animation.export()
    })
  },

  fadeDown: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear', //动画的效果 默认值是linear
    })
    animation.bottom(-720).step()
    this.setData({
      animationData: animation.export()
    })
  },

  // 单日月
  // dateTimeBody(e) {
  //   this.setData({
  //     date: e.detail,
  //     startDate: e.detail,
  //     endDate: e.detail,
  //     pointDetaillyDate: e.detail,
  //     oldStartDate: e.detail,
  //     oldEndDate: e.detail,
  //     pageNum: 1
  //   })
  //   that.rankingList();
  // },

  //组件监听选项
  // bindBallFn(e) {
  //   wx.showToast({
  //     title: '当前选择：' + e.detail.agencyName,
  //     icon: 'none',
  //     duration: 2000
  //   });
  //   wx.setStorageSync('agencySelect', e.detail.agencyId)
  //   that.setData({
  //     agencyId: e.detail.agencyId
  //   })
  //   that.rankingList();
  //   that.pointListItem();
  // },

  // 日期区间选择
  pickerShow: function (e) {
    let dateid = e.currentTarget.dataset.dateid;
    if (dateid == 0) {
      that.setData({
        isDate: true
      })
    } else {
      that.setData({
        isDate: false
      })
    }
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },

  pickerHide: function () {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  // setTodayPickerTime: function (val) {
  //   console.log('日期时间段', val);
  //   let monthlyDate = val.detail;
  //   that.setData({
  //     todayStartTime: monthlyDate.startTime,
  //     todayEndTime: monthlyDate.endTime,
  //     pointDetaillyDate: `${monthlyDate.startTime}~${monthlyDate.endTime}`
  //   });
  // },

  setMonthPickerTime: function (val) {
    let isDate = that.data.isDate;
    console.log('时间段', val);
    let monthlyDate = val.detail;
    if (isDate) {
      that.setData({
        todayStartTime: monthlyDate.startTime,
        todayEndTime: monthlyDate.endTime,
        monthStartTime: '起始月份',
        monthEndTime: '结束月份',
        pointDetaillyDate: `${monthlyDate.startTime}~${monthlyDate.endTime}`
      });
    } else {
      that.setData({
        monthStartTime: monthlyDate.startTime,
        monthEndTime: monthlyDate.endTime,
        todayStartTime: '起始日期',
        todayEndTime: '结束日期',
        pointDetaillyDate: `${monthlyDate.startTime}~${monthlyDate.endTime}`
      });
    }
    that.setData({
      startDate: '',
      endDate: '',
      pageNum: 1
    })
    that.rankingList();
  },

  // 切换上边tab
  bindPointGenre: function (e) {
    let index = e.currentTarget.dataset.index;
    let reportDetail = that.data.reportDetail;
    let dateRange = parseInt('' + index + that.data.selectedChild);
    that.setData({
      point: '',
      pageNum: 1,
      pointList: [],
      dateRange
    })
    if (index == 0) {
      that.setData({
        selected: 0,
        reportDetail: {
          titles: ['城市', '销售额', '销售量'],
          titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png'],
        },
        startDate: that.data.oldStartDate,
        endDate: that.data.oldEndDate
      })
    } else if (index == 1) {
      that.setData({
        selected: 1,
        reportDetail: {
          titles: ['点位', '销售额', '销售量'],
          titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png'],
        },
      })
    } else {
      if (reportDetail.titles.length < 4) {
        reportDetail.titles[0] = '点位';
        reportDetail.titles.push('明细');
        reportDetail.titleUrls.push('');
      }
      let {
        startDate,
        endDate
      } = that.data;
      that.setData({
        selected: 2,
        reportDetail,
        monthStartTime: '起始月份',
        monthEndTime: '结束月份',
        todayStartTime: '起始日期',
        todayEndTime: '结束日期',
        pageNum: 1,
        startDate: that.data.oldStartDate,
        endDate: that.data.oldEndDate,
        pointDetaillyDate: that.data.oldStartDate,
      })
    }
    that.rankingList();
  },

  selectedDateRange(e) {
    let index = e.currentTarget.dataset.index;
    let dateRange = parseInt('' + index + that.data.selected);
    that.setData({
      propDate: true,
      dateRange
    })
    if (index === 0) {
      that.setData({
        // isMonth: false,
        selectedChild: 0,
        fields: 'day',
        date: util.customFormatTime(new Date())
      })
    } else {
      that.setData({
        // isMonth: true,
        selectedChild: 1,
        fields: 'month',
        date: util.customFormatMonth(new Date())
      })
    }
    that.rankingList();
  },

  // 明细跳转
  bindDetail: function (e) {
    let point = e.currentTarget.dataset.point;
    let pointStartDate, pointEndDate;
    let startTime;
    let {
      monthStartTime,
      monthEndTime,
      todayStartTime,
      todayEndTime
    } = that.data;
    if (that.data.selected == 2) {
      // if (todayStartTime != '起始日期') {
      //   pointStartDate = todayStartTime;
      //   pointEndDate = todayEndTime;
      //   startTime = 0;
      // } else if (monthStartTime != '起始月份') {
      //   pointStartDate = monthStartTime;
      //   pointEndDate = monthEndTime;
      //   startTime = 1;
      // } else {
      //   pointStartDate = '';
      //   pointEndDate = '';
      // }
    }
    //  else if (that.data.selected == 0) {
    //   pointStartDate = that.data.startDate;
    //   pointEndDate = that.data.endDate;
    // };
    console.log('点位id', point);
    console.log('明细时间', that.data.startTime,that.data.endTime);
    wx.navigateTo({
      url: '../tableDetail/tableDetail?pointId=' + point + "&pointStartDate=" + that.data.startTime + "&pointEndDate=" + that.data.endTime + '&startTime=' + startTime
    })
  },

  // 日期选择
  bindDateChange: function (e) {
    let date = e.detail.value;
    let currentDate = util.customFormatTime(date);
    that.setData({
      date,
      startDate: date,
      endDate: date,
      pointDetaillyDate: date,
      oldStartDate: date,
      oldEndDate: date,
      pageNum: 1
    })
    that.rankingList();
  },

  // 下一日
  upJump: function (event) {
    // let myDate = new Date().getTime();
    // console.log('13位时间戳', myDate);
    let converedDate = new Date(Date.parse(that.data.date));
    converedDate.setDate(converedDate.getDate() + 1);
    that.setData({
      date: `${that.data.selectedChild==0?util.customFormatTime(converedDate):util.addMonth(that.data.date,'add')}`,
      // startDate: currentDate,
      // endDate: currentDate,
      // oldStartDate: currentDate,
      // oldEndDate: currentDate,
      // pointDetaillyDate: currentDate,
    })
    that.rankingList();
  },

  ///上一日
  lowerJump: function (event) {
    let date = that.data.date;
    let converedDate = new Date(Date.parse(date));
    converedDate.setDate(converedDate.getDate() - 1);
    that.setData({
      date: `${that.data.selectedChild==0?util.customFormatTime(converedDate):util.customFormatMonth(converedDate)}`,
      // startDate: currentDate,
      // endDate: currentDate,
      // oldStartDate: currentDate,
      // oldEndDate: currentDate,
      // pointDetaillyDate: currentDate,
      // pageNum: 1
    })
    that.rankingList();
  },

  // 销售额/销售量排序列表
  bindPointSort: function (e) {
    let isSaleAmountSort = that.data.isSaleAmountSort;
    let isSaleCountSort = that.data.isSaleCountSort;
    let index = e.currentTarget.dataset.index;
    let reportDetail = that.data.reportDetail;
    console.info('当前销售量id', index);
    if (index === 1) {
      reportDetail.titleUrls[2] = '../../assets/img/arrow.png';
      if (isSaleAmountSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isSaleAmountSort: true,
          pointSort: 2,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleAmountSort: false,
          pointSort: 1,
          reportDetail: reportDetail
        })
      }
    } else if (index === 2) {
      reportDetail.titleUrls[1] = '../../assets/img/arrow.png';
      if (isSaleCountSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isSaleCountSort: true,
          pointSort: 4,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleCountSort: false,
          pointSort: 3,
          reportDetail: reportDetail
        })
      }
    } else {
      return;
    };
    that.rankingList();
  },

  // 城市下拉选择列表
  async selectAgencyItem() {
    let data = {
      agencyId: that.data.agencyId
    };
    let result = await (mClient.get(api.SelectAgencyItem, data));
    console.log('合作商列表', result);
    if (result.data.code == 200) {
      that.setData({
        agencyItem: result.data.data.agencys
      })
    }
  },
  async cityListItem() {
    let data = {
      agencyId: that.data.agencyId
    };
    let result = await (mClient.get(api.SelectCityItem, data));
    console.log('城市列表', result);
    if (result.data.code == 200) {
      that.setData({
        cityItem: result.data.data
      })
    }
  },

  bindPickerChange: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.index == 0) {
      that.setData({
        agencyIndex: '',
        agencyId: '',
        cityIndex: e.detail.value,
        cityId: that.data.cityItem[e.detail.value].regionId
      })
    } else {
      that.setData({
        cityIndex: '',
        cityId: '',
        agencyIndex: e.detail.value,
        agencyId: that.data.agencyItem[e.detail.value].regionId
      })
    }

    that.rankingList();
  },
  bindMultiPickerColumnChange(e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let pointReportDate = new Date();
    // pointReportDate.setDate(pointReportDate.getDate() - 1); //昨日
    pointReportDate.setDate(pointReportDate.getDate()); //昨日
    pointReportDate = util.customFormatTime(pointReportDate);
    console.log('初始时间', pointReportDate);
    that.setData({
      startDate: pointReportDate,
      endDate: pointReportDate,
      oldStartDate: pointReportDate,
      oldEndDate: pointReportDate,
      pointDetaillyDate: pointReportDate,
      // ballList: wx.getStorageSync('agencyList'),
      // agencyId: wx.getStorageSync('agencySelect')
    })
    that.selectAgencyItem();
    that.cityListItem();
    that.rankingList();
  },

  async rankingList(pointList = [], pageNum = 1) {
    let {
      // monthStartTime,
      // monthEndTime,
      // todayStartTime,
      // todayEndTime,


      startTime,
      endTime,
      startDate,
      endDate,
      cityId,
      agencyId,
      date
    } = that.data;
    // monthStartTime = '';
    // monthEndTime = '';
    // todayStartTime = '';
    // todayEndTime = '';
    if (that.data.selected == 2) {
      // if (todayStartTime != '起始日期') {
      //   startDate = todayStartTime;
      //   endDate = todayEndTime;
      // } else if (monthStartTime != '起始月份') {
      //   startMonth = monthStartTime;
      //   endMonth = monthEndTime;
      // }
      let data = {
        startDate: startTime,
        endDate: endTime,
        cityId,
        agencyId,
        sortType: that.data.pointSort,
        pageNum,
        pageSize: that.data.pageSize,
      };
      let result = await (mClient.get(api.PointCustomize, data));
      console.log('自定义查询', result)
      if (result.data.code == 200) {
        let total = result.data.data.total;
        pointList = pointList.concat(result.data.data.list);
        that.setData({
          pointList,
          total,
        })
      } else {
        console.log('fail');
      }
    } else if (that.data.selected == 0 || that.data.selected == 1) {
      let data = {
        pageNum,
        pageSize: that.data.pageSize,
        searchMonth: `${that.data.selectedChild==1?date:''}`,
        searchDate: `${that.data.selectedChild==0?date:''}`,
        sortType: that.data.pointSort
      };
      let result = await (that.data.selected == 0 ? mClient.get(api.CityBillboard, data) : mClient.get(api.PointBillboard, data));
      console.log('城市/点位排行榜', result);
      //内容
      if (result.data.code == 200) {
        let total = `${that.data.selected == 0 ? result.data.data.saleList.total:result.data.data.total}`;
        pointList = pointList.concat(that.data.selected == 0 ? result.data.data.saleList.list : result.data.data.list);
        that.setData({
          pointList,
          total,
        })
      } else {
        console.log('fail');
      }
    }
    if ((that.data.pageNum * that.data.pageSize) >= that.data.total) {
      that.setData({
        loadText: '已经到底了',
      });
    } else {
      that.setData({
        loadText: '点击加载',
      });
    }
  },

  bindLoading: function () {
    let pointList = that.data.pointList;
    let pageNum = that.data.pageNum;
    let pageSize = that.data.pageSize;
    let total = that.data.total;
    pageNum = pageNum + 1;
    if ((pageNum * pageSize) - total >= pageSize) {
      that.setData({
        loadText: '已经到底了',
      })
      return;
    };
    that.setData({
      pageNum,
    })
    that.rankingList(pointList, pageNum);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: app.data.selected
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that.setData({
      // date: util.customFormatTime(new Date()),
      startTime: '',
      endTime: '',
      cityId: '',
      agencyId: '',
      cityIndex: '',
      agencyIndex:''
    })
    that.rankingList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})