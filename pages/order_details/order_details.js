import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';   
// pages/order_details/order_details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    orderDate: '',
    orderDetail: {},
    goodeNav:['商品名称','金额','出货状态']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderID = options.id;
    console.log(options);
    console.log('当前id',orderID);
    let data = {
      orderid: orderID
    };
    let orderDate = options.orderDate;
    this.setData({
      orderDate: orderDate,
    });

    mClient.get(api.OrderDetail, data).then((resp) => {
      console.log(resp);
      if (resp.data.code == 200) {
        this.setData({
          orderDetail: resp.data.data,
          orderDetails: resp.data.data.orderDetails,
          orderId: orderID,
        });
      } else {
        console.log('fail');
      }
    });
  },

  // async orderDetailFn(){
  //   let result = await(mClient.get(api.OrderDetail, data));
  //   if(result.data.code==200){
      
  //   }
  // },

})