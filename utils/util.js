const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const customFormatTime = date => {
  let converedDate = new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();

  return [year, month, day].map(formatNumber).join('-');
}

const customFormatMonth = date => {
  let converedDate = new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();

  return [year, month].map(formatNumber).join('');
}

const customFormatOnlyMonthDay = date => {
  let converedDate = new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();

  return [month, day].map(formatNumber).join('.');
}

const customFormatOnlyMonth = date => {
  let converedDate = new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();

  return [month].map(formatNumber) + '月';
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 13位时间戳毫秒不用乘以1000
function timestampToTimeLong(timestamp) {
  let date = new Date(parseInt(timestamp));
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const f = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  // console.log( y + '-' + m + '-' + d + ' ' + '　' + h + ':' + minute + ':' + second)
  return Y + M + D + '' + h + f + s;
};

/**设置监听器**/
export function setWatcher(page) {
  let data = page.data;
  let watch = page.watch;
  Object.keys(watch).forEach(v => {
    let key = v.split('.'); // 将watch中的属性以'.'切分成数组
    let nowData = data; // 将data赋值给nowData
    for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
      nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
    }
    let lastKey = key[key.length - 1];
    // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
    let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
    let deep = watch[v].deep; // 若未设置deep,则为undefine
    observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
  })
}
/**监听属性 并执行监听函数**/
function observe(obj, key, watchFun, deep, page) {
  var val = obj[key];
  // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
  if (deep && val != null && typeof val === 'object') {
    Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
      observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
    })
  }
  let that = this;
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set: function (value) {
      watchFun.call(page, value, val); // value是新值，val是旧值
      val = value;
      if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
        observe(obj, key, watchFun, deep, page);
      }
    },
    get: function () {
      return val;
    }
  })
};

module.exports = {
  formatTime: formatTime,
  customFormatTime: customFormatTime,
  customFormatMonth: customFormatMonth,
  customFormatOnlyMonthDay: customFormatOnlyMonthDay,
  customFormatOnlyMonth: customFormatOnlyMonth,
  timestampToTimeLong: timestampToTimeLong,
  setWatcher: setWatcher
}