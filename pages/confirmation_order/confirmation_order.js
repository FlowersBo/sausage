import * as mClient from '../../utils/customClient';
import * as api from '../../config/api';
import * as util from '../../utils/util';
import * as payment from '../../payment/payment';
import {
	OrderDetail,
	userContactInfo
} from '../../config/api';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderId: '',
		orderInfo: [],
		cartSelectedGoodsIds: [],
		userInfo: {},
		cartGoodsList: [],
		cartSettlement: {
			goodsSettlement: 0,
			goodsOutOfPocketExpenses: 0,
			economize: 0,
			goodsCount: 0,
			freight: 0,
			moneyPaid: 0,
		},
		orderComment: '',
		userid: 0
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		if (options.hasOwnProperty('id')) {
			this.setData({
				userid: options.id
			})
			this.renderUserContactInfo();

		} else {
			let cartSelectedGoodsIds = JSON.parse(options.cartSelectedGoodsIds);

			this.setData({
				cartSelectedGoodsIds: cartSelectedGoodsIds
			})
			this.renderUserDefaultContactInfo();
		}

		this.renderShipfee();
		this.renderCartList();
	},

	onShow: function () {
		this.renderUserContactInfo();
		this.renderShipfee();
		this.renderCartGoodsTotal();
	},

	bindSelectUserAddress: function () {
		let that = this;
		let userInfo = that.data.userInfo;
		wx.navigateTo({
			url: '../address/address?userid=' + userInfo.id,
			events: {
				// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
				acceptDataFromOpenedPage: function (data) {
					console.log(data)
					that.setData({
						userid: data.userid
					})
				},
			},

		})
	},

	renderShipfee: function () {
		let that = this;
		let cartSettlement = that.data.cartSettlement;
		mClient.get(api.Getshipfee).then(resp => {
			let freight = resp.data.data.shipfee;
			cartSettlement.freight = freight;
			this.setData({
				cartSettlement: cartSettlement,
			})
		})
	},

	renderCartList: function () {
		let that = this;
		let cartSelectedGoodsIds = that.data.cartSelectedGoodsIds;
		let cartSelectedGoodsList = [];
		mClient.get(api.ShoppingCart)
			.then(resp => {
				let cartGoodsList = resp.data.data.list;
				for (const key in cartGoodsList) {
					for (let index = 0; index < cartSelectedGoodsIds.length; index++) {
						if (cartGoodsList[key].id == cartSelectedGoodsIds[index]) {
							cartSelectedGoodsList.push(cartGoodsList[key]);
						}
					}
				} 
				this.setData({
					cartGoodsList: cartSelectedGoodsList,
				});

				this.renderCartGoodsTotal();
			});
	},

	renderCartGoodsTotal: function () {
		let that = this;
		let cartList = that.data.cartGoodsList;
		let cartSettlement = that.data.cartSettlement;
		let goodsCount = 0;
		let goodsSettlement = 0;
		let economizeTotal = 0;
		let SettlementTotal = 0;
		console.log(cartList)
		for (let index = 0; index < cartList.length; index++) {
			const price = cartList[index].price;
			const realprice = cartList[index].realprice;
			const count = cartList[index].count;
			if (count != 0) {
				let goodsPriceTotal = realprice * count;
				let economize = Number((price * count - goodsPriceTotal).toFixed(2));
				SettlementTotal += goodsPriceTotal;
				economizeTotal += economize;
				economizeTotal = Number(economizeTotal.toFixed(2));
				goodsCount += count;
				goodsSettlement += price * count;
				goodsSettlement = Number(goodsSettlement.toFixed(2));
				console.log('总金额', SettlementTotal);
				console.log('总节省金额', economizeTotal);
				console.log('总数量', goodsCount);
				console.log('商品结算', goodsSettlement);
			};
		}

		cartSettlement.goodsCount = goodsCount;
		cartSettlement.goodsSettlement = goodsSettlement;
		cartSettlement.goodsOutOfPocketExpenses = SettlementTotal;
		cartSettlement.economize = economizeTotal;
		if (cartSettlement.goodsSettlement === 0) {
			cartSettlement.moneyPaid = 0;
		} else {
			cartSettlement.moneyPaid = cartSettlement.goodsOutOfPocketExpenses + cartSettlement.freight;
			cartSettlement.moneyPaid = Number(cartSettlement.moneyPaid.toFixed(2));
		}
		console.log(cartSettlement);
		this.setData({
			cartSettlement: cartSettlement,
		});
	},

	settlementMoney: function () {

	},



	//渲染用户联系方式
	renderUserDefaultContactInfo: function () {
		let that = this;

		let data = {
			isdefault: true,
		};

		mClient.get(api.userContactInfo, data)
			.then(resp => {
				let userInfo = resp.data.data.list[0];

				this.setData({
					userInfo: userInfo,
				})
			});
	},


	//渲染用户联系方式
	renderUserContactInfo: function () {
		let that = this;
		let userid = that.data.userid;
		console.log(userid)
		let data = {
			isdefault: false,
		};

		mClient.get(api.userContactInfo, data)
			.then(resp => {
				let userInfos = resp.data.data.list;
				for (let index = 0; index < userInfos.length; index++) {
					if (userInfos[index].id === userid) {
						this.setData({
							userInfo: userInfos[index],
						})
					};
				}
			});
	},


	bindPayOrder: function () {
     wx.navigateTo({
       url: './cashierDesk/cashierDesk',
     })
    return false
		let that = this;
		let dataInfo = [{
			details: []
		}];
		let cartList = that.data.cartGoodsList;
		let cartSettlement = that.data.cartSettlement;
		let userInfo = that.data.userInfo;
		let orderComment = that.data.orderComment;

		let data = {
			quantity: cartSettlement.goodsCount,
			goodsamount: cartSettlement.moneyPaid,
			discount: cartSettlement.economize,
			orderamount: cartSettlement.moneyPaid + cartSettlement.freight,
			contactid: userInfo.id,
			memo: orderComment,
		};
		console.log('结算传参', data);
		for (let index = 0; index < cartList.length; index++) {
			const goods = cartList[index];
			dataInfo[0].details.push({
				goodsid: goods.goodsid,
				count: goods.count,
				memo: '',
			});
		}

		let obj = JSON.stringify(dataInfo);
		mClient.PostIncludeData(api.CreatGoodsOder, data, obj).then(resp => {
			let orderId = resp.data.data.orderid;

			//暂时搁置 删除购物车中以结算的商品 
			for (let index = 0; index < cartList.length; index++) {
				const goods = cartList[index];
				let data = {
					cartid: goods.id
				}

				mClient.post(api.RemoveShoppingCart, data);
			}
			//调起支付
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
				} else if (isOrderComplete === false) {
					wx.showModal({
						title: '提示',
						content: '以产生未支付订单,请前往支付',
						success: function (res) {

							if (res.confirm) { //这里是点击了确定以后            
								wx.redirectTo({
									url: '../status_details/status_details?orderId=' + orderId,
								})
							} else { //这里是点击了取消以后
								wx.navigateBack({
									delta: 1
								})
							}
						}
					})
				} else {
					wx.showToast({
						title: '网络出现错误，请重新尝试',
						icon: 'fail',
						duration: 2000
					})
					return false;
				}
			});

		})
	},

	bindOrderCommentInput: function (e) {
		this.setData({
			orderComment: e.detail.value
		})
	}

})