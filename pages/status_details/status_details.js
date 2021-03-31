import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as payment from '../../payment/payment';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        userInfo: [],
        orderInfo: [],
        btnGenre: [],
        isShowBtn: false,
        backpageGenre: 1
    },

    onLoad: function (options) {
        let orderId = options.orderId;
        let backpageGenre = 1;
        if (options.hasOwnProperty('backpagegenre')) {
            backpageGenre = options.backpagegenre;
        }

        let data = {
            orderid: orderId,
            backpageGenre: backpageGenre
        };

        mClient.get(api.GetGoodsDetail, data).then(resp => {
            let orderInfo = resp.data.data;
            orderInfo.settleAccounts = orderInfo.goodsamount + orderInfo.shipfee;
            orderInfo.orderTime = util.formatTime(new Date(orderInfo.orderdate));

            if (orderInfo.isextenddelivery == true && orderInfo.statuscode == '2') {
                orderInfo.status = '延长发货'
            }

            this.setData({
                orderId: orderId,
                orderInfo: orderInfo
            })
            this.renderUserContactInfo();
            this.renderBtn(orderInfo);

        });
    },

    //渲染用户联系方式
    renderUserContactInfo: function () {
        let that = this;
        let orderInfo = that.data.orderInfo;

        let data = {
            isdefault: false,
        };

        mClient.get(api.userContactInfo, data)
            .then(resp => {
                let userInfos = resp.data.data.list;
                for (let index = 0; index < userInfos.length; index++) {
                    if (userInfos[index].id === orderInfo.contactid) {
                        this.setData({
                            userInfo: userInfos[index],
                        })
                    }
                }
            });
    },

    //订单状态，0:待付款，1:待发货，2:已发货，3:已完成，9:已取消;为空获取全部
    renderBtn: function (orderInfo) {
        let statusCode = orderInfo.statuscode;
        let isextenddelivery = orderInfo.isextenddelivery;
        if (statusCode === '0') {
            this.setData({
                btnGenre: ['立即支付', '取消订单'],
                isShowBtn: true
            })
        } else if (statusCode === '1') {
            this.setData({
                btnGenre: []
            })
        } else if (statusCode === '2') {
            if (isextenddelivery == true) {
                this.setData({
                    btnGenre: ['确认收货'],
                    isShowBtn: true
                })
            } else {
                this.setData({
                    btnGenre: ['延长收货', '确认收货'],
                    isShowBtn: true
                })
            }
        } else if (statusCode === '3') {
            this.setData({
                btnGenre: []
            })
        } else if (statusCode === '9') {
            this.setData({
                btnGenre: []
            })
        } else {
            this.setData({
                btnGenre: []
            })
        }
    },

    bindOperationOrder: function (e) {
        let that = this;
        let orderId = e.currentTarget.dataset.orderid;
        let backpageGenre = that.data.backpageGenre;
        let operationGenre = e.currentTarget.dataset.operationgenre;
        if (operationGenre === '立即支付') {
            payment.payOrder(orderId).then(resp => {
                let isOrderComplete = resp;
                if (isOrderComplete === true) {
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                }
                if (isOrderComplete === false) {
                    wx.showToast({
                        title: '支付失败',
                        icon: 'fail',
                        duration: 2000
                    })

                } else {
                    wx.showToast({
                        title: '网络错误',
                        icon: 'fail',
                        duration: 2000
                    })
                }
            });
        } else if (operationGenre === '取消订单') {
            let data = {
                orderid: orderId,
                status: 9
            }
            this.changeOrderStatus(data).then(resp => {
                let isCancel = resp;
                if (isCancel === true) {
                    wx.showToast({
                        title: '取消订单成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    wx.showToast({
                        title: '取消订单失败',
                        icon: 'fail',
                        duration: 2000
                    })
                }
            });

        } else if (operationGenre === '延长收货') {
            let data = {
                orderid: orderId,
                status: 'd'
            }
            this.changeOrderStatus(data);
        } else if (operationGenre === '确认收货') {
            let data = {
                orderid: orderId,
                status: 3
            }
            this.changeOrderStatus(data);
        }
    },

    bindPayOrder: function () {
        let that = this;
        let orderId = that.data.orderId;

        payment.payOrder(orderId);
    },

    bindCancelOrder: function () {
        let that = this;
        let orderId = that.data.orderId;
        let data = {
            orderid: orderId,
            status: 9
        }
        this.changeOrderStatus(data);
    },

    changeOrderStatus: function (data) {
        return new Promise((resolve, reject) => {
            mClient.post(api.UpdateOrderStatus, data).then(resp => {
                let result = resp.data.data.result;
                if (result === true) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        })

    },

})