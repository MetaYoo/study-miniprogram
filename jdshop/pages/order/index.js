import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
import { request } from "../../request/index";

/**
 * 1. 当页面被打开的时候 onShow
 *    1.0 onShow不同于onLoad 无法在形参上接收options参数
 *       判断缓存中有没有 token 如果没有就跳转到授权页面
 *    1.1 获取url上的参数type  根据 type值决定页面标题的数组元素哪个被激活选中
 *    1.2 根据 type 去发送请求获取订单数据
 *    1.3 渲染页面
 * 2. 当点击不同的标题 需要重新发送请求来获取和渲染数据
 * 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
    orders:[]
  },

  /**
   * 根据标题索引来激活选中标题数组
   * @param {*} index 
   */
  changeTitleByIndex: function(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3. 赋值到data中
    this.setData({
      tabs
    });
  },
   /**
   * 标题点击事件，从子组件传递过来
   * @param {*} e 
   */
  handleTabsItemChange: function (e) {
    // 1. 获取被点击的 tab 的索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 2. 重新发送请求 type=1 index=0
    this.getOrders(index+1);
  },

  /**
   * 获取订单列表的方法
   */
  getOrders: async function(type) {
   const res = await request({url:"/my/orders/all", data: {type}});
   this.setData({
     orders: res.orders.map(v => ({...v, create_time_cn:(new Date(v.create_time*1000).toLocaleString())})) || []
   });
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
    const token = wx.getStorageSync('token');
    // if (!token) {
    //     wx.navigateTo({
    //       url: '/pages/auth/index',
    //     });
    //     return;
    // }
     // 1. 获取当前小程序的页面栈-内存数组 长度最大是10个页面
     let pages = getCurrentPages();
     // 2. 数组中索引最大的页面就是当前的页面
     let currentPage = pages[pages.length - 1];
     // 3. 获取 url上的type参数
     const {type} = currentPage.options;
     // 4. 根据 type值激活选中 title
     this.changeTitleByIndex(type-1);
     this.getOrders(type);
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