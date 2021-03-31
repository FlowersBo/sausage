// pages/user/user.js
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as mClient from '../../utils/customClient';
let that;
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
  },

  onShow: function () {
    mClient.getInfo()
      .then(resp => {
        if (resp.data.code == 200) {
          console.log(resp);
          that.setData({
            userInfo: resp.data.data.info,
            agencyId: resp.data.data.info.id
          });
          that.EssentialFn();
        }
      })
      .catch(rej => {
        console.log('错误', rej)
      })
  },

  EssentialFn: () => {
    let data = {
      agencyId: that.data.agencyId
    };
    mClient.PostIncludeData(api.Essential, data)
      .then(resp => {
        console.log('余额收入', resp);
        if (resp.data.code == 0) {
          let result = resp.data.data;
          wx.setStorageSync('bizUserId', resp.data.data.bizUserId);
          that.setData({
            result: result
          });
        }
      })
      .catch(rej => {
        console.log('错误', rej)
      })
  },
  bindLogOut: function () {
    try {
      wx.clearStorageSync()
      wx.reLaunch({
        url: '../login/login'
      })
    } catch (e) {
      // Do something when catch error
    }
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

  bindUserOrder: function () {
    wx.navigateTo({
      url: "../my_order/my_order",
    });

  },

  // 跳转验证
  gotoauthenticationFn: () => {
    let result = that.data.result;
    if (!result.personVerify) {
      wx.navigateTo({
        url: '/pages/authentication/authentication',
      })
    } else if (!result.contractNo) {
      let data = {
        bizUserId: wx.getStorageSync('bizUserId')
      };
      mClient.PostIncludeData(api.SignContract, data)
        .then(resp => {
          console.log('签约', resp);
          if (resp.data.code == 0) {
            let parameter = resp.data.data;
            console.log(parameter)
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
          }
        })
        .catch(rej => {
          console.log('错误', rej)
        })
    } else if (!result.cardVerify) {
      wx.navigateTo({
        url: '/pages/bankCard/bankCard',
      })
    }
  },

})