// pages/user/wallet/forgetPassword/forgetPassword.js
let that;
import * as mClient from '../../../../utils/customClient';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // verificationControlText: '获取验证码',
    // isRepeatClick: false,
    // isPhoneNumber: false,
    // verificationTimeTotal: 60,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },


  // Input phone number even
  bindInputPhoneNumber: function (e) {
    let phoneNumber = e.detail.value;
    let isPhoneNumber = false;
    //is qualified phone number
    if ((/^1[3456789]\d{9}$/.test(phoneNumber))) {
      isPhoneNumber = true;
    } else {
      isPhoneNumber = false;
      return;
    }

    if (isPhoneNumber == true) {
      this.setData({
        phoneNumber: phoneNumber,
        isPhoneNumber: isPhoneNumber
      })
    }
  },

  formFaceUpload: (e) => {
    console.log('表单数据', e);
    let result = e.detail.value;
    if (!result.info) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (result.idCard.length != 18) {
      wx.showToast({
        title: '证件号码输入错误',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!result.phoneNumber) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1000
      })
      return
    } else if (!(/^1[345789]\d{9}$/.test(result.phoneNumber))) {
      wx.showToast({
        title: '手机号码输入错误',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({
      url: '../paymentPassword/paymentPassword',
    })
  },

  // get verification code
  // getVerificationCode: function () {
  //   let phoneNumber = that.data.phoneNumber;
  //   let isRepeatClick = that.data.isRepeatClick;
  //   let isPhoneNumber = that.data.isPhoneNumber;
  //   let verificationTimeTotal = that.data.verificationTimeTotal;
  //   if (isRepeatClick == true) {
  //     return
  //   }
  //   console.log(phoneNumber)
  //   if(!phoneNumber){
  //     wx.showToast({
  //       title: '请输入手机号',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //   }else if (phoneNumber.length != 11) {
  //     wx.showToast({
  //       title: '手机号有误',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //     return;
  //   }
  //   if (!(/^1[34578]\d{9}$/.test(phoneNumber))) {
  //     wx.showToast({
  //       title: '手机号格式有误',
  //       icon: 'none',
  //       duration: 1000
  //     })
  //   }
  //   let data = {
  //     username: parseInt(phoneNumber)
  //   }
  //   if (isPhoneNumber == true) {
  //     wx.showLoading({
  //       title: '验证码获取中',
  //     })
  //     mClient.getVerificationCode(data)
  //       .then((resp) => {
  //         console.log(resp);
  //         if (resp.data.code == '200') {
  //           this.setData({
  //             isRepeatClick: true
  //           })
  //           that.startVerificationCountDown(verificationTimeTotal);
  //           wx.showToast({
  //             title: '发送成功',
  //             icon: 'none',
  //             duration: 1000
  //           });
  //         } else {
  //           wx.showToast({
  //             title: '该手机号未经管理员授权',
  //             icon: 'none',
  //             duration: 2000
  //           });
  //         }
  //         wx.hideLoading();
  //       });
  //   } else {
  //     wx.showToast({
  //       title: '手机号码格式不正确',
  //       icon: 'none',
  //       duration: 1000
  //     });
  //   }
  // },

  // // 运营商15001081726
  // startVerificationCountDown: function (count) {
  //   if (count == 0) {
  //     this.setData({
  //       verificationControlText: '获取验证码',
  //       isVerifyOutTime: true,
  //       isRepeatClick: false
  //     });
  //     return;
  //   } else {
  //     this.setData({
  //       isRepeatClick: true,
  //       verificationControlText: count,
  //     });
  //     count = count - 1;
  //     setTimeout(() => {
  //       this.startVerificationCountDown(count)
  //     }, 1000);
  //   }
  // },
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