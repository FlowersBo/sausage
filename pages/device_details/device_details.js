// pages/device_details/device_details.js
import * as api from '../../config/api';
import * as mClient from '../../utils/customClient';
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

    let that = this;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
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

    let data = {
      deviceid: deviceId,
      pageindex: pageIndex,
      pagesize: pageSize
    };

    mClient.get(api.AlarmList, data)
      .then(resp => {
        this.setData({
          deviceid: deviceId,
          pointname: pointname,
          pointaddress: pointaddress,
          alarmTotal: resp.data.data.total,
          alarmList: resp.data.data.alarmlist,
          pageIndex: pageIndex + 1,
        });

      }, );
  },

  onReachBottom: function () {
    let that = this;
    let deviceId = that.data.deviceid;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
    let alarmList = that.data.alarmList;
    let alarmTotal = that.data.alarmTotal;

    if ((pageIndex * pageSize) > alarmTotal) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1000
      });
      return;
    };

    pageIndex = pageIndex + 1;
    let data = {
      deviceid: deviceId,
      pageindex: pageIndex,
      pagesize: pageSize
    };
    wx.showLoading({
      title: '加载中',
    })

    mClient.get(api.AlarmList, data)
      .then(resp => {
        this.setData({
          alarmList: alarmList.concat(resp.data.data.alarmlist),
          pageIndex: pageIndex,
        });

        wx.hideLoading();
      }, );

  },

})