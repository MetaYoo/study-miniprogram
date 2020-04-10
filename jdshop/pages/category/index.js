import { request } from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  /**
   * 左侧菜单点击事件
   * @param {*} e 
   */
  handleItemTap: function (e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签的距离顶部的剧烈
      scrollTop: 0
    });


  },
  /**
   * 获取分类数据
   */
  getCates: async function() {
    // request({ url: "/categories" })
    //   .then((res) => {
    //     this.Cates = res.data.message;
    //     // 把接口的数据存储到本地存储中
    //     wx.setStorageSync('cates', {time:Date.now(), data:this.Cates});
    //     // 构造左侧菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     // 构造右侧的商品数据
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     });
    //   });
    let res = await request({ url: "/categories" });
    this.Cates = res;
    // 把接口的数据存储到本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    // 构造左侧菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 1.判断本地存储中是否有旧的数据
     *  {time:Date.now(), data:[...]}
     * 2.没有旧数据，直接发送新的请求
     * 3.有旧的数据同时旧的数据也没有过期，就使用本地存储中的旧数据即可
     */
    // 1. 获取本地存储中的数据（小程序中也是存在本地存储技术）
    const Cates = wx.getStorageSync("cates");
    // 2. 判断
    if (!Cates) {
      this.getCates();
    } else {
      // 有旧的数据 过期时间定为 10s
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        // 可以使用旧的数据
        console.log("可以使用旧的数据");
        this.Cates = Cates.data;
        // 构造左侧菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }

    }
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