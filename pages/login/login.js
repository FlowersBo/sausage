import * as mClient from '../../utils/customClient';

Page({ //18601969342
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
		this.setData({
			phoneNumber: (e.detail.value).trim()
		})
		// let isPhoneNumber = false;
		//is out of rang phone number  
		// if (phoneNumber.length > 11) {
		// 	wx.showToast({
		// 		title: '手机号有误',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return;
		// }
		// //is qualified phone number
		// if ((/^1[3456789]\d{9}$/.test(phoneNumber))) {
		// 	isPhoneNumber = true;
		// } else {
		// 	isPhoneNumber = false;
		// 	return;
		// }

		// if (isPhoneNumber == true) {
		// this.setData({
		// 	phoneNumber: phoneNumber,
		// 	isPhoneNumber: isPhoneNumber
		// })
		// }
	},
	bindInputPassword(e) {
		this.setData({
			password: e.detail.value
		})
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

		// if (phoneNumber.length != 11) {
		// 	wx.showToast({
		// 		title: '手机号有误',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// 	return;
		// }

		// if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
		// 	wx.showToast({
		// 		title: '手机号格式有误',
		// 		icon: 'none',
		// 		duration: 1000
		// 	})
		// }

		let data = {
			username: parseInt(phoneNumber)
		}

		if (isVerifyOutTime == true) {
			if (isPhoneNumber == true) {
				wx.showLoading({
					title: '验证码获取中',
				})
				mClient.getVerificationCode(data)
					.then((resp) => {
						console.log(resp);
						if (resp.data.code == '200') {
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
								title: '该手机号未经管理员授权',
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

	bindInputVerificationCode: function (e) {
		let verificationCode = e.detail.value;
		this.setData({
			verificationCode: verificationCode
		});
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

	startLogin: function () {
		let that = this;
		let phoneNumber = that.data.phoneNumber;
		//let verificationCode = that.data.verificationCode;
		let password = that.data.password;
		if (phoneNumber.length == 0) {
			wx.showToast({
				title: '请填写手机号码',
				icon: 'none',
				duration: 1000
			});
			return;
		}
		if (!password) {
			wx.showToast({
				title: '请输入密码',
				icon: 'none',
				duration: 1000
			});
			return;
		}

		// if (verificationCode.length == 0) {
		// 	wx.showToast({
		// 		title: '请填写验证码',
		// 		icon: 'none',
		// 		duration: 1000
		// 	});
		// 	return;
		// }
		mClient.login()
			.then(res => {
				let loginInfo = {
					username: phoneNumber,
					//smscode: verificationCode
					password: password,
					code: res
				};
				mClient.loginPhone(loginInfo)
					.then((resp) => {
						console.log('登录返回', resp);
						if (resp.data.code == 200) {
							wx.setStorageSync('userID', resp.data.data.info.id);
							wx.setStorageSync('roles', resp.data.data.roles);
							let deviceType = resp.data.data.deviceType;
							console.log('数量',Object.keys(deviceType).length)
							for (const key in deviceType) {
								if (Object.hasOwnProperty.call(deviceType, key)) {
									const element = deviceType[key];
									if(Object.keys(deviceType).length==1){
										wx.setStorageSync('facilityName', element);
										if(element==='自助烤肠机'){
											wx.reLaunch({
												url: '/pages/index/index'
											});
										}else{
											wx.reLaunch({
												url: '/pages/childDetail/childIndex/childIndex'
											});
										}
									}else{
										wx.reLaunch({
											url: '/pages/selectFacility/selectFacility?deviceType='+encodeURIComponent(JSON.stringify(deviceType))
										});
										return
									}
								}
							}
						} else {
							wx.showToast({
								title: resp.data.message,
								icon: 'none',
								duration: 1000
							});
						}
					});
			})
			.catch(err => {
				wx.showToast({
					title: '请稍后重试',
					icon: 'none',
					duration: 2000
				})
			})
	},

	// 跳转页面测试用
	gotoBtnView: function () {
		wx.reLaunch({
			url: '../index/index'
		})
	},

	// 18611096738  密码123321
	//页面加载事件
	onLoad: function () {
		mClient.refreshToken()
			.then(resp => {
				console.log(resp)
				if (resp.data.code == 200) {
					console.log('登录信息未过期，自动登录');
					if(wx.getStorageSync('facilityName')==='自助烤肠机'){
						wx.reLaunch({
							url: '/pages/index/index',
						});
					}else{
						wx.reLaunch({
							url: '/pages/childDetail/childIndex/childIndex',
						});
					}
				}
				wx.hideLoading();
			})
			.catch(rej => {
				console.log(rej)
			})
	}
})