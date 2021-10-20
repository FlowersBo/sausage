import * as api from '../config/api.js';

function request(url, data = {}, method = "GET") {

	let param = objectToJsonParams(data);
	console.log(param);
	return new Promise(function (resolve, reject) {
		console.log(url + param)
		wx.request({
			url: url + param,
			method: method,
			header: {
				'charset': 'utf-8',
				'Content-Type': 'application/json',
				'app-access-token': wx.getStorageSync('accessToken')
			},
			success: function (resp) {
				console.log('success',resp);
				if (resp.data.code === 200) {
					resolve(resp);
				} else {
					reject(resp.errMsg);
				}

				//Unauthorized
				if (resp.data.code === 401) {
					refreshToken().then((resp) => {
						if (resp.data.code === 200) {
							request(url, data, method).then((resp) => {
								resolve(resp);
							});
						} else {
							reject(resp);
						}
					});
				} else {
					resolve(resp.data);
				}
			},
			fail: function (err) {
				reject(err)
				console.log("failed")
			}
		})
	});
}

function PostIncludeData(url, data = {}, dataInfo = {}, method = "POST") {

	let param = objectToJsonParams(data);
	return new Promise(function (resolve, reject) {
		console.log(url + param)
		wx.request({
			url: url + param,
			data: dataInfo,
			method: method,
			header: {
				'charset': 'utf-8',
				'Content-Type': 'application/json',
				'app-access-token': wx.getStorageSync('accessToken')
			},
			success: function (resp) {
				console.log("success");
				// console.log(resp);
				if (resp.statusCode == 200) {
					resolve(resp);
				} else {
					reject(resp.errMsg);
				}

				//Unauthorized
				if (resp.data.code === 401) {
					refreshToken().then((resp) => {
						if (resp.data.code === 200) {
							request(url, data, method).then((resp) => {
								resolve(resp);
							});
						} else {
							reject(resp);
						}
					})
					.catch(rej=>{})
				} else {
					resolve(resp.data);
				}
			},
			fail: function (err) {
				reject(err)
				console.log("failed")
			}
		})
	});
}

//Get Method
function get(url, data = {}) {
	return request(url, data, 'GET')
}

//Post Method
function post(url, data = {}) {
	return request(url, data, 'POST')
}


//get verification code
function getVerificationCode(data = {}) {
	let param = objectToJsonParams(data);

	return new Promise(function (resolve, reject) {
		wx.request({
			url: api.VerificationCode + param,
			method: 'Post',
			header: {
				'Content-Type': 'application/json',
			},
			success: function (resp) {
				resolve(resp);
			},
			fail: function (err) {
				reject(err);
			}
		})
	});
}

//phone login
function loginPhone(loginInfo = {}) {
	let param = objectToJsonParams(loginInfo);
	return new Promise(function (resolve, reject) {
		wx.request({
			url: api.Login + param,
			method: 'Post',
			header: {
				'Content-Type': 'application/json',
			},
			success: function (resp) {
				if (resp.data.code == 200) {
					wx.setStorageSync('accessToken', resp.data.data.access_token);
					wx.setStorageSync('refreshToken', resp.data.data.refresh_token);
				}
				resolve(resp);
			},
			fail: function (err) {
				reject(err);
			}
		})
	});
}

//refresh Token
function refreshToken() {
	return new Promise(function (resolve, reject) {
		wx.request({
			url: api.RefreshAuth,
			method: 'Post',
			header: {
				'app-refresh-token': wx.getStorageSync('refreshToken'),
				'app-access-token': wx.getStorageSync('accessToken'),
				'grant-type': 'refresh-token',
			},
			success: function (resp) {
				if (resp.data.code == 200) {
					wx.setStorageSync('accessToken', resp.data.data.access_token);
					wx.setStorageSync('refreshToken', resp.data.data.refresh_token);
				}
				resolve(resp);
			},
			fail: function (err) {
				reject(err);
			}
		})
	});
}

//redirect
function redirect(url) {
	//判断页面是否需要登录
	if (false) {
		wx.redirectTo({
			url: 'login'
		});
		return false;
	} else {
		wx.redirectTo({
			url: url
		});
	}
}

//is Check session behind time
function checkSession() {
	return new Promise(function (resolve, reject) {
		wx.checkSession({
			success: function () {
				resolve(true);
			},
			fail: function () {
				reject(false);
			}
		})
	});
}

//wx login
function login() {
	return new Promise(function (resolve, reject) {
		wx.login({
			success: function (res) {
				if (res.code) {
					resolve(res.code);
				} else {
					reject(res);
				}
			},
			fail: function (err) {
				reject(err);
			}
		});
	});
}

//wx get user info
function getUserInfo() {
	return new Promise(function (resolve, reject) {
		wx.getUserInfo({
			withCredentials: true,
			success: function (res) {
				if (res.detail.errMsg === 'getUserInfo:ok') {
					resolve(res);
				} else {
					reject(res)
				}
			},
			fail: function (err) {
				reject(err);
			}
		})
	});
}

function getInfo() {
	return new Promise(function (resolve, reject) {
		wx.request({
			url: api.Info,
			method: 'Get',
			header: {
				'app-access-token': wx.getStorageSync('accessToken')
			},
			success: function (resp) {
				resolve(resp);
			},
			fail: function (err) {
				reject(err);
			}
		});
	});
}

//error show
function showErrorToast(msg) {
	wx.showToast({
		title: msg,
		image: '.png'
	})
}

function objectToJsonParams(data = {}) {
	var arr = Object.keys(data);
	if (arr === 0) {
		return '';
	} else {
		let params = '?' + JSON.stringify(data).replace(/{/g, '').replace(/}/g, '').replace(/:/g, '=').replace(/\"/g, '').replace(/\,/g, '&');
		return params;
	}
}

let allSettled = (funcArr) => {
  return new Promise((resolve) => {
    let sttled = 0
    let result = []
    for(let index = 0;index<funcArr.length;index++){
      const element = funcArr[index]
      element
      .then(res => { 
        result[index] = {
          status: 'fulfilled',
          value: res
        }
      })
      .catch(err => { 
        result[index] = {
          status: 'rejected',
          reason: err
        }
      })
      .finally(() => { ++sttled === funcArr.length && resolve(result) })
    }
  })
};

module.exports = {
	PostIncludeData,
	request,
	get,
	post,
	redirect,
	showErrorToast,
	checkSession,
	login,
	loginPhone,
	getUserInfo,
	refreshToken,
	getVerificationCode,
	getInfo,
	allSettled
}