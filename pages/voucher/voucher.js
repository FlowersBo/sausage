// pages/voucher/voucher.js
import * as api from '../../config/api';
import * as mClient from '../../utils/customClient';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let {
      orderId,
      payPrice
    } = options;
    that.setData({
      payPrice,
      orderId
    })
    that.baseAccount();
  },
  async baseAccount(orderId) {
    let result = await (mClient.get(api.BaseAccount, {}));
    console.log(result)
    that.setData({
      backDetail: result.data.data
    })
  },

  copyFn: e => {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.back,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log('复制', res.data)
          }
        })
      }
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

  pushImgFn() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach(element => {
          wx.uploadFile({
            url: `${api.ApiRootUrl}upload/uploadImage`,
            filePath: element,
            name: "file",
            header: {
              "content-type": "multipart/form-data"
            },
            success: function (res) {
              if (res.statusCode == 200) {
                wx.showToast({
                  title: "上传成功",
                  icon: "none",
                  duration: 1500
                })
                that.data.imgs.push(JSON.parse(res.data).data)
                that.setData({
                  imgs: that.data.imgs
                })
              }
            },
            fail: function (err) {
              wx.showToast({
                title: "上传失败",
                icon: "none",
                duration: 2000
              })
            },
            complete: function (result) {
              console.log(result.errMsg)
            }
          })
        });
      }
    })
  },

  deleteImgFn(e) {
    console.log('删除图片', e);
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
          let imgs = that.data.imgs;
          imgs.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            imgs
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },

  formFn(e) {
    if (that.data.imgs.length < 1) {
      wx.showToast({
        title: '请上传凭证图片',
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log(that.data.imgs);
      wx.showModal({
        title: '提示',
        content: '是否提交上传当前凭证信息',
        success(res) {
          if (res.confirm) {
            mClient.wxRequest(api.OrderBankPay, {
              orderId: that.data.orderId,
              payImage: that.data.imgs[0]
            }).then(res => {
              console.log('提交返回', res)
              if (res.code !== 200) {
                wx.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.redirectTo({
                  url: '../status_details/status_details?orderId=' + that.data.orderId,
                })
              }
            }).catch(err => {

            })
          }
        }
      })

    }
  },

  gotoOrderDetail(){
    wx.navigateTo({
      url: '../status_details/status_details?orderId='+that.data.orderId,
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