import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
// pages/order_details/order_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    orderDate: '',
    orderDetail: {},
    isSuccessfulTransaction: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let orderID = options.id;
    let data = {orderid: orderID};
    let isSuccessfulTransaction = options.isSuccessfulTransaction;
    let orderDate = options.orderDate;
    console.log(isSuccessfulTransaction);
    this.setData({
      orderDate: orderDate,
      isSuccessfulTransaction: isSuccessfulTransaction,
    });

    mClient.get(api.OrderDetail, data).then((resp) => {
      console.log(resp);
      if (resp.data.code == 200) {
          this.setData({
              orderDetail: resp.data.data.detail,
              orderId: orderID
          });
      } else {
          console.log('fail');
      }
  });
  },

})