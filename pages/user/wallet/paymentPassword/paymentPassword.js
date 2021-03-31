// pages/user/wallet/paymentPassword/paymentPassword.js
let that;
Page({
  onLoad() {
    that = this;
  },
  onShow: function () {
    this.passwordBox = this.selectComponent('#passwordBox')
  },
  data: {
    tipText: '请输入六位数字密码',
    // 用于页面样式的
    valueIsShow: false,
    // 记录临时的值，点击按钮后再保存到对应变量中
    currentValue: '',
    firstValue: '',
    secondValue: ''
  },

  // 调用组件中的方法
  toggleValue() {
    this.setData({
      valueIsShow: !this.data.valueIsShow
    })
    this.passwordBox.toggleValue()
  },
  inputChange(e) {
    let currentValue = e.detail;
    this.setData({
      currentValue
    })
  },
  saveInputValue() {
    let value = this.data.currentValue
    if (value.length < 6) {
      return
    }
    if (this.data.firstValue == '') {
      // 调用组件中的方法，清除之前的值
      this.passwordBox.clearCurrentValue()
      this.passwordBox.toggleValue(false)
      // 重置页面初始的数据，以及文案的修改
      this.setData({
        firstValue: value,
        currentValue: '',
        valueIsShow: false,
        tipText: '请再次确认六位数数字密码'
      })
    } else {
      this.setData({
        secondValue: value
      })
      console.log('密码new', that.data.secondValue)
      console.log('密码old', that.data.firstValue)
      if (that.data.currentValue != that.data.firstValue) {
        wx.showToast({
          title: '密码不一致，请重新输入',
          icon: 'none',
          duration: 2000
        })
        this.setData({
          firstValue: '',
          currentValue: '',
          valueIsShow: false,
          tipText: '请输入六位数字密码'
        })
        this.passwordBox.clearCurrentValue()
      } else {
        console.log('提交')
      }
    }
  },
  checkPassword(e) {
    this.saveInputValue()
    console.log('验证密码...')
  },

  // 修改密码
  gotoModificationPasswrod: () => {
    wx.navigateTo({
      url: '../modificationPasswrod/modificationPasswrod',
    })
  }
})