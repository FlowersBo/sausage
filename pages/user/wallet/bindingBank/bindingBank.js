// pages/user/wallet/bindingBank/bindingBank.js
import * as mClient from '../../../../utils/customClient';
import * as api from '../../../../config/api';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankStatus: '绑定银行卡'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },

  addBankCard: () => {
    wx.navigateTo({
      url: '../../../bankCard/bankCard?routeName=' + 'bindingBank',
    })
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
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
    };
    mClient.PostIncludeData(api.QueryBankCard, data)
      .then(resp => {
        console.log('卡', resp);
        if (resp.data.success) {
          if (resp.data.data.length > 0) {
            that.setData({
              bankStatus: '添加银行卡'
            })
          }
          that.setData({
            bankCardList: resp.data.data
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