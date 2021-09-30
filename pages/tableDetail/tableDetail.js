// pages/tableDetail/tableDetail.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let {
      pointId,
      pointName,
      pointStartDate,
      pointEndDate
    } = options;
    that.setData({
      pointName: pointName,
      pointDetaillyDate: `${pointStartDate}~${pointEndDate}`
    })
    that.PTdetail(pointId, pointStartDate, pointEndDate);
  },

  async PTdetail(pointId, startDate, endDate) {
    let data = {
      pointId,
      startDate,
      endDate
    }
    let result = await (mClient.get(api.SinglePointSaleDetail, data));
    console.log('点位统计表', result);
    if (result.data.code == 200) {
      that.setData({
        statistics: result.data.data.saleList,
        address: result.data.data.address,
        pointName: result.data.data.pointName
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