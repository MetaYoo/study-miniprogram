import { request } from "../../request/index";
import regeneratorRuntime from "../../lib/runtime/runtime";
import { login } from "../../utils/asyncWx";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 获取用户信息
   * @param {*} e 
   */
  handleGetUserInfo: async function (e) {
    try {
      // 1. 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2. 获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      console.log(loginParams);
      // 3. 发送请求获取用户的token
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      // 4. 把token存储到缓存中，同事跳转回上一个页面
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      wx.showToast({
        title: '授权失败，请重试',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})