// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['/images/discount-banner.jpg','/images/draw-banner.jpg','/images/nursing-banner.jpg'],
    indicatorDots:true,
    vertical:false,
    autoplay:true,
    interval:2000,
    duration:500,
    goodsData:[],
    pageNo:1,
    pageSize:10,
    isComplete:false
  },
  getGoodsData: function() {
    let self = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ys.lumingx.com/api/manage/GoodsList',
      data: {
        pageNo: self.data.pageNo,
        pageSize: self.data.pageSize
      },
      header: {
        'content-type':'applicaton/json'
      },
      success: (res) => {
        // 隐藏loading状态
        wx.hideLoading();
        // 隐藏加载动画
        wx.hideNavigationBarLoading();
        // 停止下拉刷新
        wx.stopPullDownRefresh();
        let result = res.data;
        // 有值的时候
        if(result.success && result.data.length > 0) {
          // 已经存在的数据和最新返回的数据合并
          let newData = self.data.goodsData.concat(result.data); 
          self.setData({
              goodsData: newData
          });
        } else {
          // 没有值的时候
          self.setData({
            isComplete:true
          })
        }
      }
    })
  },

  /**
   * 跳转到商品详情页
   */
  jumpDetail: function(e) {
    // 1.点击商品获取当前商品的数据（商品ID）
    // 2. 跳转到商品详情页面，将商品Id传给商品详情页
    let goodsNo = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/detail/detail?goodsNo=' + goodsNo,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getGoodsData();
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
    wx.showNavigationBarLoading();
    // 下拉刷新
    this.setData({
      pageNo:1,
      goodsData:[]
    });
    // 重新加载数据
    this.getGoodsData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageNo++;
    this.getGoodsData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})