// pages/bankCard/bankCard.js
let that;
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    verificationCode: '',
    isVerifyOutTime: true,
    verificationControlText: '获取验证码',
    verificationTimeTotal: 60,
    isRepeatClick: false
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

  bindUserName: e => {
    that.setData({
      userName: e.detail.value
    });
  },
  bindIdCardNumber: e => {
    that.setData({
      idCardNumber: e.detail.value
    });
  },

  bindBankCardNumber: e => {
    that.setData({
      bankCardNumber: e.detail.value
    });
  },

  bindPhoneNumber(e) {
    that.setData({
      phoneNumber: e.detail.value
    });
  },


  getVerificationCode: function () {
    let that = this;
    let userName = that.data.userName,
    idCardNumber = that.data.idCardNumber,
    bankCardNumber= that.data.bankCardNumber,
    phoneNumber = that.data.phoneNumber;
    let isVerifyOutTime = that.data.isVerifyOutTime;
    let verificationTimeTotal = that.data.verificationTimeTotal;
    let isRepeatClick = that.data.isRepeatClick;

    if (isRepeatClick == true) {
      return
    }

    if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
      return
    }

    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
      phone: phoneNumber, 
    }

    if (isVerifyOutTime == true) {
      wx.showLoading({
        title: '验证码获取中',
      })
      mClient.PostIncludeData(api.ApplyBindBankCard, data)
        .then((resp) => {
          console.log(resp);
          if (resp.data.success) {
            this.setData({
              isRepeatClick: true
            })
            that.startVerificationCountDown(verificationTimeTotal);
            wx.showToast({
              title: '发送成功',
              icon: 'none',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: resp.data.msg,
              icon: 'none',
              duration: 2000
            });
          }
          wx.hideLoading();
        });

    } else {
      wx.showToast({
        title: '请稍后重新获取验证码',
        icon: 'none',
        duration: 1000
      });
    }
  },


  // 运营商15001081726
  startVerificationCountDown: function (count) {
    if (count == 0) {
      this.setData({
        verificationControlText: '获取验证码',
        isVerifyOutTime: true,
        isRepeatClick: false
      });
      return;
    } else {
      this.setData({
        isRepeatClick: true,
        verificationControlText: count,
      });
      count = count - 1;
      setTimeout(() => {
        this.startVerificationCountDown(count)
      }, 1000);
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
    mClient.PostIncludeData(api.ApplyBindBankCard, data)
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