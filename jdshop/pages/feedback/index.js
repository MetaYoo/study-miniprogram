/**
 * 点击 “+” 出发tap点击事件
 *   1. 调用小程序内置的选择图片的api
 *   2. 获取到土拍你的路径数组
 *   3. 把图片路径存到data的变量中
 *   4. 页面就可以根据图片数组进行循环显示 自定义组件
 * 
 * 点击自定义图片组件
 *   1. 获取被点击的元素的索引
 *   2. 获取data中的图片数组
 *   3. 根据索引 数组中删除对应的元素
 *   4. 把数组重新设置回data中
 * 当点击 “提交”按钮时
 *   1. 获取文本域的内容 类似普通输入框的获取
 *   2. 对这些内容合法性验证
 *   3. 验证通过 用户选择图片 上传到专门的图片服务器 返回图片的外网的连接
 *   4. 文本域和外网的图片的路径一起提交到服务器
 *   5. 清空一下当前页面
 *   6. 返回上一页
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
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、上家投诉",
        isActive: false
      }
    ],
    // 文本域
    textVal: "",
    // 被选中的图片路径数组
    chooseImages: []
  },
  // 外网的图片路径数组
  uploadImages: [],

  /**
   * 标签切换事件
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
   * 选择 “+” 选择图片
   * @param {*} e 
   */
  handleChooseImage: function (e) {
    // 调用小程序内置选择图片api
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      complete: (res) => {
        console.log(res);
        this.setData({
          chooseImages: [...this.data.chooseImages, ...res.tempFilePaths]
        });
      }
    })
  },
  /**
   * 点击删除图片
   * @param {*} e 
   */
  handleRemoveImg: function (e) {
    // 1. 获取被点击的组件的索引
    let { index } = e.currentTarget.dataset;
    // 2. 获取data中的图片数组
    let { chooseImages } = this.data;
    // 3. 删除元素
    chooseImages.splice(index, 1);
    // 4. 重新设置回data中
    this.setData({
      chooseImages
    });
  },

  /**
   * 文本域的输入事件
   * @param {*} e 
   */
  handleTextInput: function (e) {
    this.setData({
      textVal: e.detail.value
    });
  },
  /**
   * 表单提交
   * @param {*} e 
   */
  handleFormSubmit: function (e) {
    // 1. 获取文本域的内容
    const { textVal, chooseImages } = this.data;
    // 2. 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    };
    // 3. 准备上传图片到专门的图片服务器
    // 显示正在上传中的弹窗
    wx.showLoading({
      title: '正在上传中',
      mask: true,
    })
    // 判断又没有需要上传的图片数组
    if (chooseImages.length != 0) {
      chooseImages.forEach((v, i) => {
        wx.uploadFile({
          filePath: v,
          name: 'file',
          url: 'https://images.ac.cn/api/upload/upload',
          // 顺带的文本信息
          formData: { apiType: 'ali', privateStorage: '' },
          success: (res) => {
            let url = JSON.parse(res.data);
            this.uploadImages.push(url);
            console.log(this.uploadImages);

            // 所有图片都上传完毕了才触发
            if (i === chooseImages.length - 1) {
              // 关闭弹窗
              wx.hideLoading({});
              console.log("把文本的内容和外网的图片数组提交到后台中----异步处理");
              // 提交都成功了，重置页面，返回上一个页面
              this.setData({
                textVal: "",
                chooseImages: []
              });
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      });
    } else {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
      console.log("只是提交了文本");
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