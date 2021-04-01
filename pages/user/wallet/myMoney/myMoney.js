// pages/user/wallet/myMoney/myMoney.js
import * as api from '../../../../config/api';
import * as util from '../../../../utils/util';
import * as mClient from '../../../../utils/customClient';
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
    let nowtime = new Date();
    if (options.time) {
      let startTime = options.time;
      that.setData({
        startDate: startTime,
      });
    }
    nowtime.setDate(nowtime.getDate())
    let endTime = util.customFormatTime(nowtime);

    that.setData({
      endDate: endTime,
    });
    that.incomeDetailFn();
  },

  incomeDetailFn: () => {
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
      dateStart: that.data.startDate,
      dateEnd: that.data.endDate,
      startPosition: '1',
      queryNum: '10'
    };
    mClient.PostIncludeData(api.InExpDetail, data)
      .then(resp => {
        console.log('收支详情', resp);
        if (resp.data.success) {
          that.setData({

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

  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value,
    })
  },

  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value,
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