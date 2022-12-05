// pages/user/user.js
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as mClient from '../../utils/customClient';
let that;
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },
  // 拨打电话
  openPhone: function (e) {
    const itemList = [];
    itemList.push(e.currentTarget.dataset.servicetel);
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.servicetel,
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
        if (!res.cancel) {
          console.log(res.tapIndex) //console出了下标
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      roles: wx.getStorageSync('roles')
    })
    console.log(wx.getStorageSync('roles')[0])
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: app.globalData.selected
      })
    }

    mClient.getInfo()
      .then(resp => {
        if (resp.data.code == 200) {
          console.log('用户信息', resp);
          if (resp.data.data.info) {
            that.setData({
              userInfo: resp.data.data.info,
              agencyId: resp.data.data.info.id
            });
          }
          that.EssentialFn();
        }
      })
      .catch(rej => {
        console.log('错误', rej)
      })
  },

  EssentialFn: () => {
    let data = {
      userId: wx.getStorageSync('userID')
    };
    mClient.PostIncludeData(api.Essential, data)
      .then(resp => {
        console.log('余额收入', resp);
        if (resp.data.code == 200) {
          wx.setStorageSync('bizUserId', resp.data.data.bizUserId);
          that.setData({
            result: resp.data.data,
            ledgerStatus: resp.data.data.ledgerStatus
          });
        }
      })
      .catch(rej => {
        console.log('错误', rej)
      })
  },

  bindLogOut: function () {
    wx.showModal({
      title: '退出登录',
      content: '确定退出当前账号吗？',
      success(res) {
        if (res.confirm) {
          try {
            wx.clearStorageSync()
            wx.reLaunch({
              url: '../login/login'
            })
          } catch (e) {
            // Do something when catch error
          }
        }
      }
    })
  },

  bindUserSaleDetailly: function () {
    let that = this;
    let userInfo = that.data.userInfo;
    let time = util.customFormatTime(new Date(userInfo.createdate));
    let saledAmount = userInfo.amount;
    let arriveAmount = userInfo.arriveamount;
    // wx.navigateTo({
    //   url: "../my_money/my_money?time=" + time + "&saledAmount=" + saledAmount + "&arriveAmount=" + arriveAmount,
    // });
    wx.navigateTo({
      url: "totalMoney/totalMoney",
    });
  },

  // 跳转钱包
  bindUserWallet: () => {
    wx.navigateTo({
      url: 'wallet/wallet',
    })
  },

  // 跳转验证
  gotoauthenticationFn: () => {
    let result = that.data.result;
    if (result) {
      if (!result.personVerify) {
        wx.navigateTo({
          url: '/pages/authentication/authentication',
        })
      } else if (!result.cardVerify) {
        wx.navigateTo({
          url: '/pages/bankCard/bankCard',
        })
      } else if (!result.contractNo) {
        let data = {
          bizUserId: wx.getStorageSync('bizUserId')
        };
        mClient.PostIncludeData(api.SignContract, data)
          .then(resp => {
            console.log('签约', resp);
            if (resp.data.code == 200) {
              let parameter = resp.data.data;
              wx.navigateToMiniProgram({
                // envVersion: 'trial',
                appId: 'wxc46c6d2eed27ca0a',
                path: 'pages/merchantAddress/merchantAddress',
                extraData: {
                  targetUrl: parameter
                },
                success(res) {
                  console.log('打开成功', res)
                }
              })
            }
          })
          .catch(rej => {
            console.log('错误', rej)
          })
      }
    }
  },

})