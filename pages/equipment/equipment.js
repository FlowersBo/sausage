// pages/equipment/equipment.js
let that;
import * as api from '../../config/api';
import {
  OrderList
} from '../../config/api';
import * as mClient from '../../utils/customClient';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    loadText: "点击加载..",
    isLoad: 1,
    pageIndex: 1,
    pageSize: 6,
    devicesData: [],
    serchContent: '',
    deviceTotal: 0,
  },

  onLoad: function () {
    that = this;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
    let data = {
      deviceno: '',
      pageindex: pageIndex,
      pagesize: pageSize
    };

    mClient.get(api.DeviceList)
      .then(resp => {
        let devicesInfo = resp.data.data.data;
        devicesInfo = this.addDevicesObjectProperty(devicesInfo);
        let deviceTotal = resp.data.data.total;
        if ((pageIndex * pageSize) > deviceTotal) {
          this.setData({
            loadText: '已经到底了',
            isLoad: 0,
          });
        };
        this.setData({
          devicesData: devicesInfo,
          pageIndex: pageIndex + 1,
          deviceTotal: resp.data.data.total
        });
      });
  },

  setLoading: function () {
    let that = this;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
    let deviceTotal = that.data.deviceTotal;
    let devicesDataCurrent = that.data.devicesData;
    let isLoad = that.data.isLoad;

    if (isLoad === 0) {
      wx.showToast({
        title: '已加载完成',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    let data = {
      deviceno: '',
      pageindex: pageIndex,
      pagesize: pageSize
    };

    mClient.get(api.DeviceList)
      .then(resp => {
        let devicesInfo = resp.data.data.data;
        devicesInfo = this.addDevicesObjectProperty(devicesInfo);
        pageIndex = pageIndex + 1;

        this.setData({
          devicesData: devicesDataCurrent.concat(devicesInfo),
          pageIndex: pageIndex,
        });

        if ((pageIndex * pageSize) > deviceTotal) {
          this.setData({
            loadText: '已经到底了',
            isLoad: 0,
          });
        };
      });
  },

  bindDeviceDetaill: function (e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../device_details/device_details?deviceid=' + item.deviceid + "&pointname=" + item.pointname + "&pointaddress=" +
        item.pointaddress + "&isbad=" + item.isbad + "&isonline=" + item.isonline + "&isoutofstock=" + item.isoutofstock
    })
  },

  bindPointSerch: function (e) {
    let that = this;
    let pageSize = that.data.pageSize;
    let pageIndex = 1;
    let serchContent = e.detail.value;
    let data = {
      deviceno: serchContent,
      pageindex: pageIndex,
      pagesize: pageSize
    };

    mClient.get(api.DeviceList, data)
      .then(resp => {
        if (resp.data.code == 200) {
          let devicesInfo = resp.data.data.list;
          devicesInfo = this.addDevicesObjectProperty(devicesInfo);
          this.setData({
            devicesData: devicesInfo,
          });
        } else {
          wx.showToast({
            title: '未查找到相关信息',
            icon: 'none',
            duration: 1000
          });
          this.setData({
            devicesData: [],
            serchContent: serchContent
          });
        }
      });
  },

  addDevicesObjectProperty: function (devicesInfo = []) {
    for (const key in devicesInfo) {
      const isbad = devicesInfo[key].isbad;
      const isoutofstock = devicesInfo[key].isoutofstock;
      const isonline = devicesInfo[key].isonline;

      if (isonline === '0') {
        devicesInfo[key].signalIconSrc = '../../assets/img/xinhao-v.png';
      } else {
        devicesInfo[key].signalIconSrc = '../../assets/img/xinhao.png'
      }

      if (isbad === '1') {
        devicesInfo[key].deviceStatusIconSrc = '../../assets/img/weixiu.png';
      } else if (isoutofstock === '1') {
        devicesInfo[key].deviceStatusIconSrc = '../../assets/img/buycar.png';
      } else {
        devicesInfo[key].deviceStatusIconSrc = '../../assets/img/zaixian.png'
      }
    }
    return devicesInfo;
  },

  // 刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    console.log('刷新');
    let pageSize = that.data.pageSize,
      pageIndex = 1;
    let data = {
      deviceno: '',
      pageindex: pageIndex,
      pagesize: pageSize
    };

    mClient.get(api.DeviceList)
      .then(resp => {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        let devicesInfo = resp.data.data.data;
        devicesInfo = this.addDevicesObjectProperty(devicesInfo);
        let deviceTotal = resp.data.data.total;
        if ((pageIndex * pageSize) > deviceTotal) {
          this.setData({
            loadText: '已经到底了',
            isLoad: 0,
          });
        };
        this.setData({
          devicesData: devicesInfo,
          deviceTotal: resp.data.data.total,
          serchContent: ''
        });
      });
  },
})