// component/navigationBar/navigationBar.js
const app = getApp()

Component({
  properties: {
    text: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    },
    isNav: {
      type: Boolean,
      value: false
    },
    pointName: {
      type: String,
      value: ''
    },
    region: {
      type: String,
      value: ''
    },
  },

  // attached: function () {
  //   this.setData({
  //     region: '',
  //     pointName: '',
  //   })
  // },

  // observers: {
  //   region(data) {},
  //   pointName() {}
  // },

  data: {
    statusBarHeight: app.globalData.StatusBar + 'px',
    navigationBarHeight: (app.globalData.StatusBar + 44) + 'px',
    Custom: app.globalData.Custom,
    region: '',
  },

  methods: {
    backHome: function () {
      let pages = getCurrentPages(); //页面栈 返回几层
      console.log(pages)
      wx.reLaunch({
        url: '/pages/home/home',
      })
      // wx.navigateBack({
      //   delta: getCurrentPages().length
      // })
    },
    back: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    bindRegionChange: function (e) {
      this.triggerEvent('city', {
        region: e.detail.value,
        regionCode: e.detail.code
      })
      this.setData({
        region: e.detail.value[2]
      })
    },
    bindSearch(e) {
      this.triggerEvent('searchVal', {
        val: e.detail.value
      })
    },
    searchValue(e) {
      this.setData({
        pointName: e.detail.value
      })
      this.triggerEvent('searchVal', {
        val: e.detail.value
      })
    },
    // searchFn(e) {
    //   console.log(e)
    //   this.triggerEvent('searchVal', {
    //     val: this.data.pointName
    //   })
    // },
  }
})