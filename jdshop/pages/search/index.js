import {request} from "../../request/index";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";

/**
 * 1.给输入框绑定事件  值改变事件  input事件
 *   1. 获取输入框的值  
 *   2. 合法性判断
 *   3. 检验通过 把输入框的值发送到后台
 *   4. 返回的数据打印到页面上
 * 
 * 2. 防抖  定时器  节流
 *    输入稳定之后在发送请求  防止重复发送请求， 节流：一般是用在页面下拉 上拉
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消的按钮是否显示
    isFocus: false,
    // 输入框的值
    inputValue:""
  },
  TimeId:-1,

  /**
   * 输入框值改变就会触发事件
   * @param {*} e 
   */
  handleInput: function(e) {
    // 1. 获取输入框的值
    const {value} = e.detail;
    // 2. 校验合法性
    if (!value.trim()) {
      this.setData({
        goods:[], 
        isFocus:false
      });
      // 不合法
      return;
    }
    this.setData({isFocus:true});
    // 3. 发送请求查询
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
    
  },
  /**
   * 点击取消按钮
   * @param {*} e 
   */
  handleCancel: function(e) {
    this.setData({
      inputValue: "",
      isFocus: false,
      goods:[]
    });
  },
/**
 * 发送请求查询商品
 * @param {*} query 
 */
  qsearch: async function(query){
    const res = await request({url: "/goods/qsearch", data:{query}});
    this.setData({
      goods: res
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