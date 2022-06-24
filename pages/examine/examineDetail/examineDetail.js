// pages/examine/examineDetail/examineDetail.js
import * as mClient from '../../../utils/customClient';
import * as api from '../../../config/api';
import * as util from '../../../utils/util';
import * as payment from '../../../payment/payment';
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      '商品名称',
      '数量',
      '单位',
      '金额',
    ],
    items: [{
        name: 0,
        sex: 'nan',
        index: '00000',
        phone: '1355555'
      },
      {
        name: 1,
        sex: 'nv',
        index: '0002300',
        phone: '1355555'
      },
      {
        name: 2,
        sex: 'n',
        index: '122222',
        phone: '1355555'
      },
      {
        name: 3,
        sex: 'nan',
        index: '03330000',
        phone: '1355555'
      },
      {
        name: 4,
        sex: 'nb',
        index: '004000',
        phone: '1355555'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this;
    console.log(options.orderId)
    that.examineDetailFn(options.orderId);
  },

  examineDetailFn(orderId) {
    mClient.get(api.GoodsOrderDetail, {
      orderId
    }).then(resp => {
      this.setData({
        orderInfo: resp.data.data.orderInfo,
        orderDetail: resp.data.data.orderDetail,
        storeInfo: resp.data.data.storeInfo
      })
    });
  },

  clickBtn(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    if (id == 0) {

    } else {

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