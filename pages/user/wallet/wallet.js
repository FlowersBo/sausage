// pages/user/wallet/wallet.js
import * as util from '../../../utils/util';
import * as mClient from '../../../utils/customClient';
import * as api from '../../../config/api';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindingPhoneState: '绑定手机'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.mask = this.selectComponent('#mask');
  },

  // bindLogOut: function () {
  //   this.mask.util('open');
  // },

  myWalletFn: () => {
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
    };
    mClient.PostIncludeData(api.Wallet, data)
      .then(resp => {
        console.log('钱包详情', resp);
        if (resp.data.success) {
          that.setData({
            walletDetail: resp.data.data,
            accountFlow: resp.data.data.accountFlow,
            ledgerTarget: resp.data.data.ledgerTarget
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

  // mask模态框
  statusNumberFn: (e) => {
    if (e.detail.status === '0') {
      wx.navigateTo({
        url: 'paymentPassword/paymentPassword',
      })
    } else {
      wx.navigateTo({
        url: 'forgetPassword/forgetPassword',
      })
    }
  },

  gotomyMoney: () => {
    let time = new Date;
    time.setDate(time.getDate() - 1);
    time = util.customFormatTime(time);
    wx.navigateTo({
      url: "myMoney/myMoney?time=" + time,
    });
  },
  bindingPhone: () => {
    if (that.data.ledgerTarget.phoneVerify == 0) {
      wx.navigateTo({
        url: 'bindingPhone/bindingPhone',
      })
      that.setData({
        bindingPhoneState: '绑定手机'
      })
    } else {
      that.setData({
        bindingPhoneState: '修改手机号'
      })
    }
  },

  bindingBank: () => {
    if (that.data.ledgerTarget.cardVerify) {
      wx.navigateTo({
        url: 'bindingBank/bindingBank',
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
    that.myWalletFn();
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