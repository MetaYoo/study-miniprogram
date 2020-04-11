import regeneratorRuntime from "../../lib/runtime/runtime";
import { request } from "../../request/index";
/**
 * 发送请求获取商品详情数据
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  // 当前商品详情对象
  GoodsInfo:{},

  /**
   * 获取商品详情数据
   * @param {*} goods_id 
   */
  getGoodsDetail: async function (goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo = res;
    this.setData({
      goodsObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // iphone 部分手机不识别webp图片格式
        // 最好找到后台，进行修改
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics
      }
    });
  },

  /**
   * 点击轮播图，放大预览
   * @param {*} e 
   */
  handlePreviewImage: function(e) {
    // 1. 接收传递过来的图片 url
    const current = e.currentTarget.dataset.url;
    // 2. 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
     wx.previewImage({
       current,
       urls
     })
  },
  /**
   * 添加购物车事件
   * @param {*} e 
   */
  handleCartAdd: function(e) {
     // 1. 获取缓存中的购物车数组
     let cart = wx.getStorageSync('cart') || [];
     // 2. 判断商品对象是否存在购物车数组中
     let index = cart.findIndex(v => v.goods_id===this.GoodsInfo.goods_id);
     if (index === -1) {
        // 3. 不存在则第一次添加
        this.GoodsInfo.num = 1;
        // 商品购物车选定状态
        this.GoodsInfo.checked=true;
        cart.push(this.GoodsInfo);
     } else {
       // 4.已经存在购物和数据则执行 num++
       cart[index].num++;
     }
     // 5. 把购物车重新添加回缓存中
     wx.setStorageSync('cart', cart);
     // 6. 弹窗提示
     wx.showToast({
       title: '加入成功',
       icon: 'success',
       // 防止用户手抖
       mask:true
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
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