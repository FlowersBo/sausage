// pages/device_details/device_details.js
import * as api from '../../config/api';
import * as mClient from '../../utils/customClient';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceid: 0,
    pointname: '',
    pointaddress: '',
    isbad: 0,
    isonline: 0,
    isoutofstock: 0,
    signalIconSrc: '../../assets/img/xinhao.png',
    deviceStatusIconSrc: '../../assets/img/zaixian.png',
    pageIndex: 1,
    pageSize: 5,
    deviceInfo: {},
    alarmList: {},
    alarmTotal: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let isbad = options.isbad;
    let isonline = options.isonline;
    let isoutofstock = options.isoutofstock;
    let deviceId = options.deviceid;
    let pointname = options.pointname;
    let pointaddress = options.pointaddress;

    if (isonline === '0') {
      this.setData({
        signalIconSrc: '../../assets/img/xinhao-v.png'
      })
    } else {
      this.setData({
        signalIconSrc: '../../assets/img/xinhao.png'
      })
    }

    if (isbad === '1') {
      this.setData({
        deviceStatusIconSrc: '../../assets/img/weixiu.png'
      })
    } else if (isoutofstock === '1') {
      this.setData({
        deviceStatusIconSrc: '../../assets/img/buycar.png'
      })
    } else {
      this.setData({
        deviceStatusIconSrc: '../../assets/img/zaixian.png'
      })
    }
    that.setData({
      deviceId: deviceId,
      pointname: pointname,
      pointaddress: pointaddress
    })
    that.alarmListFn();
  },

  alarmListFn: () => {
    let {pageIndex,pageSize,deviceId} = that.data;
    let data = {
      deviceid: deviceId,
      pageindex:pageIndex,
      pagesize: pageSize
    };

    mClient.get(api.AlarmList, data)
      .then(resp => {
        that.setData({
          alarmTotal: resp.data.data.total,
          alarmList: resp.data.data.alarmlist,
          pageIndex: pageIndex + 1,
        });
      }, );
  },

  // 刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    that.alarmListFn();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    console.log('onBottom');
    let that = this;
    let deviceId = that.data.deviceid;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
    let data = {
      deviceid: deviceId,
      pageindex: pageIndex,
      pagesize: pageSize
    };
    mClient.get(api.AlarmList, data)
      .then(resp => {
        let alarmTotal = resp.data.data.total;
        this.setData({
          alarmList: that.data.alarmList.concat(resp.data.data.alarmlist),
          pageIndex: pageIndex + 1,
          alarmTotal: alarmTotal
        });
      });
  },
})