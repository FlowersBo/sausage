// pages/tableDetail/tableDetail.js
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
    graphGenres: [{
      title: '销售额'
    }, {
      title: '订单数'
    }, {
      title: '销售量'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let {
      pointId,
      pointStartDate,
      pointEndDate,
      startTime,
      agencyId
    } = options;
    console.log(agencyId);
    // let startDate = '',
    //   endDate = '',
    //   startMonth = '',
    //   endMonth = '';
    // if (startTime == 0 && pointStartDate) {
    //   startDate = pointStartDate;
    //   endDate = pointEndDate;
    // } else if (startTime == 1 && pointStartDate) {
    //   startMonth = pointStartDate;
    //   endMonth = pointEndDate;
    // }
    that.setData({
      pointDetaillyDate: pointStartDate ? `${pointStartDate}~${pointEndDate}` : '截止到昨日',
      startTime,
      agencyId
    })
    that.PTdetail(pointId, pointStartDate, pointEndDate);
    // that.PTdetail(pointId, startDate, endDate, startMonth, endMonth);
  },

  async PTdetail(pointId, startDate, endDate, startMonth, endMonth, agencyId) {
    let data = {
      pointId,
      startDate,
      endDate,
      startMonth,
      endMonth,
      agencyId: that.data.agencyId
    }
    let result = await (mClient.get(api.SinglePointSaleDetail, data));
    console.log('点位统计表', result);
    if (result.data.code == 200) {
      that.setData({
        statistics: result.data.data.saleList,
        address: result.data.data.address,
        pointName: result.data.data.pointName
      })
      if (that.data.startTime == 1) {
        that.renderChart(result.data.data.saleList);
      }
    } else {
      wx.showToast({
        title: result.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
  },

  //渲染echarts
  renderChart: function (statistics) {
    console.log('自定义月份统计', statistics);
    that.setData({
      isShowGraph: true
    });
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
      }
    }
    let ecDatas = [];
    ecDatas.push(amountchart, orderCountchar, productCountchart);
    console.log(ecDatas, ecxsign);
    that.setData({
      ecDatas,
      ecxsign
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
  // onShareAppMessage: function () {

  // }
})