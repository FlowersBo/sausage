// pages/pointLocation/pointLocation.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
let that;
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
      initStartTime: "2021-01-01",
      // initEndTime: "2021-12",
      limitStartTime: "2021-01-01",
      // limitEndTime: "2021-12"
    },
    pointGenres: ["点位排行榜", "自定义查询"],
    selected: 0,
    pointListItem: '', //点位列表
    date: util.customFormatTime(new Date()),
    reportDetail: {
      titles: ['点位', '销售额', '销售量'],
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
    pointDetaillyDate: '截止到昨日'
  },

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
      pageNum: 1
    })
    that.rankingList();
  },

  // 切换tab
  bindPointGenre: function (e) {
    let index = e.currentTarget.dataset.index;
    let reportDetail = that.data.reportDetail;
    that.setData({
      point: ''
    })
    if (index == 0) {
      reportDetail = {
        titles: ['点位', '销售额', '销售量'],
        titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png'],
      };
      let pointReportDate = new Date();
      pointReportDate.setDate(pointReportDate.getDate() - 1);
      pointReportDate = util.customFormatTime(pointReportDate);
      that.setData({
        selected: 0,
        reportDetail,
        pointList: [],
        pointDetaillyDate: '截止到昨日',
        pageNum: 1,
        date: pointReportDate,
        startDate: '',
        endDate: '',

      })
      that.rankingList();
    } else if (index == 1) {
      reportDetail.titles.push('明细');
      reportDetail.titleUrls.push('');
      that.setData({
        selected: 1,
        reportDetail,
        pointList: [],
        monthStartTime: '起始月份',
        monthEndTime: '结束月份',
        todayStartTime: '起始日期',
        todayEndTime: '结束日期',
        pageNum: 1,
        startDate: '',
        endDate: ''
      })
      that.rankingList();
    }
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
    if (that.data.selected == 1) {
      if (todayStartTime != '起始日期') {
        pointStartDate = todayStartTime;
        pointEndDate = todayEndTime;
        startTime = 0;
      } else if (monthStartTime != '起始月份') {
        pointStartDate = monthStartTime;
        pointEndDate = monthEndTime;
        startTime = 1;
      } else {
        pointStartDate = '';
        pointEndDate = '';
      }
    }
    //  else if (that.data.selected == 0) {
    //   pointStartDate = that.data.startDate;
    //   pointEndDate = that.data.endDate;
    // };
    console.log('点位id', point);
    wx.navigateTo({
      url: '../tableDetail/tableDetail?pointId=' + point + "&pointStartDate=" + pointStartDate + "&pointEndDate=" + pointEndDate + '&startTime=' + startTime
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
      pageNum: 1
    })
    that.rankingList();
  },

  // 下一日
  upJump: function (event) {
    // let myDate = new Date().getTime();
    // console.log('13位时间戳', myDate);
    let date = that.data.date;
    console.log(date);
    let pointid = that.data.pointid;
    let converedDate = new Date(Date.parse(date));
    console.log('修改时间', converedDate);
    converedDate.setDate(converedDate.getDate() + 1);
    let currentDate = util.customFormatTime(converedDate);
    that.setData({
      date: currentDate,
      startDate: currentDate,
      endDate: currentDate,
      pointDetaillyDate: currentDate,
      pageNum: 1
    })
    that.rankingList();
  },

  ///上一日
  lowerJump: function (event) {
    let date = that.data.date;
    let converedDate = new Date(Date.parse(date));
    converedDate.setDate(converedDate.getDate() - 1);
    let currentDate = util.customFormatTime(converedDate);
    that.setData({
      date: currentDate,
      startDate: currentDate,
      endDate: currentDate,
      pointDetaillyDate: currentDate,
      pageNum: 1
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

  async pointListItem() {
    let data = {};
    let result = await (mClient.get(api.PointList, data));
    console.log('点位列表', result);
    if (result.data.code == 200) {
      that.setData({
        pointListItem: result.data.data
      })
    }
  },
  bindPickerChange: function (e) {
    let pointListItem = that.data.pointListItem;
    that.setData({
      index: e.detail.value,
      pointId: pointListItem[e.detail.value].id,
      pageNum: 1
    })
    that.rankingList();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let pointReportDate = new Date();
    pointReportDate.setDate(pointReportDate.getDate() - 1);
    pointReportDate = util.customFormatTime(pointReportDate);
    that.setData({
      date: pointReportDate
    })
    that.pointListItem();
    that.rankingList();
  },

  async rankingList(pointList = []) {
    let {
      monthStartTime,
      monthEndTime,
      todayStartTime,
      todayEndTime,
      startDate,
      endDate,
      startMonth,
      endMonth
    } = that.data;
    if (that.data.selected == 1) {
      if (todayStartTime != '起始日期') {
        monthStartTime = '';
        monthEndTime = '';
        startDate = todayStartTime;
        endDate = todayEndTime;
      } else if (monthStartTime != '起始月份') {
        todayStartTime = '';
        todayEndTime = '';
        startMonth = monthStartTime;
        endMonth = monthEndTime;
      }
    } else if (that.data.selected == 0) {
      monthStartTime = '';
      monthEndTime = '';
      todayStartTime = '';
      todayEndTime = '';
      startDate = that.data.startDate;
      endDate = that.data.endDate;
    }
    let data = {
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
      startDate,
      endDate,
      startMonth,
      endMonth,
      sortType: that.data.pointSort,
      point: that.data.pointId,
    };
    let result = await (mClient.get(api.PointDefineSaleLis, data));
    console.log('点位排行榜', result);
    //内容
    if (result.data.code == 200) {
      let reportTotal = result.data.data;
      let total = result.data.data.saleList.total;
      pointList = pointList.concat(result.data.data.saleList.list);
      that.setData({
        pointList,
        reportTotal,
        total,
      })
      if ((that.data.pageNum * that.data.pageSize) >= total) {
        that.setData({
          loadText: '已经到底了',
        });
      } else {
        that.setData({
          loadText: '点击加载',
        });
      }
    } else {
      console.log('fail');
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
    that.rankingList(pointList);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})