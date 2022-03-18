// component/pickerView/index.js
const date = new Date(); //获取系统日期
const years = []
const months = []
const days = []
const bigMonth = [1, 3, 5, 7, 8, 10, 12]

//将日期分开写入对应数组

//年
var getYear = date.getFullYear()
var getMonth = date.getMonth()
var getDate = date.getDate()
for (let i = getYear - 20; i <= getYear + 20; i++) {
  years.push(i);
}

//月
for (let i = 1; i <= 12; i++) {
  months.push(i);
}

//日
for (let i = 1; i <= 31; i++) {
  days.push(i);
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propDate: {
      type: Boolean,
    },
    isMonth: {
      type: Boolean,
    }
  },
  observers: {
    propDate(data) {

    },
  },
  // attached: function () {
  //   this.setData({
  //     region: '',
  //     pointName: '',
  //   })
  // },
  /**
   * 组件的初始数据
   */
  data: {
    years: years,
    year: getYear,
    months: months,
    month: getMonth + 1,
    days: days,
    day: getDate,
    value: [20, getMonth, getDate - 1],
    isDaytime: true,
    timeInput: '',
    propDate: false,
    isShow: false,
    isFlag: true,
    isMonth: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dateMainBtn() {
      let setYear = this.data.year;
      let setMonth = this.data.month;
      let setDay = this.data.day
      let dateTimeBody = setYear + '-' + setMonth + '-' + setDay
      let todays = this.data.isDaytime === true ? '上午' : '下午'
      // wx.setStorageSync('adminDate', dateTimeBody)
      // wx.setStorageSync('adminTodays', todays)
      this.setData({
        propDate: true,
        dateTimeBody
      })
    },

    okBtnTime() {
      console.log(this.data.isShow)
      if (this.data.isFlag) {
        let dateTimeBody;
        let format = function (num) {
          return num < 10 ? '0' + num : num
        }
        if (!this.data.isShow) {
          let setYear = this.data.year;
          let setMonth = this.data.month;
          let setDay = this.data.day
          if (this.data.isMonth)
            dateTimeBody = setYear + '-' + format(setMonth);
          else
            dateTimeBody = setYear + '-' + format(setMonth) + '-' + format(setDay);
          console.log('不选日期', dateTimeBody)
        } else {
          dateTimeBody = this.data.dateTimeBody;
        }
        this.triggerEvent('dateTimeBody', dateTimeBody);
        this.setData({
          propDate: false,
          isShow: false,
          // timeInput: wx.getStorageSync('adminDate') + wx.getStorageSync('adminTodays')
        })
      }
    },
    noBtnTime() {
      if (this.data.isFlag) {
        this.setData({
          propDate: false
        })
      }
    },
    //判断元素是否在一个数组
    contains: function (arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    },
    
    setDays: function (day) {
      const temp = [];
      for (let i = 1; i <= day; i++) {
        temp.push(i)
      }
      this.setData({
        days: temp,
      })
      
    },

    handlePickStart() {
      this.setData({
        isFlag: false
      })
    },

    handlePickEnd() {
      this.setData({
        isFlag: true
      })
    },

    //选择滚动器改变触发事件
    bindChange: function (e) {
      const val = e.detail.value;
      //判断月的天数
      const setYear = this.data.years[val[0]];
      const setMonth = this.data.months[val[1]];
      const setDay = this.data.days[val[2]];
      //闰年
      if (setMonth === 2) {
        if (setYear % 4 === 0 && setYear % 100 !== 0) {
          console.log('闰年')
          this.setDays(29);
        } else {
          console.log('非闰年')
          this.setDays(28);
        }
      } else {
        //大月
        if (this.contains(bigMonth, setMonth)) {
          this.setDays(31)
        } else {
          this.setDays(30)
        }
      }
      let dateTimeBody;
      let format = function (num) {
        return num < 10 ? '0' + num : num
      }
      if (this.data.isMonth)
        dateTimeBody = setYear + '-' + format(setMonth);
      else
        dateTimeBody = setYear + '-' + format(setMonth) + '-' + format(setDay);
      let todays = !val[3] === true ? '上午' : '下午';
      console.log('滑动');
      this.setData({
        // year: setYear,
        // month: setMonth,
        // day: setDay,
        // isDaytime: !val[3],
        dateTimeBody,
        isShow: true
      })
      // wx.setStorageSync('adminDate', dateTimeBody)
      // wx.setStorageSync('adminTodays', todays)
    },
  }
})