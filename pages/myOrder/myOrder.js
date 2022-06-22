// pages/my_order/my_order.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as payment from '../../payment/payment';
let that;
Page({
	data: {
		date: "2021-01-01",
		selected: 0,
		btn: [
			['立即支付', '取消订单'],
			['确认收货']
		],
		orderGenres: ['全部', '待付款', '待财务审核', '待发货', '待收货', '已完成', '已取消', '财务审核未通过'],
		orderStatus: '',
		pageIndex: 1,
		pageSize: 5,
		pageTotal: 0,
		orderList: [],
		loadText: '点击加载...',

		isRefresh: false,
		currentTab: 0,
	},

	tabNav(e) {
		console.log('111111111111111111111111111')
		let currentTab = e.currentTarget.dataset.index;
		let orderStatus = '';
		if (currentTab == 0) {
			orderStatus = '';
		} else if (currentTab == 1) {
			orderStatus = '1';
		} else if (currentTab == 2) {
			orderStatus = '22';
		} else if (currentTab == 3) {
			orderStatus = '3';
		} else if (currentTab == 4) {
			orderStatus = '4';
		} else if (currentTab == 5) {
			orderStatus = '5';
		} else if (currentTab == 6) {
			orderStatus = '0';
		} else if (currentTab == 7) {
			orderStatus = '20';
		}
		this.setData({
			currentTab,
			pageIndex: 1,
			orderStatus,
			orderList: []
		})
		// this.renderOrderList();
	},

	handleSwiper(e) {
		console.log('22222222222222222222222')
		let {
			current,
			source
		} = e.detail;
		console.log(e)
		if (source === 'autoplay' || source === 'touch') {
			const currentTab = current;
			let orderStatus = '';
			if (currentTab == 0) {
				orderStatus = '';
			} else if (currentTab == 1) {
				orderStatus = '1';
			} else if (currentTab == 2) {
				orderStatus = '22';
			} else if (currentTab == 3) {
				orderStatus = '3';
			} else if (currentTab == 4) {
				orderStatus = '4';
			} else if (currentTab == 5) {
				orderStatus = '5';
			} else if (currentTab == 6) {
				orderStatus = '0';
			} else if (currentTab == 7) {
				orderStatus = '20';
			}
			this.setData({
				currentTab,
				pageIndex: 1,
				orderStatus,
				orderList: []
			})
		}
		this.renderOrderList();
	},

	handleTolower(e) {
		console.log(that.data.pageTotal <= (that.data.pageIndex * that.data.pageSize))
		if (that.data.pageTotal <= that.data.pageIndex * that.data.pageSize) {
			wx.showToast({
				title: '到底啦',
				icon: 'none'
			})
		} else {
			that.setData({
				pageIndex: that.data.pageIndex + 1,
			})
			this.renderOrderList();
		}
	},
	refresherpulling() {
		wx.showLoading({
			title: '刷新中',
			icon: 'none'
		})
		this.setData({
			isRefresh: false,
			pageIndex: 1,
			orderStatus: '',
			orderList: []
		})
		this.renderOrderList();
	},

	renderOrderList: function () {
		let that = this;
		let btn = that.data.btn;
		let data = {
			userId: wx.getStorageSync('userID'),
			orderStatus: that.data.orderStatus,
			orderNo: '',
			page: that.data.pageIndex,
			pagesize: that.data.pageSize
		}
		mClient.wxRequest(api.Examine, data).then(resp => {
			console.log('订货列表', resp)
			let orderList = that.data.orderList.concat(resp.data.list);

			orderList.forEach(element => {
				element.orderStatus = parseInt(element.orderStatus);
				// const orderTime = parseInt(element.orderdate);
				// element.orderTime = util.customFormatTime(new Date(orderTime));
				// element.settlementPrice = element.goodsamount;
				if (element.orderStatus == 1) {
					//判断订单是否已延长收货，是则移除收货按钮，并更改订单显示状态
					// showbtn.splice(0, 1);
					element.btn = btn[0];
				} else if (element.orderStatus == 4) {
					element.btn = btn[1];
				} else {
					element.btn = [];
				}
			});

			this.setData({
				orderList,
				pageTotal: resp.data.total
			})
		})
	},

	bindOperationOrder: function (e) {
		let that = this;
		let orderList = that.data.orderList;
		let orderId = e.currentTarget.dataset.orderid;
		let operationGenre = e.currentTarget.dataset.operationgenre;
		let payPrice = e.currentTarget.dataset.payprice;
		let data = {};
		if (operationGenre === '立即支付') {
			wx.navigateTo({
				url: '../confirmation_order/cashierDesk/cashierDesk?orderId=' + orderId + '&totalPrice=' + payPrice,
			})
		} else if (operationGenre === '取消订单') {
			wx.showModal({
				title: '提示',
				content: '确定取消当前订单吗',
				success(res) {
					if (res.confirm) {
						data = {
							orderid: orderId,
							orderStatus: 9
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
				orderStatus: 'd'
			}
			this.changeOrderStatus(data);
		} else if (operationGenre === '确认收货') {
			data = {
				orderid: orderId,
				orderStatus: 3
			}
			this.changeOrderStatus(data);
		}
	},

	// changeOrderStatus: function (data) {
	// 	mClient.post(api.UpdateOrderStatus, data).then(resp => {
	// 		let result = resp.data.data.result;
	// 		if (result === true) {
	// 			this.renderOrderList();
	// 			wx.showToast({
	// 				title: '成功',
	// 				icon: 'success',
	// 				duration: 2000
	// 			})
	// 		} else {
	// 			wx.showToast({
	// 				title: '异常',
	// 				icon: 'fail',
	// 				durat
	// 			});
	// 		}
	// 	});
	// },

	bindOrderDetail: function (e) {
		let orderId = e.currentTarget.dataset.orderid;
		wx.navigateTo({
			url: '../status_details/status_details?orderId=' + orderId,
		})
	},

	/** 
	 * 生命周期函数--监听页面加载 
	 */
	onLoad: function (options) {
		that = this;
	}, 

	onShow: function () {
		this.setData({
			pageIndex: 1,
			orderList: []
		})
		this.renderOrderList();
	},

	// setLoading: function () {
	// 	let that = this;
	// 	let pageIndex = that.data.pageIndex;
	// 	let pageSize = that.data.pageSize;
	// 	let btn = that.data.btn;
	// 	let orderStatus = that.data.orderStatus;
	// 	let pageTotal = that.data.pageTotal;
	// 	console.log("second == " + pageTotal);
	// 	if ((pageIndex * pageSize) > pageTotal) {
	// 		wx.showToast({
	// 			title: '已经到底了',
	// 			icon: 'none',
	// 			duration: 1000
	// 		});
	// 		return;
	// 	};

	// 	pageIndex = pageIndex + 1;
	// 	let data = {
	// 		orderStatus: orderStatus,
	// 		pageindex: pageIndex,
	// 		pagesize: pageSize
	// 	}
	// 	wx.showLoading({
	// 		title: '加载中',
	// 	})
	// 	console.log("second access");
	// 	mClient.get(api.GetGoodsOder, data).then(resp => {
	// 		let ol = resp.data.data.list.list;
	// 		for (let index = 0; index < ol.length; index++) {
	// 			const orderStatus = parseInt(ol[index].statuscode);
	// 			ol[index].orderStatus = orderStatus;

	// 			const orderTime = parseInt(ol[index].orderdate);
	// 			ol[index].orderTime = util.customFormatTime(new Date(orderTime));

	// 			ol[index].settlementPrice = ol[index].goodsamount;

	// 			if (orderStatus <= 2) {
	// 				//判断订单是否已延长收货，是则移除收货按钮，并更改订单显示状态
	// 				let showbtn = btn[orderStatus].concat();
	// 				if (ol[index].isextenddelivery == true && orderStatus == 2) {
	// 					showbtn.splice(0, 1);
	// 					ol[index].orderStatus = '延长发货'
	// 				}
	// 				ol[index].btn = showbtn;

	// 			} else {
	// 				ol[index].btn = [];
	// 			}
	// 		}
	// 		this.setData({
	// 			orderList: that.data.orderList.concat(ol),
	// 			pageIndex: resp.data.data.list.pageNum,
	// 			pageTotal: resp.data.data.list.total
	// 		});

	// 		wx.hideLoading();
	// 	}, );

	// },

})