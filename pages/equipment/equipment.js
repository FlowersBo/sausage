// pages/equipment/equipment.js
let that;
import * as api from '../../config/api';
import * as mClient from '../../utils/customClient';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderGenres: ['全部', '在线', '离线'],
    selected: 0,
    isLoad: 1,
    searchStr: '',
    online: '',
    devicesData: [],
    deviceTotal: 0,
    navAfter: [],
  },

  bindDeviceGenre: function (e) {
    let index = e.currentTarget.dataset.index;
    that.setData({
      searchStr: '',
    })
    if (index == 0) {
      this.setData({
        online: '',
        selected: 0
      })
    } else if (index == 1) {
      this.setData({
        online: 1,
        selected: 1
      })
    } else if (index == 2) {
      this.setData({
        online: 0,
        selected: 2
      })
    }
    that.deviceList();
  },

  async deviceList() {
    let data = {
      searchStr: that.data.searchStr,
      online: that.data.online
    };
    let result = await (mClient.get(api.DeviceList, data));
    console.log('设备列表', result);
    if (result.data.code == 200) {
      let devicesInfo = result.data.data.list;
      let navAfter = that.data.navAfter;
      if (navAfter.length <= 0) {
        navAfter.push(result.data.data.all, result.data.data.on, result.data.data.off);
      }
      console.log(navAfter);
      devicesInfo = this.addDevicesObjectProperty(devicesInfo);
      this.setData({
        devicesData: devicesInfo,
        navAfter
      });
    }
  },

  onLoad: function () {
    that = this;
    that.deviceList();
  },

  // setLoading: function () {
  //   let that = this;
  //   let pageIndex = that.data.pageIndex;
  //   let pageSize = that.data.pageSize;
  //   let deviceTotal = that.data.deviceTotal;
  //   let devicesDataCurrent = that.data.devicesData;
  //   let isLoad = that.data.isLoad;
  //   if (isLoad === 0) {
  //     wx.showToast({
  //       title: '已加载完成',
  //       icon: 'none',
  //       duration: 2000
  //     });
  //     return;
  //   }

  //   let data = {
  //     searchStr: '',
  //   };

  //   mClient.get(api.DeviceList, data)
  //     .then(resp => {
  //       let devicesInfo = resp.data.data.data;
  //       devicesInfo = this.addDevicesObjectProperty(devicesInfo);
  //       this.setData({
  //         devicesData: devicesDataCurrent.concat(devicesInfo),
  //         pageIndex: pageIndex,
  //       });

  //       if ((pageIndex * pageSize) > deviceTotal) {
  //         this.setData({
  //           loadText: '已经到底了',
  //           isLoad: 0,
  //         });
  //       };
  //     });
  // },

  // bindDeviceDetaill: function (e) {
  //   let item = e.currentTarget.dataset.item;
  //   wx.navigateTo({
  //     url: '../device_details/device_details?deviceid=' + item.deviceid + "&pointname=" + item.pointname + "&pointaddress=" +
  //       item.pointaddress + "&isbad=" + item.isbad + "&isonline=" + item.isonline + "&isoutofstock=" + item.isoutofstock
  //   })
  // },

  bindPointSerch: function (e) {
    let searchStr = e.detail.value;
    that.setData({
      searchStr
    })
    that.deviceList();
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
    wx.showNavigationBarLoading();
    that.setData({
      searchStr: '',
      online: ''
    })
    that.deviceList();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

    //   console.log("下拉刷新")
    //   // 显示顶部刷新图标  
    //   console.log('刷新');
    //   let pageSize = that.data.pageSize,
    //     pageIndex = 1;
    //   let data = {
    //     searchStr: '',
    //     pageindex: pageIndex,
    //     pagesize: pageSize
    //   };

    //   mClient.get(api.DeviceList, data)
    //     .then(resp => {
    //       wx.hideNavigationBarLoading();
    //       wx.stopPullDownRefresh();
    //       let devicesInfo = resp.data.data.list;
    //       devicesInfo = this.addDevicesObjectProperty(devicesInfo);
    //       let deviceTotal = resp.data.data.all;
    //       if ((pageIndex * pageSize) > deviceTotal) {
    //         this.setData({
    //           loadText: '已经到底了',
    //           isLoad: 0,
    //         });
    //       } else {
    //         this.setData({
    //           loadText: '点击加载',
    //           isLoad: 1,
    //         });
    //       };
    //       this.setData({
    //         pageIndex: pageIndex + 1,
    //         devicesData: devicesInfo,
    //         deviceTotal: resp.data.data.total,
    //         serchContent: ''
    //       });
    //     });
  },
})