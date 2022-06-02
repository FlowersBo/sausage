import * as echarts from '../../ec-canvas/echarts';
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';

import todo from '../../component/v2/plugins/todo'
import selectable from '../../component/v2/plugins/selectable'
import solarLunar from '../../component/v2/plugins/solarLunar/index'
import timeRange from '../../component/v2/plugins/time-range'
import week from '../../component/v2/plugins/week'
import holidays from '../../component/v2/plugins/holidays/index'
import plugin from '../../component/v2/plugins/index'

plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
  .use(week)
  .use(timeRange)
  .use(holidays)

let that;
let app = getApp();
import {
  OrderList
} from '../../config/api';
// let isReportGenre = "天数";

function initChart(canvas, width, height, xsign, xdata, graphGenres) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    color: ["#3398DB", "#d9a8f2", "#b31fff", "#5c1cff"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    xAxis: {
      // name: isReportGenre,
      // nameLocation: 'end',	
      // nameTextStyle: {
      // 	color: '#BB0012',
      // 	fontStyle: 'italic',
      // 	fontSize: '8',
      // 	verticalAlign: 'middle',
      // 	align: 'left'
      // },
      // boundaryGap: false,
      type: 'category',
      data: xsign
    },
    yAxis: {
      // name: '销售额(元)',
      type: 'value'
    },
    nameTextStyle: {
      color: '#BB0012',
      fontStyle: 'italic',
      fontSize: '8',
      verticalAlign: 'middle',
      align: 'left'
    },
    grid: {
      top: 30,
      left: 50,
      height: 100
    },
    series: [{
      // name: '金额',
      barWidth: "50%",
      data: xdata,
      type: 'bar',
      itemStyle: {
        normal: {
          // 随机显示
          //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
          // 定制显示（按顺序）
          color: function (params) {
            var colorList = ['#C33531', '#EFE42A', '#64BD3D', '#EE9201', '#29AAE3', '#B74AE5', '#0AAF9F', '#E89589', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
            return colorList[params.dataIndex]
          }
        }
      }
    }, ]
  };
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    loadText: '点击加载更多',
    dateRangeindex: 0,
    info: {
      reportGenres: ['销售日报', '销售月报'],
      dateRange: [
        ['今日', '昨日', '近7日', '自定义'],
        ['本月', '上月', '半年', '自定义'],
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
      titleUrls: ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', ''],
    },
    reportGenre: 0,
    dateRange: 0,

    saleroomSort: 0,
    salesVolumeSort: 0,

    isShowGraph: false,
    graphGenre: 0,

    chartsTitleGenre: 0,
    chartsData: {},
    charts: [],

    pageIndex: 1,
    pageSize: 20,

    pointsData: [],

    serchContent: '',
    url: "../../assets/img/arrow.png",

    ec: { //ec
      onInit: initChart
    },
    ecDatas: [],
    ecxsign: [
      // [1, 2, 3, 4, 5, 6, 7],
      // [1, 2, 3],
      // [1, 2, 3, 4, 5, 6],
      // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    ],
    graphGenres: [{
      title: '销售额'
    }, {
      title: '订单数'
    }, {
      title: '销售量'
    }, ],

    pointDetaillyDate: '', //计算的时间段
    isDateRangeindex: true, //显示表格
    // 排序
    isSaleAmountSort: false,
    isSaleCountSort: false,
    pointSort: 1, //默认点位表排序按销售额升序
    pointTotal: 0,

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

    // 月份
    isPickerShow: false,
    isPickerRender: false,
    monthStartTime: "起始月份",
    monthEndTime: "结束月份",
    pickerConfig: {
      endDate: true,
      column: "second",
      dateLimit: true,
      initStartTime: "2022-01-01",
      yearStart: "2021",
      // initEndTime: "2021-12",
      limitStartTime: "2022-01-01",
      // limitEndTime: "2021-12"
    },
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
    agencyId: '',
    isIds: false,
    fields: 'day'
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
    // console.log('afterTapDate', e.detail);
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
  // 	this.setData({
  // 		dateTime: e.detail
  // 	})
  // 	this.renderTransactionSummation(that.data.dateRange);
  // },

  onLoad: function (options) {
    that = this;
    that.initFn();
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
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
      that.setData({
        reportDetail
      })
    }
    wx.setStorageSync('roles', result.data.data.roles);
    that.renderTransactionSummation(that.data.dateRange);
  },

  // 自定义月报&&月份区间选择
  pickerShow: function () {
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
  setPickerTime: function (val) {
    console.log('月份时间段', val);
    let monthlyDate = val.detail;
    that.setData({
      monthStartTime: monthlyDate.startTime,
      monthEndTime: monthlyDate.endTime,
      pointDetaillyDate: `${monthlyDate.startTime}~${monthlyDate.endTime}`
    });
    if (that.data.isIds) {
      that.renderReport(that.data.dateRange, monthlyDate.startTime, monthlyDate.endTime);
      return;
    }
    that.monthlySalesVolume(monthlyDate.startTime, monthlyDate.endTime);
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
    // if (dateRange === 13 && index === 1) {
    // 	dateRange = 12;
    // 	dateRangeindex = 2;
    // 	that.setData({ //设置第四个变第三个
    // 		dateRangeindex,
    // 		selectIndex: index
    // 	})
    // }
    // else if (that.data.dateRangeindex_off === 3) {//设置当下边为3切换日月报任为3的逻辑
    // 	console.log('原来的', that.data.dateRangeindex_off);
    // 	dateRange = 3;
    // 	that.setData({
    // 		dateRange,
    // 		dateRangeindex: that.data.dateRangeindex_off
    // 	})
    // };
    let reportDetail = that.data.reportDetail;
    if (that.data.isIds) {
      reportDetail.titles = ['合作商', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
    } else if (dateRange === 0, dateRange === 1, dateRange === 2) {
      reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
    } else if (dateRange === 3) {
      reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
    } else {
      reportDetail.titles = ['点位', '销售额', '销售量'];
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png']
    };
    this.setData({
      reportGenre: index,
      dateRange: dateRange,
      reportDetail: reportDetail,
    });
    that.renderTransactionSummation();


    //  else {
    //   that.setData({
    //     isShowGraph: false //现实图表
    //   })
    // }
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
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', '']
    } else if (dateRange === 0) {
      reportDetail.titles = ['点位', '销售额', '销售量', '时段'];
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', ''];
    } else if (dateRange === 1) {
      reportDetail.titles = ['点位', '销售额', '销售量', '明细'];
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png', ''];
      that.setData({
        isDateRangeindex: true
      })
    } else {
      that.setData({
        isDateRangeindex: true
      })
      reportDetail.titles = ['点位', '销售额', '销售量'];
      reportDetail.titleUrls = ['', '../../assets/img/arrow.png', '../../assets/img/arrow.png']
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
      // that.fadeIn();

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
      pointReportDate.setMonth(pointReportDate.getMonth() - 6);
      startDate = util.customFormatMonth(pointReportDate);
      pointReportDate.setMonth(pointReportDate.getMonth() + 5);
      endDate = util.customFormatMonth(pointReportDate);
      console.log(startDate);
      pointDetaillyDate = startDate + '~' + endDate;
      that.monthlySalesVolume(startDate, endDate);
    } else if (dateRange == 13) {
      let startCustomDate,
        endCustomDate;
      pointReportDate.setDate(1);
      pointReportDate.setMonth(pointReportDate.getMonth() - 3);
      startCustomDate = util.customFormatMonth(pointReportDate);
      pointReportDate.setMonth(pointReportDate.getMonth() + 2);
      endCustomDate = util.customFormatMonth(pointReportDate);
      that.setData({
        startCustomDate,
        endCustomDate,
        pointDetaillyDate: startCustomDate + '~' + endCustomDate
      })
      that.monthlySalesVolume(startCustomDate, endCustomDate);

      // that.pickerShow();
    }
    that.setData({
      pointDetaillyDate,
      startDate,
      endDate
    })


    // if (that.data.isIds) {
    //   that.renderReport(that.data.dateRange, pointDetaillyDate, pointDetaillyDate);
    //   return
    // }
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
            startDat: searchDate,
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
        startDat: searchDate,
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
    that.renderChart(result.data.data.statistics); //echarts
  },

  //渲染echarts
  renderChart: function (statistics) {
    that.setData({
      isShowGraph: false
    });
    console.log('自定义月份统计', statistics);
    let monthList = [];
    for (const key in statistics) {
      if (Object.hasOwnProperty.call(statistics, key)) {
        const element = statistics[key];
        if (element.saleAmount) {
          monthList.push(element);
        }
      }
    }
    console.log('有数据的', monthList);
    let amountchartObject = [];
    let orderCountchartObject = [];
    let productCountchartObject = [];
    let ecxsign = [],
      amountchart = [],
      orderCountchar = [],
      productCountchart = [];
    for (const key in monthList) {
      if (Object.hasOwnProperty.call(monthList, key)) {
        const element = monthList[key];
        ecxsign.push(element.date);
        amountchart.push(element.saleAmount);
        orderCountchar.push(element.orderSum);
        productCountchart.push(element.productCount);
        // amountchart.date = element.date;
        // amountchart.saleAmount = element.saleAmount;
        // amountchartObject.push(amountchart);

        // orderCountchar.date = element.date;
        // orderCountchar.orderSum = element.orderSum;
        // orderCountchartObject.push(orderCountchar);

        // productCountchart.date = element.date;
        // productCountchart.orderSum = element.productCount;
        // productCountchartObject.push(productCountchart);
      }
    }
    // console.log('时间&金额', amountchartObject);
    // console.log('时间&订单', orderCountchartObject);
    // console.log('时间&销量', productCountchartObject);
    let ecDatas = [];
    ecDatas.push(amountchart, orderCountchar, productCountchart);
    // if (index == 0) {
    // 	isReportGenre = '天数'
    // } else {
    // 	isReportGenre = '月份'
    // }
    that.setData({
      ecDatas,
      ecxsign,
      isShowGraph: true
    });
  },

  // 跳转日折线图
  bindReportDetaill: function (e) {
    let point = e.currentTarget.dataset.point;
    wx.navigateTo({
      url: '../report_details/report_details?pointid=' + point.pointId + "&pointName=" + point.pointName + '&agencyId=' + that.data.agencyId
    })
  },

  // 跳转明细
  bindDetail: function (e) {
    let point = e.currentTarget.dataset.point,
    dateRange = that.data.dateRange,
      {
        startDate,
        endDate,
        startCustomDate,
        endCustomDate
      } = that.data;
    console.log('跳转明细', point);
    if (point.agencyId) {
      console.log(point);
      wx.navigateTo({
        url: '../reportForms/reportForms?agencyId=' + point.agencyId + "&agencyName=" + point.agencyName + '&reportGenre=' + that.data.dateRange
      })
    } else {
      wx.navigateTo({
        url: '../tableDetail/tableDetail?pointId=' + point.pointId + "&pointName=" + point.pointName + '&agencyId=' + that.data.agencyId +
          "&pointStartDate=" + `${dateRange === 3?startCustomDate:startDate}` + "&pointEndDate=" + `${dateRange === 3?endCustomDate:endDate}` + "&monthStart=" + `${(dateRange === 10||dateRange === 11)?'1':''}`
      })
    }
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
    // else {
    //   that.renderReport(that.data.dateRange, that.data.monthStartTime, that.data.monthEndTime);
    // }
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
    // else {
    //   that.renderReport(that.data.dateRange, that.data.monthStartTime, that.data.monthEndTime, pageIndex, pointsData);
    // }
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    that.cityFn();
  },

  // 城市选择
  async cityFn() {
    let result = await (mClient.get(api.SelectCityItem));
    console.log('城市列表', result.data.data)
    let cityItem = result.data.data;
    let item = {
      regionId: '',
      regionName: '全部'
    };

    function prepend(arr, item) {
      var newArr = arr.slice(0);
      newArr.unshift(item); //newArr.splice(0,0,item);
      return newArr;
    }
    that.setData({
      cityItem: prepend(cityItem, item)
    })
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
    let startDate = `${(that.data.dateRange==0||that.data.dateRange==1)?util.customFormatTime(converedDate):util.addMonth(that.data.startDate,'add')}`;
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
    let startDate = `${(that.data.dateRange==0||that.data.dateRange==1)?util.customFormatTime(converedDate):util.customFormatMonth(converedDate)}`
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
    if (that.data.dateRange == 3) {
      that.renderReport(that.data.dateRange, that.data.startCustomDate, that.data.endCustomDate);
    } else {
      that.monthlySalesVolume(that.data.startCustomDate, that.data.endCustomDate);
    }
    that.setData({
      pointDetaillyDate: that.data.startCustomDate + '~' + that.data.endCustomDate
    })
  },

  // 以点位名称搜索
  // bindPointSerch: function (e) {
  // 	let that = this;
  // 	let dateRange = that.data.dateRange;
  // 	let serchContent = e.detail.value;

  // 	this.renderReport(dateRange, serchContent);
  // },
  // bindSerchContentInput: function (e) {
  // 	this.setData({
  // 		serchContent: e.detail.value
  // 	})
  // },
})