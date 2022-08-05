// pages/pointWaste/pointWaste.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as echarts from '../../ec-canvas/echarts';
let that;

function initChart(chart, dataItem) {
  var option = {
    backgroundColor: "#fff",
    color: ['#29AAE3', '#C33531', '#EFE42A', '#64BD3D', '#B74AE5', '#EE9201', '#0AAF9F', '#E89589', '#16A085'],
    title: {
      text: '废弃原因分布',
      left: 'center',
      top: '2%',
      color: '#F75910',
      textStyle: {
        fontSize: '16',
        fontWeight: 'bold',
      }
    },
    legend: { //图例
      data: dataItem.name,
      left: 'center',
      bottom: '0',
      z: 100,
      selectedMode: true, //是否可选显示
      orient: 'horizontal',
      textStyle: {
        fontStyle: 'oblique'
      }
    },
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: "废弃量(根) \n{b} : {c} ({d}%)",
      // formatter: "{b} : {c} ({d}%)", //{a} <br/>
      // formatter: function (params) {
      //   console.log(params)
      //   var result = '';
      //   params.forEach(function (item) {
      //     result += item.marker + " " + item.seriesName + " : " + item.value + "</br>";
      //   });
      //   return result;
      // },
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        }
      }
    },
    calculable: true,
    series: [{
      label: {
        normal: {
          fontSize: 12 //图显示字体大小
        }
      },
      type: 'pie',
      minShowLabelAngle: '0',
      // roseType: 'area',//南丁格尔图
      // selectedMode: 'single',
      // selectedOffset: 5, //扇形偏移量
      data: dataItem,
      radius: '60%',
      // radius: ['40%', '60%'],//设置环状图
      center: ['50%', '44%'],
    }]
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
    ec: {
      lazyLoad: true //初始化加载
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options);
    let {
      pointId,
      pointStartDate,
      pointEndDate,
      selectedChild
    } = options;
    that.wasteAnalyseFn(pointId, pointStartDate, pointEndDate, selectedChild);
  },

  async wasteAnalyseFn(pointId, startDate, endDate, selectedChild) {
    let data = {
      pointId,
      searchDate: `${selectedChild==0?startDate:''}`,
      // endDate: `${selectedChild==0?endDate:''}`,
      searchMonth: `${selectedChild==0?'':endDate}`,
      // endMonth: `${selectedChild==0?'':endDate}`,
    }
    let result = await (mClient.get(api.WasteAnalyse, data));
    console.log('点位饼图', result);
    if (result.data.code == 200) {
      this.oneComponent = this.selectComponent('#mychart-dom-bar');
      this.oneComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        let dayDateWrap = [{
            name: `手工上报废弃${result.data.data.wasteOther!='0'?'('+result.data.data.wasteOther+')':''}`,
            value: result.data.data.waste1
          }, {
            name: '退款废弃',
            value: result.data.data.waste2
          },
          // {
          //   name: '营业时间结束废弃',
          //   value: result.data.data.waste3
          // }, {
          //   name: '退货废弃',
          //   value: result.data.data.waste4
          // }, {
          //   name: '人工报损',
          //   value: result.data.data.waste5
          // }, {
          //   name: '预订超时未取废弃',
          //   value: result.data.data.waste6
          // }  
        ];
        let dataItem = [];
        for (const key in dayDateWrap) {
          if (Object.hasOwnProperty.call(dayDateWrap, key)) {
            const element = dayDateWrap[key];
            if (String(element.value) != 0) {
              // dayDateWrap.splice(key, 1);
              dataItem.push(dayDateWrap[key]);
            }
          }
        }
        console.log(dataItem);
        initChart(chart, dataItem);
        return chart;
      });

      that.setData({
        waste: result.data.data,
        address: result.data.data.address,
        pointName: result.data.data.pointName,
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
  // onShareAppMessage: function () {

  // }
})