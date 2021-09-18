import * as echarts from '../../ec-canvas/echarts';
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
let that;

function getLineOption(chart, leftData, rightData, dateTitle, pointsTimeFrame) {
  var option = {
    title: {
      text: `${dateTitle}销售额(订单量)`,
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#333'
      }
    },
    color: ["#BB0012", "#0042BB"],
    legend: {
      data: ['销售额(元)', '订单量(根)'],
      top: 22,
      left: 'center',
      backgroundColor: '#fff',
      z: 100,
      selectedMode: true,
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '1%',
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      name: '时间',
      type: 'category',
      left: '2%',
      top: '5%',
      boundaryGap: false,
      data: pointsTimeFrame,
      // show: false //是否显示X轴
    },
    yAxis: [{
        name: '销售额(元)',
        nameTextStyle: {
          color: '#BB0012',
          fontStyle: 'italic',
          fontSize: '10',
          verticalAlign: 'middle',
        },
        type: 'value',
        data: leftData[0],
        splitLine: {
          show: false //Y轴分割线
        }
      },
      {
        name: '订单量(根)',
        nameTextStyle: {
          color: '#0042BB',
          fontStyle: 'italic',
          fontSize: '10',
          verticalAlign: 'middle',
        },
        minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数
        type: 'value',
        data: rightData[0],
        splitLine: {
          show: false
        }
      }
    ],
    series: [{
        name: '销售额(元)',
        smooth: false,
        type: 'line',
        data: leftData[1],
        color: '#BB0012',
      },
      {
        name: '订单量(根)',
        symbolSize: 4,
        color: '#0042BB',
        yAxisIndex: 1,
        data: rightData[1],
        type: 'line',
      }
    ]
  };
  chart.setOption(option);
  return chart;
};

