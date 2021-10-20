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
    pointGenres: ["商品排行榜", "自定义查询"],
    selected: 0,
    date: util.customFormatTime(new Date()),
    reportDetail: {
      titles: ['商品', '销售额', '销售量'],
      titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png'],
    },
    goodsDetail: {
      titles: ['点位', '商品名称', '销售量', '废弃量'],
      titleUrls: ['', '', '../../assets/img/arrow.png', '../../assets/img/arrow.png'],
    },
    isGoodsSaleSum: false,
    isGoodsWasteSum: false,
    goodsSort: 1, //默认商品表排序按销售额升序
    isSaleAmountSort: false,
    isSaleCountSort: false,
    pointSort: 1, //默认点位表排序按销售额升序
    pageNum: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    pointDetaillyDate: '',
    // 日历
    isShow: false,
    themeColor: '#ffd00a',
    calendarType: 'yydates',
    startMonthCount: -11,
    monthCount: 1,
    pastDateChoice: true,
    dateTitle: '',
    dateSubTitle: '开始',
    endDateSubTitle: '结束',
    endDateTitle: '',
  },
  // 点击显示插件
  btnClick: function () {
    console.log('显示');
    this.setData({
      isShow: true,
    })
  },

  _yybindchange: function (e) {
    that.setData({
      loadText: '',
    })
    let dateWrap = e.detail;
    console.log('选择范围', dateWrap);
    let startDate = dateWrap.startTime,
      endDate = dateWrap.endTime;
    that.setData({
      pointDetaillyDate: `${startDate}~${endDate}`,
      startDate,
      endDate
    })
    that.goodsList();
    that.goodsDetailList();
  },

  _yybindhide: function () {
    console.log('隐藏')
  },

  _yybinddaychange: function (e) {
    console.log('日期发生变化', e);
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
      reportDetail.titles = ['商品', '销售额', '销售量'];
      that.setData({
        selected: 0,
        date: that.data.oldStartDate,
        reportDetail,
      })
    } else if (index == 1) {
      reportDetail.titles = ['商品', '销售量', '废弃量'];
      that.setData({
        selected: 1,
        pageNum: 1,
        reportDetail,
        pointDetaillyDate: that.data.oldStartDate
      })
      that.btnClick();
    }
    that.goodsList();
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
    let currentDate = util.customFormatTime(e.detail.value);
    console.log(e.detail.value);
    that.timeFn(e.detail.value);
  },

  // 下一日
  upJump: function (event) {
    // let myDate = new Date().getTime();
    // console.log('13位时间戳', myDate);
    that.timeFn(that.data.date, 1);
  },

  ///上一日
  lowerJump: function (event) {
    that.timeFn(that.data.date, 0);
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
    that.goodsList();
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
      goodsDetail.titleUrls[3] = '../../assets/img/arrow.png';
      if (isGoodsSaleSum === false) {
        goodsDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isGoodsSaleSum: true,
          pointSort: 2,
          goodsDetail
        })
      } else {
        goodsDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isGoodsSaleSum: false,
          pointSort: 1,
          goodsDetail
        })
      }
    } else if (index === 3) {
      goodsDetail.titleUrls[2] = '../../assets/img/arrow.png';
      if (isGoodsWasteSum === false) {
        goodsDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isGoodsWasteSum: true,
          pointSort: 4,
          goodsDetail
        })
      } else {
        goodsDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isGoodsWasteSum: false,
          pointSort: 3,
          goodsDetail
        })
      }
    } else {
      return;
    };
    that.goodsDetailList();
  },

  // 商品排序
  bindGoodsSort: function (e) {
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
          goodsPointSort: 2,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleAmountSort: false,
          goodsPointSort: 1,
          reportDetail: reportDetail
        })
      }
    } else if (index === 2) {
      reportDetail.titleUrls[1] = '../../assets/img/arrow.png';
      if (isSaleCountSort === false) {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-h.png';
        this.setData({
          isSaleCountSort: true,
          goodsPointSort: 4,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../assets/img/arrow-l.png';
        this.setData({
          isSaleCountSort: false,
          goodsPointSort: 3,
          reportDetail: reportDetail
        })
      }
    } else {
      return;
    };
    that.goodsList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let pointReportDate = new Date();
    pointReportDate.setDate(pointReportDate.getDate());
    pointReportDate = util.customFormatTime(pointReportDate);
    that.setData({
      date: pointReportDate,
      startDate: pointReportDate,
      endDate: pointReportDate,
      oldStartDate: pointReportDate,
      oldEndDate: pointReportDate,
    })
    // const promise2 = new Promise((resolve, reject) => setTimeout(resolve, reject, 100, 'foo'));
    // console.log(promise2);
    that.promiseAll();
  },

  async goodsList(commodityList = []) {
    let {
      startDate,
      endDate
    } = that.data;
    if (that.data.selected == 0) {

    } else if (that.data.selected == 1) {

    }
    let data = {
      startDate,
      endDate,
      sortType: that.data.goodsPointSort
    };
    let result = await (mClient.get(api.ProductRanking, data));
    console.log('商品排行榜', result);
    //内容
    if (result.data.code == 200) {
      commodityList = commodityList.concat(result.data.data);
      that.setData({
        commodityList,
      })
    } else {
      console.log('fail');
    }
  },


  async goodsDetailList(commodityDetailList = []) {
    let {
      startDate,
      endDate,
    } = that.data;
    let data = {
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
      startDate,
      endDate,
      sortType: that.data.pointSort,
    };
    let result = await (mClient.get(api.ProductRankingDetail, data));
    console.log('点位销售明细', result);
    if (result.data.code == 200) {
      let total = result.data.data.total;
      commodityDetailList = commodityDetailList.concat(result.data.data.list);
      commodityDetailList.forEach(element => {
        element.psbList.filter((item, index, arr) => {
          if (item.wasteSum > 0) {
            element.isWasteSum = true;
          }
        });
      });
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
      that.goodsList(),
      that.goodsDetailList()
    ];
    mClient.allSettled(promises).then(res => {
      console.log(res)
    });
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