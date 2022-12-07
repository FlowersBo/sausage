// pages/selectFacility/selectFacility.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   if(options.deviceType){
    let deviceType = JSON.parse(decodeURIComponent(options.deviceType));
    let deviceList = [];
    for (const key in deviceType) {
      if (Object.hasOwnProperty.call(deviceType, key)) {
        const element = deviceType[key];
        deviceList.push(element)
      }
    }
    wx.setStorageSync('deviceList', deviceList)
   }
   this.setData({
    deviceList: wx.getStorageSync('deviceList')
  })
  },

  gotoHome(e){
    let deviceName = e.currentTarget.dataset.name;
    wx.setStorageSync('facilityName', deviceName);
    if(deviceName==='自助烤肠机'){
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }else{
      wx.reLaunch({
        url: '/pages/childDetail/childIndex/childIndex'
      });
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