// pages/user/wallet/bindingPhone/bindingPhone.js
import * as mClient from '../../../../utils/customClient';
import * as api from '../../../../config/api';
let that;
Page({
	data: {
		phoneNumber: '',
		verificationCode: '',
		isPhoneNumber: false,
		isVerifyOutTime: true,
		verificationControlText: '获取验证码',
		verificationTimeTotal: 60,
		isRepeatClick: false
	},

	// Input phone number even
	bindInputPhoneNumber: function (e) {
		let phoneNumber = e.detail.value;
		let isPhoneNumber = false;
		if ((/^1[3456789]\d{9}$/.test(phoneNumber))) {
			isPhoneNumber = true;
		} else {
			isPhoneNumber = false;
			return;
		}

		if (isPhoneNumber == true) {
			this.setData({
				phoneNumber: phoneNumber,
				isPhoneNumber: isPhoneNumber
			})
		}
	},

	// get verification code
	getVerificationCode: function () {
		let that = this;
		let phoneNumber = that.data.phoneNumber;
		let isPhoneNumber = that.data.isPhoneNumber;
		let isVerifyOutTime = that.data.isVerifyOutTime;
		let verificationTimeTotal = that.data.verificationTimeTotal;
		let startVerificationCountDown = that.startVerificationCountDown;
		let isRepeatClick = that.data.isRepeatClick;

		if (isRepeatClick == true) {
			return
		}

		if (phoneNumber.length != 11) {
			wx.showToast({
				title: '手机号有误',
				icon: 'none',
				duration: 1000
			})
			return;
		}

		if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
			wx.showToast({
				title: '手机号有误',
				icon: 'none',
				duration: 1000
			})
		}

		let data = {
			bizUserId: wx.getStorageSync('bizUserId'),
			phone: phoneNumber,
			verificationCodeType: '9'
		}

		if (isVerifyOutTime == true) {
			if (isPhoneNumber == true) {
				wx.showLoading({
					title: '验证码获取中',
				})
				mClient.PostIncludeData(api.SendVerificationCode, data)
					.then((resp) => {
						console.log(resp);
						if (resp.data.success) {
							this.setData({
								isRepeatClick: true
							})
							startVerificationCountDown(verificationTimeTotal);
							wx.showToast({
								title: '发送成功',
								icon: 'none',
								duration: 1000
							});
						} else {
							wx.showToast({
								title: resp.data.msg,
								icon: 'none',
								duration: 2000
							});
						}
						wx.hideLoading();
					});
			} else {
				wx.showToast({
					title: '手机号码格式不正确',
					icon: 'none',
					duration: 1000
				});
			}
		} else {
			wx.showToast({
				title: '请稍后重新获取验证码',
				icon: 'none',
				duration: 1000
			});
		}
	},


	// 运营商15001081726
	startVerificationCountDown: function (count) {
		if (count == 0) {
			this.setData({
				verificationControlText: '获取验证码',
				isVerifyOutTime: true,
				isRepeatClick: false
			});
			return;
		} else {
			this.setData({
				isRepeatClick: true,
				verificationControlText: count,
			});
			count = count - 1;
			setTimeout(() => {
				this.startVerificationCountDown(count)
			}, 1000);
		}
	},

	bindPhoneFn: (e) => {
		console.log('表单', e);
		let phoneNumber = e.detail.value.phone;
		let verificationCode = e.detail.value.phoneCode;
		if (!phoneNumber.length) {
			wx.showToast({
				title: '请填写手机号码',
				icon: 'none',
				duration: 1000
			});
			return;
		}
		if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
			wx.showToast({
				title: '手机号错误',
				icon: 'none',
				duration: 1000
			})
			return
		}
		if (!verificationCode.length) {
			wx.showToast({
				title: '请填写验证码',
				icon: 'none',
				duration: 1000
			});
			return;
		}
		if (verificationCode.length > 6) {
			wx.showToast({
				title: '验证码错误',
				icon: 'none',
				duration: 1000
			});
			return;
		}
		let data = {
			bizUserId: wx.getStorageSync('bizUserId'),
			phone: phoneNumber,
			verificationCode
		};
		mClient.PostIncludeData(api.BindPhone, data)
			.then((resp) => {
				console.log('绑定手机号', resp)
				if (resp.data.code == 0) {
					wx.showToast({
						title: resp.data.msg,
						icon: 'none',
						duration: 1000
					});
					setTimeout(function () {
						wx.redirectTo({
							url: '/pages/user/wallet/wallet'
						});
					}, 1500)
				}
			});
	},

	//页面加载事件
	onLoad: function () {
		that = this;
	}
})