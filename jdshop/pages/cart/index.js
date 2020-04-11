
import { getSetting, chooseAddress, openSetting, showModal,sowTotast, showTotast } from "../../utils/asyncWx";
import regeneratorRuntime from "../../lib/runtime/runtime";
/**
 * 页面加载完毕， 获取本地存储中的地址数据，把数据设置给data中的一个变量
 */
/**
 * 全选的实现 数据的展示
 * onShow 获取缓存中的购物车数组 根据购物车的商品数据 所有的商品都被选中 checked=true 全选就被选中
 * 
 * 总价格和商品总数量，都需要商品被选中 我们才计算
 * 
 * 商品的选中功能，绑定change事件 
 * 商品对象的选中状态 取反
 * 重新填充回data中和缓存中
 * 重新计算全选，总数量 总价格
 * 
 * 全选和反选功能
 *   全选复选框绑定事件 change
 * 获取data中的全选变量 allChecked  直接取反 allChecked = !allChecked
 * 遍历购物车数组 让里面的购物车商品选中状态都跟随这allChecked的改变而改变
 * 把购物车数组和allChecked重新设置回data和缓存中
 * 
 * 
 * 商品数量的编辑功能
 *  "+" 和 "-" 按钮绑定同一个点击事件 区分的关键 自定义属性
 * 传递被点击的商品id goods_id 获取data中的购物车数组 来获取需要被修改的商品对象
 * 直接修改商品对象的数量 num
 * 把cart数组重新设置回缓存中和data中， this.setCart() 完成
 * 
 * 
 * 点击结算
 *  1. 判断有没有收获地址信息
 *  2，判断用户有没有选购商品
 *  3. 经过以上的验证 跳转到支付页面！
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 1.点击收货地址
   * 2.调用小程序内置的api 获取用户收获地址
   * 3.获取用户对小程序所授予获取地址的权限状态scope
   *    3.1 假设用户点击获取收获地址的提示框确定 scope true 直接调用获取收获地址
   *    authSetting scope.address
   *    3.2 假设用户从来没有调用过收获地址api  scope 为 undefined 直接调用获取收获地址
   *    3.3 假设用户点击获取收获地址的提示框 取消 scope 值为 false 拒绝过一次，需要诱导用户自己打开授权设置界面获取收获地址
   */
  handleChooseAddress: async function () {
    // 2 获取收获地址
    // wx.getSetting({
    //   success: (res) => {
    //     // 2. 获取权限状态
    //     const scopeAddress = res.authSetting["scope.address"];
    //     if (scopeAddress == true || scopeAddress == undefined) {
    //       wx.chooseAddress({
    //         success: (result) => {
    //           console.log(result);
    //         }
    //       })
    //     } 
    //     // 用户曾经拒绝过授权
    //     else {
    //        wx.openSetting({
    //         success: (result) => {
    //             // 可以直接调用获取收获地址
    //             wx.chooseAddress({
    //               success: (result2) => {
    //                 console.log(result2);
    //               }
    //             })
    //          },
    //        })
    //     }
    //   },
    // });



    // // 1. 获取权限状态
    // const res1 = await getSetting();
    // const scopeAddress = res1.authSetting['scope.address'];
    // // 2. 判断权限状态
    // if (scopeAddress === undefined || scopeAddress === true) {
    //   // 直接调用获取收货地址 api
    //   const res2 = await chooseAddress();
    // } else {
    //   // 诱导用户打开授权
    //   await openSetting();
    //   // 调用获取收获地址的api
    //   const res2 = await chooseAddress();
    //   console.log(res2);
    // }

    try {
      // 1. 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting['scope.address'];
      // 2. 判断权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 调用获取收获地址的api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 存入到缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * 购物车复选框选中
   * @param {*} e 
   */
  handleItemChange: function (e) {
    // 1. 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2. 获取购物车数组
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4. 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5. 把购物车数据重新设置回data和缓存中
    this.setCart(cart);
  },

  /**
   * 购物车全选功能
   * @param {*} e 
   */
  handleItemAllCheck: function (e) {
    // 1. 获取data数据
    let { cart, allChecked } = this.data;
    // 2. 修改值
    allChecked = !allChecked;
    // 3.循环修改cart数组中商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4. 修改后的值 填充回缓存和data中
    this.setCart(cart);
  },
  /**
   * 商品数量编辑事件处理
   * @param {*} e 
   */
  handleItemNumEdit: async function (e) {
    // 1. 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2. 获取购物车数组
    let { cart } = this.data;
    // 3. 找到需要修改的上平的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4. 开始进行修改数量  当购物车的数量是1 同事用户点击 "-" 弹窗询问是否要删除购物车项
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    } else {
      cart[index].num += operation;
      // 5. 设置回缓存和data中
      this.setCart(cart);
    }
  },

  /**
   * 设置购物车状态，同时重新计算底部工具栏的数据，全选 总价格 购买的数量
   * @param {*} options 
   */
  setCart: function (cart) {
    let allChecked = true;
    // 总数量，总价格
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    allChecked = cart.length != 0 ? allChecked : false;
    // 1. 设置到data中
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    // 2. 设置到缓存中
    wx.setStorageSync('cart', cart);
  },

  /**
   * 点击结算
   * @param {*} e 
   */
  handlePay: async function(e) {
    // 1. 判断收获地址
    const {address, totalNum} = this.data;
    if (!address.userName) {
       await showTotast({title:"您还没有选择收获地址"});
       return;
    }

    // 2. 判断用户有没有选购商品
    if(totalNum === 0) {
      await showTotast({title:"您还没有选购商品"});
        return;
    }

    /// 3. 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
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
    // 1.获取缓存中的收获地址信息
    const address = wx.getStorageSync('address');
    // 2. 获取缓存中的购物车数组 将购物车数据填充到data中
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ address });
    this.setCart(cart);
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