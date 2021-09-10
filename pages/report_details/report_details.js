import * as echarts from '../../ec-canvas/echarts';
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
import {
  OrderDetail
} from '../../config/api';
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
    console.log(options);
    let pointid = options.pointid;
    let pointName = options.pointName;
    let that = this;
    let date = that.data.date;
    let ec = that.data.ec;
    let data = {
      date: date,
      pointid: pointid
    };

    mClient.get(api.PointDataByHour, data)
      .then(resp => {
        this.setData({
          date: date,
          pointid: pointid,
          pointName: pointName,
          pointsTimeFrame: this.convertObjectToPointsTimeFrame(resp.data.data.list),
          pointsData: this.convertObjectToPointsData(resp.data.data.list),
        });

        this.renderChart();
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

        this.renderChart();
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
        this.renderChart();
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

        this.renderChart();
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

  renderChart: function () {
    this.ecComponent = this.selectComponent('#hour-chart');
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(this.setHourChartOption());
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  setHourChartOption: function () {
    let that = this;
    let pointsTimeFrame = this.converArrayInteval(that.data.pointsTimeFrame);
    let pointsData = this.converArrayInteval(that.data.pointsData);
    return {
      xAxis: {
        name: '日期',
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
      let inteval = (index - 3) % 4;
      if (inteval === 0) {
        newArray.push(array[index]);
      }
    }
    console.log(newArray)
    return newArray;
  },

})