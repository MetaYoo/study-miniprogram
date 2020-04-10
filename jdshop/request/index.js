
/**
 * 微信请求封装
 * @param {*} parms 
 */
export const request = (params) => {
  // 定义公共的 url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl+params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}