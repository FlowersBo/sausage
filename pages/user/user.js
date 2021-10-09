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
          console.log('用户信息',resp);
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
            // parameter = "https://fintech.allinpay.com/yungateway/member/signContract.html?sysid=1364457518261436417&v=2.0&timestamp=2021-09-06+16%3A28%3A06&sign=bgZo8w6599eqDpuYxHWgB8M2XZvI%2FfFAyNCrJrJ7S6FuyddFihNqWU633Qc26ESok4w9oDhpJ7dp7zXuYTCsVo9dhewGHfZzz65h9v4%2FfQnw6Vaf4cJOtS5hgyiLGSvUvo3bhyBwgrzNiL%2BKQN197SZ%2Be1S0OIZTYiRr%2FzX76y4%3D&req=%7B%22method%22%3A%22signContract%22%2C%22param%22%3A%7B%22backUrl%22%3A%22https%3A%2F%2Fw3.morninggo.cn%2Fallinpay%2Fback%2FsignContract%22%2C%22noContractUrl%22%3A%22%22%2C%22jumpPageType%22%3A2%2C%22source%22%3A1%2C%22jumpUrl%22%3A%22%22%2C%22bizUserId%22%3A%221433639189932408832%22%7D%2C%22service%22%3A%22MemberService%22%7D&";
            console.log(parameter)
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
    } else if (!result.cardVerify) {
      wx.navigateTo({
        url: '/pages/bankCard/bankCard',
      })
    }
  },

})