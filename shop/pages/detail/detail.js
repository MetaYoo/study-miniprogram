// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    current: 0,
    goodsNo: "",
    detailInfo:{
      "Id": 54,
      "ShopId": 2,
      "GoodsNo": "3048516",
      "DataStatus": 2,
      "Title": "国产|猫太郎|扇贝咖啡条50g",
      "Classify": 500,
      "ClassifyName": "零食",
      "GoodsImage": "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181105023042983177.jpg",
      "Stock": 10,
      "SaleAmount": 15,
      "CreateDate": "2018-11-04T18:30:48.000Z",
      "UpdateDate": "2018-11-20T04:58:08.000Z",
      "Brand": "猫太郎",
      "OrderNum": 0,
      "SwiperImgList": [
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181105023042983177.jpg",
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181119174911711201.jpg",
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181114120643144118.jpg"
      ],
      "DetailImgList": [
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181105023609436883.jpg",
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181105023609077672.jpg",
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181105023609780116.jpg",
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181105023610467126.jpg",
        "https://www.maohz.com/mhzapi/api/Common/ImageFile/goodsimgderek20181105023610170702.jpg"
      ]
    }
  },

  /**
   * 幻灯片切换事件
   * @param {*} e 
   */
  swiperChange: function(e) {
    let currentNo = e.detail.current;
    this.setData({
      current:currentNo
    });
  },
  /**
   * 全屏预览图片
   * @param {*} e 
   */
  showImage:function(e) {
    let self = this;
    wx.previewImage({
      current:self.data.detailInfo.SwiperImgList[this.data.current],
      urls: self.data.detailInfo.SwiperImgList,
    })
  },
  /**
   * 跳转到首页
   * @param {*} e 
   */
  jumpToHome: function(e) {
    wx.switchTab({
      url: '/pages/home/home',
    });
  },
  /**
   * 跳转到购物车
   * @param {*} e 
   */
  jumToCart: function(e) {
    wx.switchTab({
      url: '/pages/shopcart/shopcart',
    })
  },
  /**
   * 加入购物车
   * @param {*} e 
   */
  addToCart:function(e) {
    console.log("加入购物车");
  },
  /**
   * 立即购买
   * @param {*} e 
   */
  btnBuy:function(e) {
    console.log("立即购买");
  },
  /**
   * 咨询-拨打电话
   * @param {*} e 
   */
  onCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: '10086',
    })
  },
  /**
   * 获取商品详情数据接口
   */
  getDetailData:function() {
    let self = this;
    console.log(self.data.goodsNo);
    wx.request({
      url: 'https://ys.lumingx.com/api/miniapps/getWXGoodsInfo',
      data: {
        goodsNo: self.data.goodsNo || ""
      },
      header: {
        'content-type':'application/json'
      },
      success: function(res) {
          console.log(res.data);
          let result = res.data;
          if(result && result.data) {
             self.setData({
               detailInfo: result.data
             });
          }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsNo: options.goodsNo
    })
    this.getDetailData();
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