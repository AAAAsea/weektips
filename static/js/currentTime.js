export function getDate(datetime, startType) {
  var date = new Date(datetime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    sdate = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minute = ("0" + date.getMinutes()).slice(-2),
    second = ("0" + date.getSeconds()).slice(-2);
  // 拼接
  // var result = year + "-"+ month +"-"+ sdate +" "+ hour +":"+ minute +":" + second;
  // 返回
  // return result;
  let resStr = "";
  if (startType === "year")
    resStr =
      year +
      "-" +
      month +
      "-" +
      sdate +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second;
  if (startType === "day") resStr = year + "-" + month + "-" + sdate;
  if (startType === "month") resStr = month + "-" + sdate;
  if (startType === "hour") resStr = hour + ":" + minute + ":" + second;
  return resStr;
}