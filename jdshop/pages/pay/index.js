
import { getSetting, chooseAddress, openSetting, showModal, sowTotast, showTotast, requestPayment } from "../../utils/asyncWx";
import { request } from "../../request/index";
import regeneratorRuntime, { async } from "../../lib/runtime/runtime";
/**
 * 1. 页面加载的时候 从缓存中获取购物车数据，渲染到页面中
 *    这些数据 checked=true数据才是需要的
 * 2. 微信支付
 * 
 * 3. 支付按钮
 *    先判断缓存中有没有token 没有 跳转到授权页面进行获取token
 *    有token就创建订单 获取订单编号
 * 支付完成之后要手动删除缓存中已经被选中了的商品
 * 删除后的购物车数据填充回缓存
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 下单支付
   * @param {*} e 
   */
  handleOrderPay: async function (e) {
    try {
      // 1. 先判断缓存中有没有token
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return;
      }
      console.log("已经存在token");
      // 3. 创建订单
      // 3.2 请求体参数
      const ordder_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));
      const orderParams = { ordder_price, consignee_addr, goods };
      // 4 准备发送请求 创建订单，获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      console.log(order_number);
      // 5. 发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // 6. 发起微信支付
      await requestPayment(pay);
      // 7. 查询后台订单状态是否成功
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      console.log(res);
      await showTotast("支付成功");
      // 8. 删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);
      // 9. 支付成功了，跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (error) {
        console.log(error);
       await showTotast("订单支付失败");
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
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync('address');
    // 2. 获取缓存中的购物车数组 将购物车数据填充到data中
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });

    // 总数量，总价格
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    // 1. 设置到data中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
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