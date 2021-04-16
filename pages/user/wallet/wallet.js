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
    bindingPhoneState: '绑定手机号',
    bindingBankState: '绑定银行卡',
    setPaswordText: '设置密码',
    showModalStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.mask = this.selectComponent('#mask');
  },

  //设置密码
  bindLogOut: function () {
    let data = {
      bizUserId: wx.getStorageSync('bizUserId')
    };
    if (that.data.ledgerTarget.payPwdVerify == 0) {
      mClient.PostIncludeData(api.SetPayPwd, data)
        .then(resp => {
          console.log('设置密码', resp);
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
    } else {
      this.mask.utilFn('open');
    }
  },

  //充值
  bindRechargeFn: () => {
    that.setData({
      showModalStatus: true
    })
  },
  rechargePriceFn: e => {
    that.setData({
      rechargePrice: e.detail.value
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
          if (!that.data.rechargePrice) {
            wx.showToast({
              title: '请输入充值金额',
              icon: 'none',
              duration: 2000
            })
            return
          }
          wx.navigateTo({
            url: 'bindingBank/bindingBank',
            success: function (res) {
              res.eventChannel.emit('acceptDataFromOpenerPage', {
                rechargePrice: that.data.rechargePrice
              })
            }
          })
        }
      } else if (currentStatu == "open") {
        this.setData({
          showModalStatus: true
        });
      }
    }.bind(this), 300)
    // 显示
    // if (currentStatu == "open") {

    // }
  },



  myWalletFn: () => {
    let data = {
      bizUserId: wx.getStorageSync('bizUserId'),
    };
    mClient.PostIncludeData(api.Wallet, data)
      .then(resp => {
        let dateTextWrap = [{
          dateText: '上月收入'
        }, {
          dateText: '当月收入'
        }, {
          dateText: '当日收入'
        }];
        console.log('钱包详情', resp);
        let accountFlow = resp.data.data.accountFlow;
        console.log(accountFlow)

        // for (const key in accountFlow) {
        //   const element = accountFlow[key];
        //   console.log(element)
        //   for (let [key, val] of element.entries()) {
        //     console.log(key, val)
        //   };
        // }

        // var obj = dateTextWrap.map((item, index) => {
        //   return {
        //     ...item,
        //     ...resp.data.data.accountFlow[index]
        //   };
        // });
        // console.log('合并数组', obj);
        if (resp.data.success) {
          that.setData({
            walletDetail: resp.data.data,
            accountFlow: accountFlow,
            ledgerTarget: resp.data.data.ledgerTarget
          })
          if (that.data.ledgerTarget.phoneVerify == 0) {
            that.setData({
              bindingPhoneState: '绑定手机号'
            })
          } else {
            that.setData({
              bindingPhoneState: '修改手机号'
            })
          }
          if (that.data.ledgerTarget.cardVerify == 0) {
            that.setData({
              bindingBankState: '绑定银行卡'
            })
          } else {
            that.setData({
              bindingBankState: '添加银行卡'
            })
          }
          if (that.data.ledgerTarget.payPwdVerify == 0) {
            that.setData({
              setPaswordText: '设置密码'
            })
          } else {
            that.setData({
              setPaswordText: '修改密码'
            })
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

  // mask模态框
  statusNumberFn: (e) => {
    let data = {
      bizUserId: wx.getStorageSync('bizUserId')
    };
    if (e.detail.status === '0') {
      mClient.PostIncludeData(api.UpdatePayPwd, data)
        .then(resp => {
          console.log('修改密码', resp);
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
    } else {
      mClient.PostIncludeData(api.ResetPayPwd, data)
        .then(resp => {
          console.log('忘记密码', resp);
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
      return
    } else if (that.data.ledgerTarget.payPwdVerify == 0) {
      wx.showToast({
        title: '请先设置支付密码',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      wx.navigateTo({
        url: 'modificationPhone/modificationPhone',
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