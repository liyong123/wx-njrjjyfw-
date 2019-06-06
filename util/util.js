var md5 = require('md5.js');
var md5_wx = require('md5_wx.js');

//签名算法
function sign(args) {
  args['timestamp'] = new Date().getTime();
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function(key) {
    var val = args[key]
    if (val !== null && val !== undefined && val !== '') {
      newArgs[key] = val;
    }
  });

  var param = '';
  for (var k in newArgs) {
    param += '&' + k + '=' + newArgs[k];
  }
  param += '&key=kdkj9*KJ98JKJ98JH8K78'; // 秘钥
  param = param.substr(1);
  //param = md5.hex_md5(param).toUpperCase();
  param = md5_wx.myMd5(param).toUpperCase();
  param = '00001' + param;
  args['sign'] = param;
  return args;
}
/***
*dev：
	jfyjlr:52bc5435-47f8-4256-9564-e4088b4f41e5
test：
	jfyjlr:a45bcf80-ae96-4112-a31b-eb23a5ab4d97
rc：
	jfyjlr:deae2ce0-22eb-40dc-beed-d2f1e3e18bfe
生产：
	jfyjlr:e6f05048-a917-49f7-b7b8-db18117a28a2
px：
	jfyjlr:29f136ad-37cb-4d7c-8b0a-5f3853bd2258
 */
function basicToken() {
  var url = getApp().globalData.yjBaseUrl;

  var s = '';
  if (url.indexOf('dev.jfh.com') != -1) {
    s = 'jfyjlr:52bc5435-47f8-4256-9564-e4088b4f41e5';
  } else if (url.indexOf('test.jfh.com') != -1) {
    s = 'jfyjlr:a45bcf80-ae96-4112-a31b-eb23a5ab4d97';
  } else if (url.indexOf('rc.jfh.com') != -1) {
    s = 'jfyjlr:deae2ce0-22eb-40dc-beed-d2f1e3e18bfe';
  } else if (url.indexOf('px.jfh.com') != -1) {
    s = 'jfyjlr:29f136ad-37cb-4d7c-8b0a-5f3853bd2258';
  } else {
    s = 'jfyjlr:e6f05048-a917-49f7-b7b8-db18117a28a2';
  }

  return 'Basic ' + md5.base64encode(s);
}


module.exports = {
  //post请求
  callAjaxPost(url, data, callback, content) {
    wx.showLoading({
      title: content ? content : '加载中',
      mask: true
    });
    data = data || {};
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8'
      },
      success: function(res) {
        wx.hideLoading();
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        wx.hideLoading();
        typeof callback == "function" && callback(null);
      }
    })
  },

  //post请求加密
  callAjaxPostSign(url, data, callback, content) {
    wx.showLoading({
      title: content ? content : '加载中',
      mask: true
    });
    data = sign(data) || {};
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8'
      },
      success: function(res) {
        wx.hideLoading();
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        wx.hideLoading();
        typeof callback == "function" && callback(null);
      }
    })
  },

  //post请求
  callAjaxPostNoToast(url, data, callback) {
    data = sign(data) || {};
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8'
      },
      success: function(res) {
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        typeof callback == "function" && callback(null);
      }
    })
  },


  //get请求
  callAjaxGet(url, data, callback, content) {
    var datasign = data || {};
    wx.showLoading({
      title: content ? content : '加载中',
      mask: true
    });
    wx.request({
      url: url,
      data: datasign,
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        wx.hideLoading();
        typeof callback == "function" && callback(null);
      }
    })
  },

  //get请求--Promise
  getByPromise(url, data, showLoading = true, content) {
    return new Promise((resolve, reject) => {
      // var datasign = sign(data);
      showLoading && wx.showLoading({
        title: content ? content : '加载中',
        mask: true
      });
      wx.request({
        url: url,
        data: data,
        method: 'GET',
        success: function(res) {
          wx.hideLoading();
          resolve(res);
        },
        fail: function(err) {
          wx.hideLoading();
          reject(err);
        }
      })
    });
  },

  // //get请求加密同步
  // callAjaxGetSignSync(url, data, callback, content) {
  //   var datasign = sign(data);
  //   var App = getApp();
  //   if (App.globalData.ajaxList.length === 0) {
  //     wx.showLoading({
  //       title: content ? content : '加载中',
  //       mask: true
  //     });
  //   }
  //   App.globalData.ajaxList.push(new Date());
  //   wx.request({
  //     url: url,
  //     data: datasign,
  //     method: 'GET',
  //     success: function(res) {
  //       App.globalData.ajaxList.pop();
  //       if (App.globalData.ajaxList.length === 0) {
  //         wx.hideLoading();
  //       }
  //       typeof callback == "function" && callback(res);
  //     },
  //     fail: function(err) {
  //       App.globalData.ajaxList.pop();
  //       if (App.globalData.ajaxList.length === 0) {
  //         wx.hideLoading();
  //       }
  //       typeof callback == "function" && callback(null);
  //     }
  //   })
  // },

  //get请求加密
  callAjaxGetSign(url, data, callback, content) {
    var datasign = sign(data);
    var App = getApp();
    wx.showLoading({
      title: content ? content : '加载中',
      mask: true
    });
    App.globalData.ajaxList.push(new Date());
    wx.request({
      url: url,
      data: datasign,
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        wx.hideLoading();
        typeof callback == "function" && callback(null);
      }
    })
  },

  //get请求
  callAjaxNoToast(url, data, callback) {
    var datasign = sign(data);
    wx.request({
      url: url,
      data: datasign,
      method: 'GET',
      success: function(res) {
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        typeof callback == "function" && callback(null);
      }
    })
  },

  // 状态合并 
  state() {
    return parseInt(
      Array.map.call(arguments, a => {
        return !!a ? 1 : 0
      }).join(), 2
    )
  },

  //REST ful 请求方式
  callAjaxGetRestful(url, data, callback) {
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: {
        'content-type': 'application/json;charset=UTF-8',
        'Authorization': basicToken() //'Basic Y29uc29sZTRJU1Y6ZmYwOGQ2OGUtNDJlMS00MTc0LTk3MGQtMmZlMGQ1ZjdhZjM1'
      },
      success: function(res) {
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        typeof callback == "function" && callback(null);
      }
    })
  },
  //REST ful 请求方式
  callAjaxPostRestful(url, data, callback) {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8',
        'Authorization': basicToken() //'Basic Y29uc29sZTRJU1Y6ZmYwOGQ2OGUtNDJlMS00MTc0LTk3MGQtMmZlMGQ1ZjdhZjM1'
      },
      success: function(res) {
        typeof callback == "function" && callback(res);
      },
      fail: function(err) {
        typeof callback == "function" && callback(null);
      }
    })
  },
  // 显示请求结果提示
  showAjaxTip(content) {
    // wx.showModal({
    //   title: "温馨提示",
    //   content: (content || '') != '' ? content : "请求失败，请联系客服:400-064-0003",
    //   showCancel: false,
    //   confirmText: "确定"
    // });
  }
}