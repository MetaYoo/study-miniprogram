
// 解决首页同时多个异步请求 加载中动画关闭问题
// 同时发送异步代码的次数
let ajaxTimes = 0;

/**
 * 微信请求封装
 * @param {*} parms 
 */
export const request = (params) => {
  ajaxTimes++;
  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // 定义公共的 url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          // 关闭正在等待的图标
          wx.hideLoading();
        }
      }
    });
  });
}