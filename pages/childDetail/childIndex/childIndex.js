import * as mClient from '../../../utils/customClient';
import * as api from '../../../config/api';
import * as util from '../../../utils/util';
let that;
let app = getApp();

Page({
  data: {
    loadText: '点击加载更多',
    dateRangeindex: 0,
    info: {
      reportGenres: ['销售日报', '销售月报', '销售年报'],
      dateRange: [
        ['今日', '昨日', '近7日', '自定义'],
        ['本月', '上月', '近三月', '自定义'],
      ],
    },
    reportTotal: {
      '销售额': `0元`,
      '订单数': `0单`,
      '销售量': `0根`
    },
    cumulativeSales: {
      '累计销售额': `0元`,
      '累计销售量': `0根`,
    },
    reportDetail: {
      titles: ['点位', '销售额', '销售量', '时段'],
      titleUrls: ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', ''],
    },
    reportGenre: 0,
    dateRange: 0,
    pageIndex: 1,
    pageSize: 20,

    pointsData: [],

    pointDetaillyDate: '', //计算的时间段
    // 排序
    isSaleAmountSort: false,
    isSaleCountSort: false,
    pointSort: 1, //默认点位表排序按销售额升序
    pointTotal: 0,

    // 日历
    isShow: false,
    fields: 'day',
    yearfields: 'year',
   
    frequency: 0,
    agencyId: '',
    isIds: false,

  },

  //退出
  dropOutFn() {
    wx.showModal({
      title: '退出登录',
      content: '确定退出当前账号吗？',
      success(res) {
        if (res.confirm) {
          try {
            wx.clearStorageSync()
            wx.reLaunch({
              url: '/pages/login/login'
            })
          } catch (e) {}
        }
      }
    })
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
      that.renderReport(that.data.dateRange, startTimer, endTimer);
      this.setData({
        pointDetaillyDate: startTimer + '~' + endTimer,
        startTime: startTimer,
        endTime: endTimer,
        isShow: false
      });
      that.fadeDown();
    }
  },

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

  onLoad: function (options) {
    that = this;
  },
  async initFn() {
    let result = await (mClient.post(api.Init));
    console.log('初始化', result);
    if (result.data.data.agencyIds.length <= 1) {
      that.setData({
        agencyId: result.data.data.agencyIds[0].agencyId,
        agencyName: result.data.data.agencyIds[0].agencyName,
        isIds: false
      })
    } else {
      that.setData({
        isIds: true
      })
    }
    let reportDetail = that.data.reportDetail;
    if (that.data.isIds) {
      reportDetail.titles = ['合作商', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', '']
      that.setData({
        reportDetail
      })
    }
    wx.setStorageSync('roles', result.data.data.roles);
    that.renderTransactionSummation(that.data.dateRange);
  },

  // 切换销售日月报
  selectedReportGenres: function (e) {
    const instance = this.selectComponent('.listss');
    // 打印出来的就是list 组件的实例了，这样就可以获取到子组件所有的数据了！
    // 注意！这里也可以调用setData 等方法直接修改组件的值
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      that.setData({
        fields: 'day'
      })
    } else {
      that.setData({
        fields: 'month'
      })
    }
    let dateRangeindex = that.data.dateRangeindex;
    console.log(index, dateRangeindex);
    let dateRange = parseInt('' + index + dateRangeindex);
    console.log('上边', dateRange);
    let reportDetail = that.data.reportDetail;
    if (that.data.isIds) {
      reportDetail.titles = ['合作商', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', '']
    } else if (dateRange === 0 || dateRange === 1) {
      reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', '']
    } else if (dateRange === 2 || dateRange === 3 || dateRange === 10 || dateRange === 11) {
      reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', '']
    } else {
      reportDetail.titles = ['点位', '销售额', '销售量'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png']
    };
    this.setData({
      reportGenre: index,
      dateRange: dateRange,
      reportDetail: reportDetail,
    });
    that.renderTransactionSummation();
  },

  // 切换天数/月数
  selectedDateRange: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let reportGenre = that.data.reportGenre;
    let dateRange = parseInt('' + reportGenre + index);
    console.info('下边', dateRange);
    that.setData({
      dateRange
    })
    let reportDetail = that.data.reportDetail;
    if (that.data.isIds) {
      reportDetail.titles = ['合作商', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', '']
    } else if (dateRange === 0 || dateRange === 1) {
      reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', ''];
    } else if (dateRange === 2 || dateRange === 3 || dateRange === 10 || dateRange === 11) {
      reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', ''];
    } else {
      reportDetail.titles = ['点位', '销售额', '销售量'];
      reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png']
    };
    this.setData({
      dateRange: dateRange,
      dateRangeindex: index,
      dateRangeindex_off: index,
      reportDetail: reportDetail,
    });
    this.renderTransactionSummation(dateRange);
  },

  // 计算切换时间段
  renderTransactionSummation: function () {
    this.setData({
      loadText: '点击加载更多',
    })
    let dateRange = that.data.dateRange;
    console.log('当前的dateRange', dateRange);
    let pointReportDate = new Date();
    let pointDetaillyDate;
    let startDate, endDate;
    if (dateRange === 0) {
      startDate = util.customFormatTime(pointReportDate);
      pointDetaillyDate = startDate;
      that.renderReport(that.data.dateRange, startDate);
    } else if (dateRange === 1) {
      pointReportDate.setDate(pointReportDate.getDate() - 1)
      startDate = util.customFormatTime(pointReportDate);
      pointDetaillyDate = startDate;
      that.renderReport(that.data.dateRange, startDate);
    } else if (dateRange === 2) {
      pointReportDate.setDate(pointReportDate.getDate() - 6);
      startDate = util.customFormatTime(pointReportDate);
      endDate = util.customFormatTime(new Date());
      pointDetaillyDate = startDate + '~' + endDate;
      that.renderReport(that.data.dateRange, startDate, endDate);
    } else if (dateRange === 3) {
      let startCustomDate,
        endCustomDate;
      pointReportDate.setDate(pointReportDate.getDate() - 30);
      startCustomDate = util.customFormatTime(pointReportDate);
      endCustomDate = util.customFormatTime(new Date());
      that.setData({
        startCustomDate,
        endCustomDate,
        pointDetaillyDate: startCustomDate + '~' + endCustomDate
        // isShow: true
      })
      that.renderReport(that.data.dateRange, startCustomDate, endCustomDate);

    } else if (dateRange == 10) {
      pointReportDate.setMonth(pointReportDate.getMonth());
      startDate = util.customFormatMonth(pointReportDate);
      pointDetaillyDate = startDate;
      that.renderReport(that.data.dateRange, '', startDate);
    } else if (dateRange == 11) {
      pointReportDate.setDate(1);
      pointReportDate.setMonth(pointReportDate.getMonth() - 1);
      startDate = util.customFormatMonth(pointReportDate);
      pointDetaillyDate = startDate;
      that.renderReport(that.data.dateRange, '', startDate);
      console.log(startDate);
    } else if (dateRange == 12) {
      pointReportDate.setDate(1);
      pointReportDate.setMonth(pointReportDate.getMonth() - 3);
      startDate = util.customFormatMonth(pointReportDate);
      pointReportDate.setMonth(pointReportDate.getMonth() + 2);
      endDate = util.customFormatMonth(pointReportDate);
      console.log(startDate);
      pointDetaillyDate = startDate + '~' + endDate;
      that.monthlySalesVolume(startDate, endDate);
    } else if (dateRange == 13) {
      let startCustomDate,
        endCustomDate;
      pointReportDate.setDate(1);
      let month = new Date(new Date().getFullYear(), 0);
      console.log('月数', month)
      startCustomDate = util.customFormatMonth(month);
      pointReportDate.setMonth(pointReportDate.getMonth() - 1);
      endCustomDate = util.customFormatMonth(pointReportDate);
      that.setData({
        startCustomDate,
        endCustomDate,
        pointDetaillyDate: startCustomDate + '~' + endCustomDate
      })
      that.monthlySalesVolume(startCustomDate, endCustomDate);

      // that.pickerShow();
    } else if (dateRange == 20||dateRange == 21||dateRange == 22||dateRange == 23) {
      startDate = new Date().getFullYear()
      pointDetaillyDate = startDate
    }
    that.setData({
      pointDetaillyDate,
      startDate,
      endDate
    })
  },

  // 查询列表数据
  renderReport: function (dateRange = 0, searchDate, searchMonth, pageIndex = 1, pointsData = []) {
    that.setData({
      loadText: '点击加载更多'
    })
    console.log(dateRange);
    let reportTotal = that.data.reportTotal;
    let cumulativeSales = that.data.cumulativeSales;
    let data;
    if (that.data.isIds) {
      switch (dateRange) {
        case 2:
        case 3:
          data = {
            startDate: searchDate,
            endDate: searchMonth,
            sortType: that.data.pointSort,
            pageNum: pageIndex,
            pageSize: that.data.pageSize,
            agencyId: that.data.agencyId,
            showSaleSum: true,
            showSaleTotal: true,
            regionId: that.data.regionId
          };
          break;
        default:
          data = {
            searchDate,
            searchMonth,
            sortType: that.data.pointSort,
            pageNum: pageIndex,
            pageSize: that.data.pageSize,
            agencyId: that.data.agencyId,
            showSaleSum: true,
            showSaleTotal: true,
            regionId: that.data.regionId
          };
      };

      mClient.get(api.AgencyList, data)
        .then(resp => {
          console.log('合作商列表', resp)
          if (!resp.data.data.summary) {
            that.setData({
              reportTotal: {
                '销售额': `0元`,
                '订单数': `0单`,
                '销售量': `0根`
              }
            })
            return
          }
          cumulativeSales['累计销售额'] = `${resp.data.data.total.totalAmount}元`;
          cumulativeSales['累计销售量'] = `${resp.data.data.total.totalCount}根`;
          reportTotal['销售额'] = `${resp.data.data.summary.amount}元`;
          reportTotal['订单数'] = `${resp.data.data.summary.orderSum}单`;
          reportTotal['销售量'] = `${resp.data.data.summary.productCount}根`;
          let pointTotal = resp.data.data.agencyList.total;
          that.setData({
            reportTotal,
            cumulativeSales
          })
          if ((that.data.pageSize * (pageIndex - 1)) >= pointTotal && pointTotal > 0) {
            this.setData({
              loadText: '已经到底了',
            })
            return
          }
          pointsData = pointsData.concat(resp.data.data.agencyList.list);
          console.log('列表', pointsData);
          that.setData({
            pointsData: pointsData,
            pageIndex
          })
          if (that.data.pageSize * pageIndex >= pointTotal) {
            this.setData({
              loadText: '已经到底了',
            })
            return
          }
        })
        .catch(err => {

        })
      return;
    }

    if (dateRange === 2 || dateRange === 3) {
      data = {
        startDate: searchDate,
        endDate: searchMonth,
        sortType: that.data.pointSort,
        pageNum: pageIndex,
        pageSize: that.data.pageSize,
        agencyId: that.data.agencyId,
        showSaleSum: true,
        showSaleTotal: true,
        regionId: that.data.regionId
      };
      mClient.get(api.PointSaleList, data)
        .then(resp => {
          let statistics = resp.data.data.statistics;
          console.log('7天/自定义日报', resp);
          if (!resp.data.data) {
            that.setData({
              reportTotal: {
                '销售额': `0元`,
                '订单数': `0单`,
                '销售量': `0根`
              }
            })
            return
          }
          reportTotal['销售额'] = `${resp.data.data.summary.amount}元`;
          reportTotal['订单数'] = `${resp.data.data.summary.orderSum}单`;
          reportTotal['销售量'] = `${resp.data.data.summary.productCount}根`;
          let pointTotal = resp.data.data.pointList.total;
          that.setData({
            reportTotal: reportTotal,
            statistics: statistics,
          })
          if ((that.data.pageSize * (pageIndex - 1)) >= pointTotal && pointTotal > 0) {
            this.setData({
              loadText: '已经到底了',
            })
            return
          }
          pointsData = pointsData.concat(resp.data.data.pointList.list);
          console.log('列表', pointsData);
          that.setData({
            pointsData: pointsData,
            pageIndex
          })
          if (that.data.pageSize * pageIndex >= pointTotal) {
            this.setData({
              loadText: '已经到底了',
            })
            return
          }
        })
        .catch(rej => {
          console.log('销量错误', rej);
        })
    } else {
      data = {
        searchDate,
        searchMonth,
        sortType: that.data.pointSort,
        pageNum: pageIndex,
        pageSize: that.data.pageSize,
        agencyId: that.data.agencyId,
        showSaleSum: true,
        showSaleTotal: true,
        regionId: that.data.regionId
      };
      mClient.get(api.PointSaleList, data)
        .then(resp => {
          console.log('单日/单月', resp);
          if (!resp.data.data) {
            that.setData({
              reportTotal: {
                '销售额': `0元`,
                '订单数': `0单`,
                '销售量': `0根`
              },
              cumulativeSales: {
                '累计销售额': `0元`,
                '累计销售量': `0根`,
              },
            })
            return
          }
          reportTotal['销售额'] = `${resp.data.data.summary.amount}元`;
          reportTotal['订单数'] = `${resp.data.data.summary.orderSum}单`;
          reportTotal['销售量'] = `${resp.data.data.summary.productCount}根`;
          cumulativeSales['累计销售额'] = `${resp.data.data.total.totalAmount}元`;
          cumulativeSales['累计销售量'] = `${resp.data.data.total.totalCount}根`;
          let pointTotal = resp.data.data.pointList.total;
          this.setData({
            reportTotal: reportTotal,
            cumulativeSales: cumulativeSales,
            pointTotal: pointTotal,
          });
          if ((that.data.pageSize * (pageIndex - 1)) >= pointTotal && pointTotal > 0) {
            this.setData({
              loadText: '已经到底了',
            })
            return
          }
          pointsData = pointsData.concat(resp.data.data.pointList.list);
          this.setData({
            pointsData: pointsData,
            pageIndex
          });
          if (that.data.pageSize * pageIndex >= pointTotal) {
            this.setData({
              loadText: '已经到底了',
            })
            return
          }
        })
        .catch(rej => {
          console.log('销量错误', rej);
        })
    }
  },

  // 半年自定义月报
  async monthlySalesVolume(startMonth, endMonth) {
    let reportTotal = that.data.reportTotal;
    if (that.data.isIds) {
      let data = {
        startMonth,
        endMonth,
        agencyId: that.data.agencyId,
        showSaleSum: true,
        showSaleTotal: true,
        regionId: that.data.regionId,
        sortType: that.data.pointSort
      };
      let result = await (mClient.get(api.AgencyRangeMonth, data));
      console.log('自定义月报', result);
      if (!result.data.data) {
        that.setData({
          reportTotal: {
            '销售额': `0元`,
            '订单数': `0单`,
            '销售量': `0根`
          }
        })
        return
      }
      reportTotal['销售额'] = `${result.data.data.summary.amount}元`;
      reportTotal['订单数'] = `${result.data.data.summary.orderSum}单`;
      reportTotal['销售量'] = `${result.data.data.summary.productCount}根`;
      that.setData({
        reportTotal: reportTotal,
        statistics: result.data.data.statistics
      })
      return
    }
    let data = {
      startMonth,
      endMonth,
      agencyId: that.data.agencyId,
      showSaleSum: true,
      showSaleTotal: true
    };
    let result = await (mClient.get(api.PointSaleMonth, data));
    console.log('自定义月报', result);
    if (!result.data.data) {
      that.setData({
        reportTotal: {
          '销售额': `0元`,
          '订单数': `0单`,
          '销售量': `0根`
        }
      })
      return
    }
    reportTotal['销售额'] = `${result.data.data.summary.amount}元`;
    reportTotal['订单数'] = `${result.data.data.summary.orderSum}单`;
    reportTotal['销售量'] = `${result.data.data.summary.productCount}根`;
    that.setData({
      reportTotal: reportTotal,
      statistics: result.data.data.statistics
    })
  },

  // 跳转日折线图
  bindReportDetaill: function (e) {
    let point = e.currentTarget.dataset.point;
    wx.navigateTo({
      url: '../report_details/report_details?pointid=' + point.pointId + "&pointName=" + point.pointName + '&agencyId=' + that.data.agencyId + '&date=' + that.data.startDate
    })
  },

  // 跳转明细
  bindDetail: function (e) {

  },

  // 点位销售统计列表排序
  bindPointSort: function (e) {
    let isSaleAmountSort = that.data.isSaleAmountSort;
    let isSaleCountSort = that.data.isSaleCountSort;
    let index = e.currentTarget.dataset.index;
    let dateRange = that.data.dateRange;
    let reportDetail = that.data.reportDetail;
    console.info('当前销售量id', index);
    if (index === 1) {
      reportDetail.titleUrls[2] = '../../../assets/img/arrow.png';
      if (isSaleAmountSort === false) {
        reportDetail.titleUrls[index] = '../../../assets/img/arrow-h.png';
        this.setData({
          isSaleAmountSort: true,
          pointSort: 2,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../../assets/img/arrow-l.png';
        this.setData({
          isSaleAmountSort: false,
          pointSort: 1,
          reportDetail: reportDetail
        })
      }
    } else if (index === 2) {
      reportDetail.titleUrls[1] = '../../../assets/img/arrow.png';
      if (isSaleCountSort === false) {
        reportDetail.titleUrls[index] = '../../../assets/img/arrow-h.png';
        this.setData({
          isSaleCountSort: true,
          pointSort: 4,
          reportDetail: reportDetail
        })
      } else {
        reportDetail.titleUrls[index] = '../../../assets/img/arrow-l.png';
        this.setData({
          isSaleCountSort: false,
          pointSort: 3,
          reportDetail: reportDetail
        })
      }
    } else {
      return;
    }
    let {
      startDate,
      endDate
    } = that.data;
    if (dateRange === 0 || dateRange === 1 || dateRange === 10 || dateRange === 11) {
      that.renderReport(that.data.dateRange, startDate, '');
    } else if (dateRange === 2) {
      that.renderReport(that.data.dateRange, startDate, endDate);
    } else if (dateRange === 3) {
      that.renderReport(that.data.dateRange, that.data.startCustomDate, that.data.endCustomDate);
    }
    if (that.data.isIds) {
      if (dateRange === 12) {
        that.monthlySalesVolume(that.data.dateRange, startDate, endDate);
      } else if (dateRange === 13) {
        that.monthlySalesVolume(that.data.dateRange, that.data.startCustomDate, that.data.endCustomDate);
      }
    }
  },

  bindLoading: function () {
    let that = this;
    let pointsData = that.data.pointsData;
    let pageIndex = that.data.pageIndex;
    let dateRange = that.data.dateRange;
    let pageSize = that.data.pageSize;
    let pointTotal = that.data.pointTotal;
    if ((pointTotal / pageSize) < pageIndex) {
      this.setData({
        loadText: '已经到底了',
      })
    }
    if (((pageIndex * pageSize) - pointTotal) > pageSize) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1000
      });

      this.setData({
        loadText: '已经到底了',
      })
      return;
    };
    let {
      startDate,
      endDate
    } = that.data;
    pageIndex = pageIndex + 1;
    if (dateRange === 0 || dateRange === 1 || dateRange === 10 || dateRange === 11) {
      that.renderReport(that.data.dateRange, startDate, '', pageIndex, pointsData);
    } else if (dateRange === 2) {
      that.renderReport(that.data.dateRange, startDate, endDate, pageIndex, pointsData);
    } else if (dateRange === 3) {
      that.renderReport(that.data.dateRange, that.data.startCustomDate, that.data.endCustomDate, pageIndex, pointsData);
    } else if (that.data.isIds) {
      if (dateRange === 12) {
        that.monthlySalesVolume(that.data.dateRange, startDate, endDate, pageIndex, pointsData);
      } else if (dateRange === 13) {
        that.monthlySalesVolume(that.data.dateRange, that.data.startCustomDate, that.data.endCustomDate, pageIndex, pointsData);
      }
    }
  },

  bindPickerChange: function (e) {
    that.setData({
      pageIndex: 1,
      cityIndex: e.detail.value,
      regionId: that.data.cityItem[e.detail.value].regionId
    })
    that.renderTransactionSummation();
  },

  onShow: function () {
    wx.hideHomeButton();
    app.globalData.childSelected = 0;
    that.initFn();
  },


  // 日期选择
  bindDateChange: function (e) {
    let startDate = e.detail.value;
    that.setData({
      startDate,
      pageNum: 1,
      pointDetaillyDate: startDate
    })
    if (that.data.dateRange == 0 || that.data.dateRange == 1) {
      that.renderReport(that.data.dateRange, e.detail.value);
    } else {
      that.renderReport(that.data.dateRange, '', e.detail.value);
    }
  },

  // 下一日
  upJump: function (event) {
    // let myDate = new Date().getTime();
    // console.log('13位时间戳', myDate);
    let converedDate = new Date(Date.parse(that.data.startDate));
    converedDate.setDate(converedDate.getDate() + 1);
    console.log(that.data.startDate)
    let startDate = `${(that.data.dateRange == 20||that.data.dateRange == 21||that.data.dateRange == 22||that.data.dateRange == 23)?Number(that.data.startDate)+1:((that.data.dateRange==0||that.data.dateRange==1)?util.customFormatTime(converedDate):util.addMonth(that.data.startDate,'add'))}`;
    console.log(startDate)
    that.setData({
      startDate,
      pageNum: 1,
      pointDetaillyDate: startDate
    })
    if (that.data.dateRange == 0 || that.data.dateRange == 1) {
      that.renderReport(that.data.dateRange, startDate);
    } else {
      that.renderReport(that.data.dateRange, '', startDate);
    }
  },
 
  ///上一日
  lowerJump: function (event) {
    let converedDate = new Date(Date.parse(that.data.startDate));
    converedDate.setDate(converedDate.getDate() - 1);
    let startDate = `${(that.data.dateRange == 20||that.data.dateRange == 21||that.data.dateRange == 22||that.data.dateRange == 23)?Number(that.data.startDate)-1:((that.data.dateRange==0||that.data.dateRange==1)?util.customFormatTime(converedDate):util.customFormatMonth(converedDate))}`
    that.setData({
      startDate,
      pageNum: 1,
      pointDetaillyDate: startDate
    })
    if (that.data.dateRange == 0 || that.data.dateRange == 1) {
      that.renderReport(that.data.dateRange, startDate);
    } else {
      that.renderReport(that.data.dateRange, '', startDate);
    }
  },

  // 自定义查询日期选择
  bindCustomDateChange(e) {
    let date = e.detail.value;
    let customindex = e.currentTarget.dataset.customindex;
    let {
      startCustomDate,
      endCustomDate
    } = that.data;
    if (customindex == 0) {
      startCustomDate = date
    } else {
      endCustomDate = date
    }
    if (new Date(Date.parse(startCustomDate)) > new Date(Date.parse(endCustomDate))) {
      let startDate = '';
      startDate = endCustomDate;
      endCustomDate = startCustomDate;
      startCustomDate = startDate
    };
    that.setData({
      startCustomDate,
      endCustomDate
    })
  },
  queryDateFn() {
    let reportDetail = that.data.reportDetail;
    if (that.data.dateRange == 3) {
      if (that.data.startCustomDate === that.data.endCustomDate) {
        if (!that.data.isIds) {
          reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
          reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', ''];
        }
        that.setData({
          isCustomDate: true
        })
      } else {
        reportDetail.titles = [`${!that.data.isIds?'点位':'合作商'}`, '销售额', '销售量', '明细'];
        reportDetail.titleUrls = ['', '../../../assets/img/arrow.png', '../../../assets/img/arrow.png', '']
        that.setData({
          isCustomDate: false
        })
      }
      that.renderReport(that.data.dateRange, that.data.startCustomDate, that.data.endCustomDate);
    } else {
      that.monthlySalesVolume(that.data.startCustomDate, that.data.endCustomDate);
    }
    that.setData({
      reportDetail,
      pointDetaillyDate: that.data.startCustomDate + '~' + that.data.endCustomDate
    })
  },
})