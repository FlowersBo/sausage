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

module.exports = {
  formatTime: formatTime,
  customFormatTime: customFormatTime,
  customFormatMonth: customFormatMonth,
  customFormatOnlyMonthDay: customFormatOnlyMonthDay,
  customFormatOnlyMonth: customFormatOnlyMonth,
}
