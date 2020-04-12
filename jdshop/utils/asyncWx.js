
/**
 * 微信接口调用的封装
 */

/**
 * promise形式 getSetting
 */
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        resolve(res);
      },
      fail: (eerr) => {
        reject(err);
      }
    })
  });
}

/**
 * promise 形式 chooseAddress
 */
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (res) => {
        resolve(res);
      },
      fail: (eerr) => {
        reject(err);
      }
    })
  });
}


/**
 * promise 形式 openSetting
 */
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (res) => {
        resolve(res);
      },
      fail: (eerr) => {
        reject(err);
      }
    })
  });
}


/**
 * promise 形式 showModal
 */
export const showModal = ({content}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  });
}


/**
 * promise 形式 showTotast
 */
export const showTotast = ({title}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      icon: 'none',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  });
}

/**
 * Promise 形式的微信登录
 */
export const login=() => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  });
}

/**
 *  Promise形式 微信支付 
 * @param {*} pay 支付所必要的参数
 */
export const requestPayment=(pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      // nonceStr: 'nonceStr',
      // package: 'package',
      // paySign: 'paySign',
      // timeStamp: 'timeStamp',
      ...pay,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
         reject(err);
      }
    })
  });
}