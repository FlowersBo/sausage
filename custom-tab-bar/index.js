// custom-tab-bar/index.js
const app = getApp();
Component({
  data: {
    selected: null,
    list: []
  },
  // 生命周期
  attached() {

  },

  ready() {
    let role = '';
    let list = [{
        pagePath: "/pages/index/index",
        text: "报表",
        iconPath: "/assets/tabbar/baobiao.png",
        selectedIconPath: "/assets/tabbar/baobiao-h.png"
      },
      {
        pagePath: "/pages/pointLocation/pointLocation",
        text: "点位",
        iconPath: "/assets/tabbar/dingdan.png",
        selectedIconPath: "/assets/tabbar/dingdan-h.png"
      },
      {
        pagePath: "/pages/commodity/commodity",
        text: "商品",
        iconPath: "/assets/tabbar/shebei.png",
        selectedIconPath: "/assets/tabbar/shebei-h.png"
      },
      {
        pagePath: "/pages/order_goods/order_goods",
        text: "订货",
        iconPath: "/assets/tabbar/dinghuo.png",
        selectedIconPath: "/assets/tabbar/dinghuo-h.png"
      },
      {
        pagePath: "/pages/user/user",
        text: "我的",
        iconPath: "/assets/tabbar/menu-mine.png",
        selectedIconPath: "/assets/tabbar/menu-mine-h.png"
      }
    ];
    if (role === 'A')
      list.splice(3, 1);
    else if (role === 'B') {
      list.splice(1, 1);
      list.splice(2, 1);
    }

    console.log('当前TabBar', list);
    this.setData({
      list
    })
  },
  methods: {
    //切换tabbar
    switchTab(e) {
      const data = e.currentTarget.dataset;
      app.data.selected = data.index;
      // this.setData({
      //   selected: data.index
      // })
      const url = data.path
      wx.switchTab({
        url
      })
    }
  }
})