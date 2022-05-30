// pages/my_order/my_order.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as payment from '../../payment/payment';
Page({

	data: {
		date: "2016-09-01",
		selected: 0,
		btn: [
			['立即支付', '取消订单'],
			['取消订单'],
			['延长收货', '确认收货']
		],
		orderGenres: ['全部', '待付款', '待发货', '待收货', '已完成'],
		status: '',
		pageIndex: 1,
		pageSize: 5,
		pageTotal: 0,
		orderList: [],
		loadText: '点击加载...'
	},

	//tab框 
	bindOrderGenre: function (e) {
		console.log(e)
		let that = this
		let index = e.currentTarget.dataset.index;
		let status = '';
		console.log(index)
		if (index == 0) {
			status = '';
		} else if (index == 1) {
			status = '0';
		} else if (index == 2) {
			status = '1';
		} else if (index == 3) {
			status = '2';
		} else if (index == 4) {
			status = '3';
		}


		this.setData({
			selected: index,
			pageIndex: 1,
			pageSize: 5,
			status: status
		})

		this.renderOrderList();
	},

	renderOrderList: function () {
		let that = this;
		let pageIndex = that.data.pageIndex;
		let pageSize = that.data.pageSize;
		let btn = that.data.btn;
		let status = that.data.status;

		let data = {
			status: status,
			pageindex: pageIndex,
			pagesize: pageSize
		}
		console.log("first access");
		mClient.get(api.GetGoodsOder, data).then(resp => {
			let orderList = resp.data.data.list.list;
			for (let index = 0; index < orderList.length; index++) {
				const orderStatus = parseInt(orderList[index].statuscode);
				orderList[index].orderStatus = orderStatus;

				const orderTime = parseInt(orderList[index].orderdate);
				orderList[index].orderTime = util.customFormatTime(new Date(orderTime));

				orderList[index].settlementPrice = orderList[index].goodsamount;

				if (orderStatus <= 2) {
					//判断订单是否已延长收货，是则移除收货按钮，并更改订单显示状态
					let showbtn = btn[orderStatus].concat();
					if (orderList[index].isextenddelivery == true && orderStatus == 2) {
						showbtn.splice(0, 1);
						orderList[index].status = '延长发货'
					}
					orderList[index].btn = showbtn;

				} else {
					orderList[index].btn = [];
				}
			}

			this.setData({
				orderList: orderList,
				pageIndex: resp.data.data.list.pageNum,
				pageTotal: resp.data.data.list.total
			})
		})
	},

	bindOperationOrder: function (e) {
		let that = this;
		let orderList = that.data.orderList;
		let orderId = e.currentTarget.dataset.orderid;
		let operationGenre = e.currentTarget.dataset.operationgenre;
		let data = {};
		if (operationGenre === '立即支付') {
			payment.payOrder(orderId);
		} else if (operationGenre === '取消订单') {
			wx.showModal({
				title: '提示',
				content: '确定取消当前订单吗',
				success(res) {
					if (res.confirm) {
						data = {
							orderid: orderId,
							status: 9
						}
						that.changeOrderStatus(data);
						for (let index = 0; index < orderList.length; index++) {
							if (orderList[index].id === orderId) {
								orderList.slice(index, 1);
							}
						}
						that.setData({
							orderList: orderList
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		} else if (operationGenre === '延长收货') {
			data = {
				orderid: orderId,
				status: 'd'
			}
			this.changeOrderStatus(data);
		} else if (operationGenre === '确认收货') {
			data = {
				orderid: orderId,
				status: 3
			}
			this.changeOrderStatus(data);
		}
	},

	changeOrderStatus: function (data) {
		mClient.post(api.UpdateOrderStatus, data).then(resp => {
			let result = resp.data.data.result;
			if (result === true) {
				this.renderOrderList();
				wx.showToast({
					title: '成功',
					icon: 'success',
					duration: 2000
				})
			} else {
				wx.showToast({
					title: '异常',
					icon: 'fail',
					durat
				});
			}
		});
	},

	bindNavigateOrderDetail: function (e) {
		let orderId = e.currentTarget.dataset.orderid;
		wx.navigateTo({
			url: '../status_details/status_details?orderId=' + orderId,
		})
	},
	/** 
	 * 生命周期函数--监听页面加载 
	 */
	onLoad: function (options) {
		// this.renderOrderList();
		let a = '0',
			b = '1',
			c = [0, 1, 2, 3];
		c.forEach(element => {
			let d = parseInt(a + element);
			let e = parseInt(b + element);
			console.log('d', d);
			console.log('e', e);
		});

	},

	onShow: function () {
		this.renderOrderList();
	},
	setLoading: function () {
		let that = this;
		let pageIndex = that.data.pageIndex;
		let pageSize = that.data.pageSize;
		let btn = that.data.btn;
		let status = that.data.status;
		let pageTotal = that.data.pageTotal;
		console.log("second == " + pageTotal);
		if ((pageIndex * pageSize) > pageTotal) {
			wx.showToast({
				title: '已经到底了',
				icon: 'none',
				duration: 1000
			});
			return;
		};

		pageIndex = pageIndex + 1;
		let data = {
			status: status,
			pageindex: pageIndex,
			pagesize: pageSize
		}
		wx.showLoading({
			title: '加载中',
		})
		console.log("second access");
		mClient.get(api.GetGoodsOder, data).then(resp => {
			let ol = resp.data.data.list.list;
			for (let index = 0; index < ol.length; index++) {
				const orderStatus = parseInt(ol[index].statuscode);
				ol[index].orderStatus = orderStatus;

				const orderTime = parseInt(ol[index].orderdate);
				ol[index].orderTime = util.customFormatTime(new Date(orderTime));

				ol[index].settlementPrice = ol[index].goodsamount;

				if (orderStatus <= 2) {
					//判断订单是否已延长收货，是则移除收货按钮，并更改订单显示状态
					let showbtn = btn[orderStatus].concat();
					if (ol[index].isextenddelivery == true && orderStatus == 2) {
						showbtn.splice(0, 1);
						ol[index].status = '延长发货'
					}
					ol[index].btn = showbtn;

				} else {
					ol[index].btn = [];
				}
			}
			this.setData({
				orderList: that.data.orderList.concat(ol),
				pageIndex: resp.data.data.list.pageNum,
				pageTotal: resp.data.data.list.total
			});

			wx.hideLoading();
		}, );

	},

})