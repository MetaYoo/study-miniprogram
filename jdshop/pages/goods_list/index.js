import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  /**
   * 查询接口需要的参数
   */
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  /**
   * 总页数
   */
  totalPages: 1,

  /**
   * 标题点击事件，从子组件传递过来
   * @param {*} e 
   */
  handleTabsItemChange: function (e) {
    // 1. 获取被点击的 tab 的索引
    const { index } = e.detail;
    // 2. 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3. 赋值到data中
    this.setData({
      tabs
    });
  },

  /**
   * 获取商品列表数据
   */
  getGoodsList: async function () {
    let res = await request({ url: '/goods/search', data: this.QueryParams });
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    });

    // 关闭下拉刷新窗口，如果没有调用下拉刷新窗口，直接关闭也不会报错，没有影响
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
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
     // 下拉刷新事件
     // 重置数组，页码设置为1
     // 重新发送请求
     // 数据请求回来，需要手动关闭等待效果
     this.setData({
       goodsList:[]
     });

     this.QueryParams.pagenum = 1;
     this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据了
      wx.showToast({
        title: '没有数据了',
      });
    } else {
      // 获取当前页码++
      // 重新获取请求，数据请求回来，要对数组拼接，而不是全部替换
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})