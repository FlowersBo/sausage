// pages/bankCard/bankCard.js
let that;
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
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
    let routeName = options.routeName;
    console.log('跳转路径', routeName);
    if (routeName) {
      that.setData({
        routeName: options.routeName
      })
    }
  },

  formFaceUpload: (e) => {
    console.log(e);
    let name = e.detail.value.info,
      identityNo = e.detail.value.idCard,
      cardNo = e.detail.value.bankCard;
    if (!name) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!identityNo) {
      wx.showToast({
        title: '身份证号不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (identityNo.length < 18) {
      wx.showToast({
        title: '身份证号输入错误',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (cardNo == "") {
      wx.showToast({
        title: '银行卡号不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (cardNo.length < 16 || cardNo.length > 19) {
      wx.showToast({
        title: '银行卡号输入错误',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
      name,
      identityNo,
      cardNo
    };
    mClient.PostIncludeData(api.BindBankCard, data)
      .then(resp => {
        console.log('绑卡', resp);
        if (resp.data.success) {
          if (resp.data.data) {
            if (that.data.routeName) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.switchTab({
                url: '/pages/user/user'
              });
            }
          } else {
            wx.showToast({
              title: resp.data.msg,
              icon: 'none',
              duration: 2000
            })
            return
          }
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