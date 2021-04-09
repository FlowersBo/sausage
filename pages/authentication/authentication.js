// pages/authentication/authentication.js
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
  },
  
  //提交
  formFaceUpload: (e) => {
    console.log('提交表单', e)
    let infoName = e.detail.value.info,
      idCard = e.detail.value.idCard;
    if (!infoName) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!idCard) {
      wx.showToast({
        title: '请填写身份证号',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (idCard.length < 18) {
      wx.showToast({
        title: '身份证号有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      let data = {
        bizUserId: wx.getStorageSync('bizUserId'),
        name: infoName,
        identityNo: idCard
      };
      mClient.PostIncludeData(api.SetRealName, data)
        .then(resp => {
          console.log('个人认证', resp);
          if (resp.data.code == 0) {
            let attestation = resp.data.data;
            let data = {
              bizUserId: wx.getStorageSync('bizUserId')
            };
            mClient.PostIncludeData(api.SignContract, data)
              .then(resp => {
                console.log('签约', resp);
                if (resp.data.success) {
                  let parameter = resp.data.data;
                  wx.navigateToMiniProgram({
                    appId: 'wxc46c6d2eed27ca0a',
                    path: 'pages/merchantAddress/merchantAddress',
                    extraData: {
                      targetUrl: parameter
                    },
                    // envVersion: 'develop',
                    success(res) {
                      console.log('打开成功', res)
                    }
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
          }
        })
        .catch(rej => {
          console.log('错误', rej)
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