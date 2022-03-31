// pages/user/wallet/modificationPhone/modificationPhone.js
let that;
import * as mClient from '../../../../utils/customClient';
import * as api from '../../../../config/api';
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
  },

  formFaceUpload: (e) => {
    console.log(e);
    let name = e.detail.value.info,
      identityNo = e.detail.value.idCard,
      oldPhone = e.detail.value.oldPhone,
      newPhone = e.detail.value.newPhone;
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
    } else if (oldPhone == "") {
      wx.showToast({
        title: '原手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!(/^1[3456789]\d{9}$/.test(oldPhone))) {
      wx.showToast({
        title: '原手机号填写错误',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (newPhone == "") {
      wx.showToast({
        title: '新手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!(/^1[3456789]\d{9}$/.test(newPhone))) {
      wx.showToast({
        title: '新手机号填写错误',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
      name,
      identityNo,
      oldPhone
    };
    mClient.PostIncludeData(api.UpdatePhone, data)
      .then(resp => {
        console.log('修改手机号', resp);
        if (resp.data.success) {
          if (resp.data.data) {
            wx.navigateToMiniProgram({
              appId: 'wxc46c6d2eed27ca0a',
              path: 'pages/merchantAddress/merchantAddress',
              extraData: {
                targetUrl: resp.data.data
              },
              success(res) {
                console.log('打开成功', res)
              }
            })
          } else {
            wx.showToast({
              title: resp.data.msg,
              icon: 'none',
              duration: 2000
            })
            return
          }
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
  // onShareAppMessage: function () {

  // }
})