import * as mClient from '../utils/customClient';
import * as api from '../config/api';

function payOrder(orderId) {
  return new Promise((resolve, reject) => {
    let data = {
      orderId,
      userId: wx.getStorageSync('userID')
    }
    //发起网络请求
    mClient.get(api.OrderPay, data).then(resp => {
      let info = resp.data.data;
      if (resp.data.code == 200) {
        wx.requestPayment({
          'timeStamp': info.timeStamp,
          'nonceStr': info.nonceStr,
          'package': info.package,
          'signType': info.signType,
          'paySign': info.paySign,
          'success': function (res) {
            resolve(res);
          },
          'fail': function (res) {
            resolve(false);
          },
          'complete': function (res) {}
        })
      } else {
        resolve(false);
      }
    })




    // wx.login({
    //     success(res) {
    //       if (res.code) {
    // let data = {
    //   orderid: orderId,
    //   status: '1'
    // }
    // mClient.post(api.UpdateOrderStatus, data).then(resp => {
    //   let result = resp.data.data.result;
    //   if (result === true) {
    //     resolve(true);
    //   } else {
    //     resolve(false);
    //   }
    // });

    //       } else {
    //         wx.showToast({
    //           title: '用户code无法获取',
    //           icon: 'fail',
    //           duration: 2000
    //         })
    //         return false;
    //       }
    //     }
    //   })
  })
}

function showDialog(orderId) {
  wx.showModal({
    title: '提示',
    content: '以产生未支付订单,请前往支付',
    success: function (res) {

      if (res.confirm) { //这里是点击了确定以后            
        wx.navigateTo({
          url: '../status_details/status_details?orderId=' + orderId,
        })
      } else { //这里是点击了取消以后
        wx.navigateBack({
          delta: 1
        })
      }
    }
  })
}

module.exports = {
  payOrder
}