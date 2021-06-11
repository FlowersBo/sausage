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
  let converedDate=new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();
  
  return [year, month, day].map(formatNumber).join('-');
}

const customFormatMonth = date => {
  let converedDate=new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();
  
  return [year, month].map(formatNumber).join('');
}

const customFormatOnlyMonthDay = date => {
  let converedDate=new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();
  
  return [month,day].map(formatNumber).join('.');
}

const customFormatOnlyMonth = date => {
  let converedDate=new Date(Date.parse(date));
  const year = converedDate.getFullYear();
  const month = converedDate.getMonth() + 1;
  const day = converedDate.getDate();
  
  return [month].map(formatNumber)+'月';
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
module.exports = {
  formatTime: formatTime,
  customFormatTime: customFormatTime,
  customFormatMonth: customFormatMonth,
  customFormatOnlyMonthDay: customFormatOnlyMonthDay,
  customFormatOnlyMonth: customFormatOnlyMonth,
  timestampToTimeLong: timestampToTimeLong
}
