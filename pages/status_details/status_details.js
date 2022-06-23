import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as payment from '../../payment/payment';
import {
	OrderDetail
} from '../../config/api';
let that;
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
		that = this;
		// if (options.hasOwnProperty('orderId')) {
		// 	orderId = options.orderId;
		// }
		that.setData({
			orderId: options.orderId
		})
	},

	onShow() {
		that.orderDetailFn();
	},

	orderDetailFn() {
		let data = {
			orderId: that.data.orderId
		};
		mClient.get(api.GoodsOrderDetail, data).then(resp => {
			console.log('订单详情', resp)
			// orderInfo.settleAccounts = orderInfo.goodsamount; // + orderInfo.shipfee
			// orderInfo.orderTime = util.formatTime(new Date(orderInfo.orderdate));

			// if (orderInfo.isextenddelivery == true && orderInfo.statuscode == '2') {
			// 	orderInfo.status = '延长发货'
			// }

			this.setData({
				orderId: that.data.orderId,
				orderInfo: resp.data.data.orderInfo,
				orderDetail: resp.data.data.orderDetail,
				storeInfo: resp.data.data.storeInfo,
				payPrice: resp.data.data.orderInfo.payPrice
			})
			// this.renderUserContactInfo();
			this.renderBtn(resp.data.data.orderInfo);
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

	//订单状态，0未通过1待支付2待审核20财务审核未通过22待财务审核3待运营审核4待确认5部分确认6已完成
	renderBtn: function (orderInfo) {
		let orderStatus = orderInfo.orderStatus;
		// orderStatus = 20;
		if (orderStatus == 1) {
			this.setData({
				btnGenre: ['立即支付', '取消订单'],
			})
		} else if (orderStatus == 20) {
			this.setData({
				btnGenre: ['上传凭证']
			})
		} else if (orderStatus == 4) {
			this.setData({
				btnGenre: ['确认收货']
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
		let operationGenre = e.currentTarget.dataset.operationgenre;
		if (operationGenre === '立即支付') {
			wx.navigateTo({
				url: '../confirmation_order/cashierDesk/cashierDesk?orderId=' + orderId + '&totalPrice=' + that.data.orderInfo.payPrice,
			})
		} else if (operationGenre === '取消订单') {
			wx.showModal({
				title: '提示',
				content: '确定取消当前订单吗',
				success(res) {
					if (res.confirm) {
						let data = {
							orderId
						}
						mClient.get(api.CancelOrder, data).then(resp => {
								console.log(resp)
								if (resp.data.code == 200) {
									wx.showToast({
										title: '取消订单成功',
										icon: 'none',
										duration: 2000
									})
									wx.navigateBack({
										delta: 1
									})
								}
							})
							.catch(err => {
								wx.showToast({
									title: err.data.msg,
									icon: 'none',
									duration: 2000
								})
							})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})

		} else if (operationGenre === '确认收货') {
			wx.showModal({
				title: '提示',
				content: '是否确认收货',
				success(res) {
					if (res.confirm) {
						mClient.wxRequest(api.OrderDeliver, {
								orderId,
								userId: wx.getStorageSync('userID')
							}).then(resp => {
								console.log(resp)
								if (resp.data == 200) {
									wx.showToast({
										title: '确认收货成功',
										icon: 'none',
										duration: 2000
									})
								} else {
									wx.showToast({
										title: resp.msg,
										icon: 'none',
										duration: 2000
									})
								}
							})
							.catch(err => {
								wx.showToast({
									title: err.data.msg,
									icon: 'none',
									duration: 2000
								})
							})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
		} else if (operationGenre === '上传凭证') {
			wx.navigateTo({
				url: '../voucher/voucher?orderId=' + orderId + '&payPrice=' + that.data.payPrice,
			})
		}
	},

	bindPayOrder: function () {
		let that = this;
		let orderId = that.data.orderId;
		payment.payOrder(orderId);
	},
})