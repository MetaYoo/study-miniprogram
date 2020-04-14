# 电商小程序实现分析

## 1. 项目结构
[![miniprogram1.png](https://i.postimg.cc/NFmZGQ46/miniprogram1.png)](https://postimg.cc/kRMTf3LG)


包名 | 用途
---|---
components | 存放公共组件
icons | 存放图标图像文件
lib | 存放依赖第三方库
pages | 小程序的page
request | api接口
styles | 项目公共样式文件
utils | 工具类

## 2. 小程序功能页面划分

功能 | 说明
---|---
auth |后台登录认证
cart |购物车页面
category|商品类别页面
collect|商品收藏页面
feedback|用户反馈
goods_detail|商品详情页面
goods_list|商品列表页面
index|首页
login|微信登录
order|订单列表页面
pay|下单支付页面
user|个人中心页面
search|商品搜索页面

## 3. 功能实现细节

### 首页
1. 商品搜索框: 公共组件
2. 轮播图 

```
1. swiper组件，autoplay:属性自动切换，indicator-dots 显示圆点效果，circle 圆圈效果
2. swiper-item 组件内部封装 navigator 点击图片跳转到 商品详情页面
```
3. 首页导航

```
遍历商品类别列表，然后用navigator组件跳转到对应的类别页面
```
4. 楼层

```
根据商品列表 navigator到商品页面
```

## 商品分类
1. 主要是 scroll-view组件，左侧是一级分类，右侧是二级分类
2. 点击左侧的一级分类，右侧展示二级分类列表
3. 点击二级分类时，跳转到商品列表页面
4. 由于商品分类数据比较大，在页面 onLoad时调用后台接口加载一次然后放到缓存中，并设置过期时间，并默认加载第一个类别的二级类别数据
5. 当单电机左侧一级分类条目时，从缓存中取出一级分类对应的二级分类进行渲染


## 商品列表
1. 在Tabs组件槽slot 中展示商品列表。哪个tab激活显示对应的 type下面的商品列表
2. 每个商品详情被 navigator包裹，点击时跳转到商品详情页面
3. 重点：在Tabs子组件中触发父组件的事件
```
this.triggerEvent("tabsItemChange", {index});
```
  用于tab的切换展示
4. 页面下拉时刷新商品数据。先情况商品数据列表并设置pageNum=1，totalPages=1 然后发送后台商品列表分页查询。**后台查询完毕后关闭下拉刷新效果**
5. 分页查询商品列表数据时得到总页数
6. 当页面滑动到底部时，触发onReachBottom事件向据，判断当前页码是否大于总页数，如果pageNum >= totalPages 则提示已经是最后一页了，否则向后台发起查询商品列表数据，**并追加到商品列表中，并设置pageNum++**

## 商品详情页面
1. 轮播图展示商品的图片列表
2. 商品价格展示
3. 商品名称展示
4. 商品收藏功能功能，点击时分别做收藏/取消收藏切换 收藏功能暂时放在微信缓存中
> 遍历缓存中的收藏列表，根据是否收藏，对缓存中的收藏列表进行新增或者删除
5. 商品图文详情，会展示原生 html信息，用到富文本组件
```
<rich-text nodes="{{goodsObj.goods_introduce}}"></rich-text>
```
6. 底部工具栏，固定布局。客服按钮 open-type="contact" 唤起打电话功能
```
<button open-type="contact"></button>
```
7. 分享按钮，唤起分享到微信朋友功能
```
<button open-type="share"></button>
```
8. 购物车跳转链接，点击跳转到购物车列表，加入购物车按钮，点击将商品加入到购物车缓存
> 先判断购物车缓存中是否有该商品，有就做合并计算，没有就在购物车列表新增一条记录
9. 立即购买按钮，点击 跳转到支付页面


## 购物车
1. 购物车数据是取缓存
2. 收货地址需要调用微信API获取用户地址并存放到缓存中
3. 购物车“+”和“-”功能添加商品，实时计算，及复选框状态更改
4. 点击结算按钮时跳转到支付结算页面

## 登录授权
1. 获取用户信息 

```
<button type="primary" plain open-type="getUserInfo" bindgetuserinfo="handleGetUserInfo">
获取授权
</button>
```
2. 通过小程序API " wx.login" 换取用户的 code
3. 根据用户信息及code发送电商后台登录请求，返回token
4. 将token保存到缓存中

## 支付结算
1. 判断缓存中是否有token，没有的话跳转到登录页面
2. 带上token及订单必要信息到电商后台发送创建订单请求创建订单，并返回订单编号
3. 发起预支付接口请求，返回唤起微信支付的必要支付相关的信息
4. 唤起小程序微信支付
5. 向后台查询订单状态
6. 更新缓存中购物车状态数据
7. 注意 onShow与onLoad的区别，哪些数据应该放在onShow中处理更新

## 商品查询
1. 主要是bindinput事件的防抖动处理，避免每敲一个字都要发起后台查询请求，核心处理逻辑用了 定时器

```
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
```

事件处理函数每调用一次时，先清除掉之前的定时器，即：不发送查询请求，直到1000毫秒后还没有触发 bindinput事件时才发送后台查询接口

## 个人中心
1. 主要是一些查询及展示的入口
2. 图片上传接口组件