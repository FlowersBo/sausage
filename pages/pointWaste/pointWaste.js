// pages/pointWaste/pointWaste.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as echarts from '../../ec-canvas/echarts';
let that;

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
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointStartDate: '',
    pointEndDate: '',
    ec: { //ec
      onInit: initChart
    },
    ecDatas: [],
    ecxsign: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options);
    let {
      pointId,
      startDate,
      endDate
    } = options;
    that.wasteAnalyseFn(pointId, startDate, endDate);
  },

  async wasteAnalyseFn(pointId, startDate, endDate) {
    let data = {
      pointId,
      startDate,
      endDate
    }
    let result = await (mClient.get(api.WasteAnalyse, data));
    console.log('点位饼图', result);
    if (result.data.code == 200) {
      that.setData({
        waste: result.data.data,
        address: result.data.data.address,
        pointName:  result.data.data.pointName,
      })
    } else {
      wx.showToast({
        title: result.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
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