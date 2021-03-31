// pages/user/totalMoney/totalMoney.js
let that;
import * as mClient from '../../../utils/customClient';
import * as api from '../../../config/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsNav: ['时间', '设备销售金额', '我的收入'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    that.incomeFn();
  },

  incomeFn: () => {
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
    };
    mClient.PostIncludeData(api.MyIncome, data)
      .then(resp => {
        console.log('收入', resp);
        if (resp.data.success) {
          that.setData({
            incomes: resp.data.data
          })
        } else {
          wx.showToast({
            title: resp.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      })
      .catch(rej => {
        console.log('错误', rej)
      })
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