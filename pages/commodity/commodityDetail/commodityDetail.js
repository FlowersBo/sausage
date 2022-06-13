// pages/pointLocation/pointLocation.js
import * as mClient from '../../../utils/customClient';
import * as api from '../../../config/api';
import * as util from '../../../utils/util';
let that;
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointGenres: ["日排行", "月排行"],
    selected: 0,
    selectedChild: 0,
    date: util.customFormatTime(new Date()),
    reportDetail: {
      titles: ['商品名称', '销售额', '销售量', '点位'],
      titleUrls: ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', ''],
    },
    goodsDetail: {
      titles: ['点位', '商品名称', '销售量', '销售额'],
      titleUrls: ['', '', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png'],
    },
    isGoodsSaleSum: false,
    isGoodsWasteSum: false,
    goodsSort: 1, //默认商品表排序按销售额升序
    isSaleAmountSort: false,
    isSaleCountSort: false,
    pointSort: 1, //默认点位表排序按销售额升序
    pageNum: 1,
    pageSize: 30,
    startDate: '',
    endDate: '',
    pointDetaillyDate: '',
    // 日历
    isShow: false,
    // themeColor: '#ffd00a',
    // calendarType: 'yydates',
    // startMonthCount: -11,
    // monthCount: 1,
    // pastDateChoice: true,
    // dateTitle: '',
    // dateSubTitle: '开始',
    // endDateSubTitle: '结束',
    // endDateTitle: '',
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
    ballList: [],
    agencyId: '',
    cityId: '',
    fields: 'day',
  },

  // 切换tab
  bindPointGenre: function (e) {
    let index = e.currentTarget.dataset.index;
    let reportDetail = that.data.reportDetail;
    that.setData({
      point: '',
      startDate: that.data.oldStartDate,
      endDate: that.data.oldEndDate,
    })
    if (index == 0) {
      that.setData({
        selected: 0,
        date: that.data.oldStartDate,
        selectedChild: 0,
        fields: 'day',
        date: util.customFormatTime(new Date())
      })
    } else if (index == 1) {
      that.setData({
        selected: 1,
        pageNum: 1,
        pointDetaillyDate: that.data.oldStartDate,
        isShow: true,
        selectedChild: 1,
        fields: 'month',
        date: util.customFormatMonth(new Date())
      })
    }
    that.goodsDetailList();
  },

  // 废弃跳转
  bindWaste: function (e) {
    let point = e.currentTarget.dataset.point;
    console.log('点位id', point);
    wx.navigateTo({
      url: '../pointWaste/pointWaste?pointId=' + point + "&pointStartDate=" + that.data.startDate + "&pointEndDate=" + that.data.endDate
    })
  },

  // 日期选择
  bindDateChange: function (e) {
    let date = e.detail.value;
    that.setData({
      date,
      pageNum: 1
    })
    that.goodsDetailList();
  },

  // 下一日
  upJump: function (event) {
    let converedDate = new Date(Date.parse(that.data.date));
    converedDate.setDate(converedDate.getDate() + 1);
    that.setData({
      date: `${that.data.selectedChild==0?util.customFormatTime(converedDate):util.addMonth(that.data.date,'add')}`,
      pageNum: 1
    })
    that.goodsDetailList();
  },

  ///上一日
  lowerJump: function (event) {
    let date = that.data.date;
    let converedDate = new Date(Date.parse(date));
    converedDate.setDate(converedDate.getDate() - 1);
    that.setData({
      date: `${that.data.selectedChild==0?util.customFormatTime(converedDate):util.customFormatMonth(converedDate)}`,
      pageNum: 1
    })
    that.goodsDetailList();
  },

  // 时间
  timeFn: function (date, up_next) {
    console.log(date);
    let converedDate = new Date(Date.parse(date));
    if (up_next == 1) {
      converedDate.setDate(converedDate.getDate() + 1);
      date = util.customFormatTime(converedDate);
    } else if (up_next == 0) {
      converedDate.setDate(converedDate.getDate() - 1);
      date = util.customFormatTime(converedDate);
    }
    that.setData({
      date,
      startDate: date,
      endDate: date,
      pointDetaillyDate: date,
      oldStartDate: date,
      oldEndDate: date,
      pageNum: 1
    })
    that.goodsDetailList();
  },

  // 点位排序
  bindPointSort: function (e) {
    let isGoodsSaleSum = that.data.isGoodsSaleSum;
    let isGoodsWasteSum = that.data.isGoodsWasteSum;
    let index = e.currentTarget.dataset.index;
    let goodsDetail = that.data.goodsDetail;
    console.info('当前销售量id', index);
    if (index === 2) {
      goodsDetail.titleUrls[3] = '../../../assets/img/arrow.png';
      if (isGoodsSaleSum === false) {
        goodsDetail.titleUrls[index] = '../../../assets/img/arrow-h.png';
        this.setData({
          isGoodsSaleSum: true,
          pointSort: 2,
          goodsDetail
        })
      } else {
        goodsDetail.titleUrls[index] = '../../../assets/img/arrow-l.png';
        this.setData({
          isGoodsSaleSum: false,
          pointSort: 1,
          goodsDetail
        })
      }
    } else if (index === 3) {
      goodsDetail.titleUrls[2] = '../../../assets/img/arrow.png';
      if (isGoodsWasteSum === false) {
        goodsDetail.titleUrls[index] = '../../../assets/img/arrow-h.png';
        this.setData({
          isGoodsWasteSum: true,
          pointSort: 4,
          goodsDetail
        })
      } else {
        goodsDetail.titleUrls[index] = '../../../assets/img/arrow-l.png';
        this.setData({
          isGoodsWasteSum: false,
          pointSort: 3,
          goodsDetail
        })
      }
    } else {
      return;
    };
    that.setData({
      pageNum: 1
    })
    that.goodsDetailList();
  },


  // 城市下拉选择列表
  async selectAgencyItem() {
    let data = {};
    let result = await (mClient.get(api.SelectAgencyItem, data));
    console.log('合作商列表', result);
    if (result.data.code == 200) {
      that.setData({
        agencyItem: result.data.data.agencys
      })
    }
  },
  async cityListItem() {
    let data = {};
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
        cityId: that.data.cityItem[e.detail.value].regionId,
        pageNum: 1
      })
    } else {
      that.setData({
        cityIndex: '',
        cityId: '',
        agencyIndex: e.detail.value,
        agencyId: that.data.agencyItem[e.detail.value].regionId,
        pageNum: 1
      })
    }
    that.goodsDetailList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let {
      productId,
      date,
      selected
    } = options;
    console.log(productId, date)
    // let pointReportDate = new Date();
    // pointReportDate.setDate(pointReportDate.getDate());
    // pointReportDate = util.customFormatTime(pointReportDate);
    that.setData({
      date: date,
      startDate: date,
      endDate: date,
      productId,
      selected,
      selectedChild: selected
      // oldStartDate: date,
      // oldEndDate: date,
    })
    that.promiseAll();
    that.selectAgencyItem();
    that.cityListItem();
  },

  async goodsDetailList(commodityDetailList = []) {
    let {
      cityId,
      agencyId,
      date,
      productId
    } = that.data;
    let data = {
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
      searchDate: `${that.data.selectedChild==0?date:''}`,
      searchMonth: `${that.data.selectedChild==1?date:''}`,
      cityId,
      agencyId,
      productId,
      sortType: that.data.pointSort,
    };
    let result = await (mClient.get(api.ProductRankingDetail, data));
    console.log('点位列表', result);
    if (result.data.code == 200) {
      let total = result.data.data.total;
      commodityDetailList = commodityDetailList.concat(result.data.data.list);
      // commodityDetailList.forEach(element => {
      //   element.psbList.filter((item, index, arr) => {
      //     if (item.wasteSum > 0) {
      //       element.isWasteSum = true;
      //     }
      //   });
      // });
      console.log(commodityDetailList);
      that.setData({
        commodityDetailList,
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
    let commodityDetailList = that.data.commodityDetailList;
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
    that.goodsDetailList(commodityDetailList);
  },


  //Promise.allSettled
  promiseAll() {
    const promises = [
      that.goodsDetailList()
    ];
    mClient.allSettled(promises).then(res => {});
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
        selected: app.globalData.selected
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
      cityId: '',
      agencyId: '',
      cityIndex: '',
      agencyIndex: '',
      pageNum: 1
    })
    that.goodsDetailList();
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