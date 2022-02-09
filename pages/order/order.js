// pages/order/order.js
import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
let that;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		searchType: '',
		orderGenres: ['全部', '已完成', '异常订单'],
		navAfter: [],
		pageNum: 1,
		pageSize: 30,
		orderList: [],
		loadText: '点击加载',
		selected: 0,
		ballList:[],
		agencyId:''
	},
	 //组件监听选项
	 bindBallFn(e) {
		wx.showToast({
		  title: '当前选择：'+e.detail.agencyName,
		  icon: 'none',
		  duration: 2000
		});
		wx.setStorageSync('agencySelect', e.detail.agencyId)
		let page = 1
		that.setData({
		  pageNum:page,
		  agencyId: e.detail.agencyId
		})
		that.orderListFn(page);
	  },

	onLoad: function (options) {
		that = this;
		let searchDate = util.customFormatTime(new Date());
		that.setData({
			searchDate,
			ballList:wx.getStorageSync('agencyList'),
			agencyId:wx.getStorageSync('agencySelect')
		})
		that.orderListFn(that.data.pageNum);
	},

	orderListFn(pageNum) {
		let pageSize = that.data.pageSize;
		let searchType = that.data.searchType;
		let searchDate = that.data.searchDate;
		let data = {
			pageNum,
			pageSize,
			searchDate,
			searchType,
			agencyId:that.data.agencyId
		};
		//内容
		mClient.get(api.OrderList, data)
			.then((resp) => {
				if (resp.data.code == 200) {
					console.log('订单返回', resp);
					let orderTotal = '';
					if (searchType == '') {
						orderTotal = resp.data.data.allCount;
					} else if (searchType == '1') {
						orderTotal = resp.data.data.overCount;
					} else if (searchType == '2') {
						orderTotal = resp.data.data.exceptionCount;
					}
					let orderList = resp.data.data.list.list;
					let navAfter = [];
					navAfter.push(resp.data.data.allCount, resp.data.data.overCount, resp.data.data.exceptionCount);
					that.setData({
						navAfter
					});
					for (const key in orderList) {
						let orderStatus = orderList[key].orderStatus;
						if (orderStatus === 'S') {
							orderList[key].orderStatus = '支付成功'
						} else if (orderStatus === 'E') {
							orderList[key].orderStatus = '支付异常'
						} else if (orderStatus = 'SE') {
							orderList[key].orderStatus = '已退款'
						}
					}
					console.log(orderList)
					this.setData({
						orderList,
						orderTotal
					});

					if ((pageNum * pageSize) >= orderTotal) {
						that.setData({
							loadText: '已经到底了',
						});
					}else{
						that.setData({
							loadText: '点击加载',
						});
					};

				} else {
					console.log('fail');
				}
			});
	},


	bindDateChange: function (e) {
		let searchDate = e.detail.value;
		let pageNum = 1;
		that.setData({
			searchDate,
			pageNum
		})
		that.orderListFn(pageNum);
	},

	bindOrderGenre: function (e) {
		let index = e.currentTarget.dataset.index;
		let pageNum = 1;
		that.setData({
			pageNum
		})
		if (index == 0) {
			this.setData({
				selected: 0,
				searchType: ''
			})
		} else if (index == 1) {
			this.setData({
				selected: 1,
				searchType: '1'
			})
		} else if (index == 2) {
			this.setData({
				selected: 2,
				searchType: '2'
			});
		}
		that.orderListFn(pageNum);
	},

	bindOrderDetail: function (e) {
		let orderList = that.data.orderList;
		let index = e.currentTarget.dataset.index;
		let order = orderList[index];
		console.log(order)
		wx.navigateTo({
			url: '../order_details/order_details?id=' + order.id + "&orderDate=" + order.orderDate
		})
	},

	// 刷新
	onPullDownRefresh: function () {
		console.log("下拉刷新")
		// 显示顶部刷新图标  
		wx.showNavigationBarLoading();


		wx.hideNavigationBarLoading();
		wx.stopPullDownRefresh();
	},

	//加载
	setLoading: function (e) {
		let pageSize = that.data.pageSize;
		let searchDate = that.data.searchDate;
		let pageNum = that.data.pageNum;
		let searchType = that.data.searchType;
		let orderTotal = that.data.orderTotal;
		let orderList = that.data.orderList;
		console.log(pageNum, searchType);
		
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 200
		})
		console.log((pageNum * pageSize) >= orderTotal);
		console.log(orderTotal);
		if ((pageNum * pageSize) >= orderTotal) {
			wx.showToast({
				title: '已加载完成',
				icon: 'none',
				duration: 1000
			});
			this.setData({
				loadText: '已经到底了',
			});
			return;
		}
		let data = {
			searchDate,
			searchType,
			pageNum: pageNum + 1,
			pageSize,
			agencyId:that.data.agencyId
		};
		mClient.get(api.OrderList, data).then((resp) => {
			console.log(resp);
			if (resp.data.code == 200) {
				let navAfter = that.data.navAfter;
				if (navAfter.length <= 0) {
					navAfter.push(resp.data.data.allCount, resp.data.data.overCount, resp.data.data.exceptionCount);
				}
				that.setData({
					navAfter
				});
				for (const key in resp.data.data.list.list) {
					let orderStatus = resp.data.data.list.list[key].orderStatus;
					if (orderStatus === 'S') {
						resp.data.data.list.list[key].orderStatus = '支付成功'
					} else if (orderStatus === 'E') {
						resp.data.data.list.list[key].orderStatus = '支付异常'
					} else if (orderStatus = 'SE') {
						resp.data.data.list.list[key].orderStatus = '已退款'
					}
				}
				this.setData({
					orderList: orderList.concat(resp.data.data.list.list),
					pageNum: pageNum + 1
				});
			} else {
				console.log('fail');
			}
		});
	},
})