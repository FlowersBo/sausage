// pages/confirmation_order/cashierDesk/cashierDesk.js
import {
  payOrder
} from '../../../payment/payment';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        value: '0',
        name: '微信支付',
        icon: 'icon-weixinzhifu',
        color: '#09BB07'
      },
      // {
      //   value: '1',
      //   name: '晨购钱包余额支付',
      //   icon: 'icon-yuezhifu',
      //   color: '#615A3C'
      // },
      {
        value: '2',
        name: '大额转账',
        icon: 'icon-zhifu',
        color: '#1171D7'
      },
    ],
    showModal: false
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      id: e.detail.value
    })
  },

  payFn() {
    console.log(this.data.id);
    if (this.data.id) {
      this.setData({
        showModal: true
      })

    } else {
      wx.showToast({
        title: '请先勾选支付方式',
        icon: 'none',
        duration: 2000
      })
    }
  },

  offMask() {
    this.setData({
      showModal: false
    })
  },

  paymentFn() {
    if (that.data.id == 0) {
      payOrder(that.data.orderId).then(res => {
        console.log('支付返回', res)
        wx.reLaunch({
          url: '../../status_details/status_details?orderId=' + that.data.orderId,
        })
      })
    } else {
      wx.reLaunch({
        url: '../../voucher/voucher?orderId=' + that.data.orderId + '&payPrice=' + that.data.totalPrice,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
    that.setData({
      totalPrice: options.totalPrice,
      orderId: options.orderId
    })
    if (Number(options.totalPrice) >= 50000) {
      that.data.items.splice(0,1);
      that.setData({
        items: that.data.items
      })
      console.log(that.data.items)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})