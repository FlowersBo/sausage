// pages/user/wallet/bindingBank/bindingBank.js
import * as mClient from '../../../../utils/customClient';
import * as api from '../../../../config/api';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankStatus: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log('充值金额', data.rechargePrice);
      console.log('提现', data.withdraw);
      if (data.rechargePrice) {
        that.setData({
          rechargePrice: data.rechargePrice
        })
        wx.setNavigationBarTitle({
          title: '充值'
        })
      } else if (data.withdraw) {
        that.setData({
          withdraw: data.withdraw,
          balance: data.balance
        })
        wx.setNavigationBarTitle({
          title: '余额提现'
        })
      }
    })
  },

  addBankCard: () => {
    wx.navigateTo({
      url: '../../../bankCard/bankCard?routeName=' + 'bindingBank',
    })
  },

  rechargeAmountFn: e => {
    that.setData({
      bankAmount: e.detail.value
    })
  },

  selectBankFn: e => {
    if (that.data.rechargePrice || that.data.withdraw) {
      console.log('银行卡', e);
      let bankCardNo = e.currentTarget.dataset.bankcardno;
      that.setData({
        showModalStatus: true,
        bankCardNo: bankCardNo
      })
      if (that.data.rechargePrice) {
        let data = {
          bizUserId: wx.getStorageSync('bizUserId'),
          amount: that.data.rechargePrice,
          cardNo: bankCardNo
        };
        mClient.PostIncludeData(api.DepositApply, data)
          .then(resp => {
            console.log('充值', resp);
            if (resp.data.success) {
              that.setData({
                bizOrderNo: resp.data.data.bizOrderNo
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
    }
  },

  rechargeCodeFn: e => {
    that.setData({
      rechargeCode: e.detail.value
    })
  },

  gotobargainDetailFuns: function (e) {
    let status = e.currentTarget.dataset.status;
    this.utilFn('close', status);
  },
  // 模态动画
  utilFn: function (currentStatu, status) {
    var animation = wx.createAnimation({
      duration: 300, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    this.animation = animation;
    animation.opacity(0).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).step();
      this.setData({
        animationData: animation
      })
      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
        if (status == 1) {
          if (that.data.rechargePrice) {
            if (!that.data.rechargeCode) {
              wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 2000
              })
              return
            }
            if (that.data.rechargeCode.length < 6) {
              wx.showToast({
                title: '验证码错误',
                icon: 'none',
                duration: 2000
              })
              return
            }
            let data = {
              bizUserId: wx.getStorageSync('bizUserId'),
              bizOrderNo: that.data.bizOrderNo,
              verificationCode: that.data.rechargeCode
            };
            mClient.PostIncludeData(api.PayByBackSMS, data)
              .then(resp => {
                console.log('充值确认', resp);
                if (resp.data.success) {
                  wx.showToast({
                    title: resp.data.data,
                    icon: 'none',
                    duration: 2000
                  });
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
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

          } else if (that.data.withdraw) {
            if (!that.data.bankAmount) {
              wx.showToast({
                title: '请输入提现金额',
                icon: 'none',
                duration: 2000
              })
              return
            }
            if (that.data.bankAmount <= 0) {
              wx.showToast({
                title: '提现金额需大于0元',
                icon: 'none',
                duration: 2000
              })
              return
            }
            let data = {
              bizUserId: wx.getStorageSync('bizUserId'),
              bankCardNo: that.data.bankCardNo,
              amount: that.data.bankAmount
            };
            mClient.PostIncludeData(api.WithdrawApply, data)
              .then(resp => {
                console.log('提现', resp);
                if (resp.data.success) {

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
        }
      } else if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
      }
    }.bind(this), 300)
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
              bankStatus: '添加银行卡+'
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