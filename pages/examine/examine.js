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
		orderGenres: ['待审批', '已通过', '驳回'],
		navAfter: [],
		page: 1,
		pageSize: 30,
		orderList: [],
		loadText: '点击加载',
    selected: 0,
    orderStatus: 2
	},

	onLoad: function (options) {
		that = this;
		let searchDate = util.customFormatTime(new Date());
		that.setData({
			searchDate,
		})
		that.orderListFn(that.data.page);
	},

	orderListFn(page) {
		let pageSize = that.data.pageSize;
		let searchType = that.data.searchType;
		let searchDate = that.data.searchDate;
		let data = {
      userId: wx.getStorageSync('userID'),
			page,
      pageSize,
      orderStatus: that.data.orderStatus
			// searchDate,
			// searchType,
			// agencyId:that.data.agencyId
		};
		//内容
		mClient.wxRequest(api.Examine, data)
			.then((resp) => {
				if (resp.code == 200) {
					console.log('订货审批返回', resp);
					// let orderTotal = '';
					// if (searchType == '') {
					// 	orderTotal = resp.data.data.allCount;
					// } else if (searchType == '1') {
					// 	orderTotal = resp.data.data.overCount;
					// } else if (searchType == '2') {
					// 	orderTotal = resp.data.data.exceptionCount;
					// }
					let orderList = resp.data.list;
					let orderTotal = resp.data.total;
					// let navAfter = [];
					// navAfter.push(resp.data.navigatepageNums, resp.data.data.overCount, resp.data.data.exceptionCount);
					// that.setData({
					// 	navAfter
					// });
					this.setData({
						orderList,
            orderTotal,
            // navAfter: resp.data
					});

					if ((page * pageSize) >= orderTotal) {
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
		let page = 1;
		that.setData({
			searchDate,
			page
		})
		that.orderListFn(page);
	},

	bindOrderGenre: function (e) {
		let index = e.currentTarget.dataset.index;
		let page = 1;
		that.setData({
			page
		})
		if (index == 0) {
			this.setData({
				selected: 0,
        searchType: '',
        orderStatus: 2
			})
		} else if (index == 1) {
			this.setData({
				selected: 1,
        searchType: '1',
        orderStatus: 3
			})
		} else if (index == 2) {
			this.setData({
				selected: 2,
        searchType: '2',
        orderStatus: 0
			});
		}
		that.orderListFn(page);
	},

	bindOrderDetail: function (e) {
		let orderList = that.data.orderList;
		let index = e.currentTarget.dataset.index;
		let order = orderList[index];
		console.log(order)
		wx.navigateTo({
			url: './examineDetail/examineDetail'
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
		let page = that.data.page;
		let searchType = that.data.searchType;
		let orderTotal = that.data.orderTotal;
		let orderList = that.data.orderList;
		console.log(page, searchType);
		
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 200
		})
		console.log((page * pageSize) >= orderTotal);
		console.log(orderTotal);
		if ((page * pageSize) >= orderTotal) {
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
			page: page + 1,
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
					page: page + 1
				});
			} else {
				console.log('fail');
			}
		});
	},
})