Page({
  data: {
    date: util.customFormatTime(new Date()),
    ec: {
      lazyLoad: true
    },
    pointsData: [],
    pointsTimeFrame: [],
    pointid: 0,
    pointName: '',
  },

  onLoad: function (options) {
    that = this;
    let pointid = options.pointid;
    let pointName = options.pointName;
    that.setData({
      pointid,
      pointName
    })
    that.PointDataByHourList();
  },

  PointDataByHourList() {
    let {
      date,
      pointid
    } = that.data;
    let data = {
      date,
      pointid
    };
    mClient.get(api.PointDataByHour, data)
      .then(resp => {
        let pointsTimeFrame = that.convertObjectToPointsTimeFrame(resp.data.data.list),
          pointsData = that.convertObjectToPointsData(resp.data.data.list); //横纵坐标取余
        that.setData({
          pointsTimeFrame: that.convertObjectToPointsTimeFrame(resp.data.data.list),
          pointsData: that.convertObjectToPointsData(resp.data.data.list)
        });
        that.initGraph(resp.data.data.list);
        // that.renderChart();
      });
  },

  bindDateChange: function (e) {
    let that = this;
    let date = e.detail.value;
    let pointid = that.data.pointid;
    let currentDate = util.customFormatTime(date);
    let data = {
      date: currentDate,
      pointid: pointid
    };
    mClient.get(api.PointDataByHour, data)
      .then(resp => {
        this.setData({
          date: currentDate,
          pointsTimeFrame: this.convertObjectToPointsTimeFrame(resp.data.data.list),
          pointsData: this.convertObjectToPointsData(resp.data.data.list),
        });
        that.initGraph(resp.data.data.list);
        // this.renderChart();
      });
  },

  upJump: function (event) {
    let that = this;
    let date = that.data.date;
    let pointid = that.data.pointid;
    console.log(date);
    let converedDate = new Date(Date.parse(date));
    console.log('修改时间', converedDate);
    let myDate = new Date().getTime();
    console.log('13位时间戳', myDate);
    converedDate.setDate(converedDate.getDate() + 1);
    let currentDate = util.customFormatTime(converedDate);
    let data = {
      date: currentDate,
      pointid: pointid
    };

    mClient.get(api.PointDataByHour, data)
      .then(resp => {
        this.setData({
          date: currentDate,
          pointsTimeFrame: this.convertObjectToPointsTimeFrame(resp.data.data.list),
          pointsData: this.convertObjectToPointsData(resp.data.data.list),
        });
        that.initGraph(resp.data.data.list);
        // this.renderChart();
      });
  },

  lowerJump: function (event) {
    let that = this;
    let date = that.data.date;
    let pointid = that.data.pointid;
    let converedDate = new Date(Date.parse(date));
    converedDate.setDate(converedDate.getDate() - 1);
    let currentDate = util.customFormatTime(converedDate);
    let data = {
      date: currentDate
    };

    mClient.get(api.PointDataByHour, data)
      .then(resp => {
        this.setData({
          date: currentDate,
          pointid: pointid,
          pointsTimeFrame: this.convertObjectToPointsTimeFrame(resp.data.data.list),
          pointsData: this.convertObjectToPointsData(resp.data.data.list),
        });
        that.initGraph(resp.data.data.list);
        // this.renderChart();
      });
  },

  convertObjectToPointsTimeFrame: function (obj = []) {
    let dataArray = [];
    for (let item in obj) {
      dataArray.push(obj[item].hour);
    }
    return dataArray;
  },

  convertObjectToPointsData: function (obj = []) {
    let dataArray = [];
    for (let item in obj) {
      dataArray.push(obj[item].saleamount);
    }
    return dataArray;
  },

  // renderChart: function () {
  //   this.ecComponent = this.selectComponent('#hour-chart');
  //   this.ecComponent.init((canvas, width, height) => {
  //     // 获取组件的 canvas、width、height 后的回调函数
  //     // 在这里初始化图表
  //     const chart = echarts.init(canvas, null, {
  //       width: width,
  //       height: height
  //     });
  //     canvas.setChart(chart);
  //     chart.setOption(this.setHourChartOption());
  //     // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
  //     this.chart = chart;

  //     // 注意这里一定要返回 chart 实例，否则会影响事件处理等
  //     return chart;
  //   });
  // },


  // 双折线图
  initGraph: function (lastSevenDaysDataAgency) {
    console.log('折线图数据', lastSevenDaysDataAgency);
    let pointsTimeFrame = that.data.pointsTimeFrame; //X轴
    // if (lastSevenDaysDataAgency.length > 0) {
    //   that.setData({
    //     isShow: true
    //   })
    // } else {
    //   that.setData({
    //     isShow: false
    //   })
    //   return
    // }
    let finishDatesWrap = [],
      sumPriceWrap = [],
      orderCountWrap = [];
    for (const key in lastSevenDaysDataAgency) {
      //   lastSevenDaysDataAgency[key].finishDates = util.customFormatOnlyMonthDay(lastSevenDaysDataAgency[key].finishDates);
      //   finishDatesWrap.push(lastSevenDaysDataAgency[key].finishDates);
      sumPriceWrap.push(lastSevenDaysDataAgency[key].saleamount);
      orderCountWrap.push(lastSevenDaysDataAgency[key].saleSum);
    }
    let leftData = [],
      rightData = [];
    leftData.push(finishDatesWrap, sumPriceWrap);
    rightData.push(finishDatesWrap, orderCountWrap);
    console.log('销售额', leftData);
    console.log('订单量', rightData);
    if (lastSevenDaysDataAgency) {
      this.oneComponent = this.selectComponent('#mychart-dom-bar');
    }
    this.oneComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      getLineOption(chart, leftData, rightData, '单日', pointsTimeFrame);
      return chart;
    });
  },







  setHourChartOption: function () {
    let that = this;
    let pointsTimeFrame = this.converArrayInteval(that.data.pointsTimeFrame);
    let pointsData = this.converArrayInteval(that.data.pointsData);
    return {
      xAxis: {
        name: '时间',
        nameLocation: 'end',
        nameTextStyle: {
          color: '#BB0012',
          fontStyle: 'italic',
          fontSize: '8',
          verticalAlign: 'middle',
          align: 'left'
        },
        boundaryGap: false,
        type: 'category',
        data: pointsTimeFrame
      },
      yAxis: {
        name: '销售额(元)',
        nameLocation: 'end',
        nameTextStyle: {
          color: '#BB0012',
          fontStyle: 'italic',
          fontSize: '8',
          verticalAlign: 'middle',
          align: 'left'
        },
        type: 'value'
      },
      grid: {
        top: 30,
        left: 30,
        height: 100
      },
      series: [{
        data: pointsData,
        type: 'line'
      }]
    }
  },

  converArrayInteval: function (array = []) {
    let newArray = [];
    newArray.push(0);
    for (let index = 0; index < array.length; index++) {
      let inteval = (index - 3) % 1;
      // let inteval = index;
      if (inteval === 0) {
        newArray.push(array[index]);
      }
    }
    console.log(newArray)
    return newArray;
  },

})