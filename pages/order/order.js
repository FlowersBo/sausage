// pages/order/order.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: '',
        orderGenre: '',
        orderGenres: ['全部', '已完成', '异常订单'],
        pageIndex: 1,
        pageSize: 6,
        orderList: [],
        loadText: '加载中...',
        isLoad: 1,
        selected: 0,
        isSuccessfulTransaction: 0,
    },

    onLoad: function (options) {
        var that = this;
        let orderDate = that.data.date;
        let pageIndex = that.data.pageIndex;
        let pageSize = that.data.pageSize;
        let orederStatus = '';
        let date = util.customFormatTime(new Date());
        let data = {
            orderdate: date,
            status: orederStatus,
            pageindex: pageIndex,
            pagesize: pageSize
        };
        //内容
        mClient.get(api.OrderList, data)
        .then((resp) => {
            if (resp.data.code == 200) {
                pageIndex = pageIndex + 1;
                let orderTotal = resp.data.data.total;
                let orderList = resp.data.data.list;
                for (const key in orderList) {
                    let orderStatus =orderList[key].OrderStatus;
                    if(orderStatus === '完成'){
                        orderList[key].isSuccessfulTransaction = 1;
                    } else{
                        orderList[key].isSuccessfulTransaction = 0;
                    }
                }
                console.log(orderList)
                this.setData({
                    orderList: orderList,
                    pageIndex: pageIndex,
                    date: date,
                    orderTotal: orderTotal
                });

                if ((pageIndex * pageSize) > orderTotal) {
                    this.setData({
                        loadText: '已经到底了',
                        isLoad: 0,
                    });
                };

            } else {
                console.log('fail');
            }
        });
    },

    bindDateChange: function (e) {
        let that = this;
        let date = e.detail.value;
        let orderGenre = that.data.orderGenre;
        let pageIndex = 1;
        let pageSize = that.data.pageSize;
        let data = {
            orderdate: date,
            status: orderGenre,
            pageindex: pageIndex,
            pagesize: pageSize
        };

        mClient.get(api.OrderList, data).then((resp) => {
            console.log(resp);
            if (resp.data.code == 200) {
                pageIndex = pageIndex + 1;
                let orderTotal = resp.data.data.total;
                let orderList = resp.data.data.list;
                for (const key in orderList) {
                    let orderStatus =orderList[key].OrderStatus;
                    if(orderStatus === '完成'){
                        orderList[key].isSuccessfulTransaction = 1;
                    } else{
                        orderList[key].isSuccessfulTransaction = 0;
                    }
                }
                this.setData({
                    orderList: orderList,
                    pageIndex: pageIndex,
                    date: date,
                    orderTotal: orderTotal
                });

                if ((pageIndex * pageSize) > orderTotal) {
                    this.setData({
                        loadText: '已经到底了',
                        isLoad: 0,
                    });
                };

            } else {
                console.log('fail');
            }
        });
    },

    bindOrderGenre: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let orderDate = that.data.date;
        let pageSize = that.data.pageSize;
        let pageIndex = 1;
        let status = '';

        if (index == 0) {
            status = '';
            this.setData({
                selected: 0
            })
        } else if (index == 1) {
            status = 'S';
            this.setData({
                selected: 1
            })
        } else if (index == 2) {
            this.setData({
                selected: 2
            });
            status = 'E';
        }

        let data = {
            orderdate: orderDate,
            status: status,
            pageindex: pageIndex,
            pagesize: pageSize
        };
        //内容
        mClient.get(api.OrderList, data).then((resp) => {
            if (resp.data.code == 200) {
                pageIndex = pageIndex + 1;
                let orderTotal = resp.data.data.total;
                let orderList = resp.data.data.list;
                for (const key in orderList) {
                    let orderStatus =orderList[key].OrderStatus;
                    if(orderStatus === '完成'){
                        orderList[key].isSuccessfulTransaction = 1;
                    } else{
                        orderList[key].isSuccessfulTransaction = 0;
                    }
                }

                console.log(orderList)
                this.setData({
                    pageIndex: pageIndex,
                    orderList: orderList,
                    orderGenre: status,
                    orderTotal: orderTotal
                });

                if ((pageIndex * pageSize) > orderTotal) {
                    this.setData({
                        loadText: '已经到底了',
                        isLoad: 0,
                    });
                };
            } else {
                console.log('fail');
            }
        });
    },

    bindOrderDetail: function (e) {
        let that = this;
        let orders = that.data.orderList;
        let index = e.currentTarget.dataset.index;
        let order = orders[index];

        wx.navigateTo({
            url: '../order_details/order_details?id=' + order.ID + "&orderDate=" + order.OrderDate + "&isSuccessfulTransaction=" + order.isSuccessfulTransaction
        })
    },

    setLoading: function (e) {
        var that = this;
        let pageSize = that.data.pageSize;
        let orderDate = that.data.date;
        let orders = that.data.orderList;
        let pageIndex = that.data.pageindex;
        let orderGenre = that.data.orderGenre;
        let isLoad = that.data.isLoad;
        let data = {
            orderdate: orderDate,
            status: orderGenre,
            pageindex: pageIndex,
            pagesize: pageSize
        };


        if (isLoad === 0) {
            wx.showToast({
                title: '已加载完成',
                icon: 'none',
                duration: 1000
            });

            this.setData({
                loadText: '已经到底了',
                isLoad: 0,
            });
            return;
        }

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 200
        })

        mClient.get(api.OrderList, data).then((resp) => {
            console.log(resp);
            if (resp.data.code == 200) {
                this.setData({
                    orderList: orders.concat(resp.data.data.list),
                });
            } else {
                console.log('fail');
            }
        });
    },
})