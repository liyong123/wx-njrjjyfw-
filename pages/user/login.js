// login.js
var util = require('../../util/util.js');
var uuid = require('../../util/uuid.js');
var app = getApp();
Page({
  data: {
    currentTab: 0,
    scrollLeft: 0,
    winHeight: '',
    personalAccount: { //用户帐号密码
      username: '',
      password: ''
    },
    sig: '',
    imgcodeUrl: '', //校验码获取地址
    mobile: '', //手机号
    smscode: '', //验证码
    imgcode: '', //校验码
    loginName: '', //登录账户用户名
    password: '', //登录密码
    sendSmsCodeShow: false, //显示倒计时按钮
    currentTime:59,//倒计时时间
    time:'',
  },

  /*滑动切换登录tab*/
  redirectTo: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.checkCol();
  },
  /*点击 登录tab切换*/
  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //滑动切换超过1屏之后  给页面加大
  checkCol: function() {
    var that = this;
    if (that.data.currentTab > 1) {
      that.setData({
        scrollLeft: 300
      })
    } else {
      that.setData({
        scrollLeft: 0
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //跳转至哪个tab页面
    var page = 0;
    if (options != undefined) {
      page = options.page == undefined ? 0 : options.page;
    }
    var loginName = wx.getStorageSync("loginName") == null ? '' : wx.getStorageSync("loginName");
    var mobile = wx.getStorageSync("mobile") == null ? '' : wx.getStorageSync("mobile");
    var sig = uuid.getUuid(16, 16)
    that.setData({
      currentTab: page,
      sig: sig,
      loginName: loginName,
      mobile: mobile,
      personalAccount: {
        username: loginName
      }
    })
    //自动获取系统高度
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight;
        var clientWidth = res.windowWidth;
        var rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        })
      },
    })
    that.imgcodeApi();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 用户帐号输入
   *
   */
  personal_username_input: function(e) {
    this.setData({
      loginName: e.detail.value.replace(/\s+/g, '')
    });
  },

  /**
   * 用户密码输入
   *
   */
  personal_password_input: function(e) {
    this.setData({
      password: e.detail.value.replace(/\s+/g, '')
    });
  },

  // 判断用户类型
  loginUserType: function(param) {

    let params = {
      loginId: param.j_loginid,
      password: param.j_password
    }

    let url = app.globalData.bidBaseUrl + '/yjapi/expert/v2/getMenber'
    util.callAjaxGet(url, params, function(res) {
      console.log(res.data.data.user);
      return res.data.data.user.userType;
    })
  },

  /**
   * 用户登录操作
   *
   */
  login: function(e) {
    var that = this;
    if (that.data.currentTab == 0) {
      if (!this.data.loginName) {
        wx.showModal({
          title: "温馨提示",
          content: "请输入用户帐号",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }

      if (!this.data.password) {
        wx.showModal({
          title: "温馨提示",
          content: "请输入登录密码",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }
      //登录
      var url = app.globalData.oldBaseUrl + app.globalData.loginAPI;
      //登录参数
      var param = {
        j_loginid: this.data.loginName,
        j_password: this.data.password,
        defaultCallback: true,
        linkpage: app.globalData.baseUrl + '/jfportal/orders/ODM5ODszMA=='
      }

      let userData = null;
      let params = {
        loginId: param.j_loginid,
        password: param.j_password
      }
      let urlGetMenber = app.globalData.bidBaseUrl + '/yjapi/expert/v2/getMenber';
      util.callAjaxGet(urlGetMenber, params, function(resl) {
        if (resl.data.resultcode == '0000') {
          userData = resl.data.data.role;
          let buid = resl.data.data.buid;
          wx.setStorageSync('buid', buid);
          util.callAjaxGet(url, param, function(e) {
            if (e) {
              if (e.statusCode = '200') {
                if (e.data.resultcode == '200' && e.data.code == 'LN_200') {
                  console.log(e);

                  //说明登录成功  保存当前登录的用户
                  // isNjGuzhu不等于true 并且 usertype ！=2:供应商
                  wx.setStorageSync('isSupplier', (!e.data.isNjGuzhu && e.data.usertype != 2));
                  wx.setStorageSync('username', that.data.loginName);
                  wx.setStorageSync('headicon', '');
                  wx.setStorageSync('nickname', that.data.nickname);
                  wx.setStorageSync('realname1', that.data.realname);
                  wx.setStorageSync('isLogin', true);
                  // wx.setStorageSync('nickname', that.data.nickname);
                  wx.setStorageSync('realname1', that.data.realname);
                  // wx.setStorageSync('realname', that.data.personalAccount.realname);
                  wx.setStorageSync('loginName', that.data.loginName);
                  //调用接口获取用户信息
                  var url = app.globalData.oldBaseUrl + app.globalData.userInfoApi;
                  //获取保存在本地用户名称
                  var username = wx.getStorageSync('username');
                  //准备参数  手机号码  邮箱都可以
                  var data = {
                    "user": username
                  };
                  util.callAjaxGet(url, data, function(res) {
                    if (res) {
                      if (res.data.resultcode == '0') {
                        wx.setStorageSync('username', username);
                        wx.setStorageSync('jfId', res.data.data.jfId);
                        wx.setStorageSync('jfcode', res.data.data.jfcode);
                        wx.setStorageSync('userId', res.data.data.userId);
                        wx.setStorageSync('nickname', res.data.data.nickname);
                        wx.setStorageSync('realname', res.data.data.realname);
                        // 登录游客首页
                        if (userData == 1) {
                          wx.reLaunch({
                            url: '/pages/web/index',
                            success: function(e) {
                              // console.log(e);
                            }
                          });
                        }
                        //  else if (userData == 2){
                        //   // url: '/pages/web/leadership-index',
                        //   wx.reLaunch({
                        //     url: '/pages/web/visitorIndex',
                        //     success: function(e) {
                        //       // 登录跳转成功，根据登陆前设置的路由，跳转到对应的页面
                        //       var pages = wx.getStorageSync('router_after_login');
                        //       app.handleRoutes(pages, 0);
                        //     }
                        //   });
                        //   userData = 2;
                        // } 
                        else if (userData == 2){
                          wx.reLaunch({
                            url: '/pages/web/leadership-index',
                            success: function (e) {
                              // 登录跳转成功，根据登陆前设置的路由，跳转到对应的页面
                              var pages = wx.getStorageSync('router_after_login');
                              app.handleRoutes(pages, 0);
                            }
                          });
                        }
                        else if (userData == 3){
                          wx.reLaunch({
                            url: '/pages/web/cityLeaderIndex',
                            success: function (e) {
                              // 登录跳转成功，根据登陆前设置的路由，跳转到对应的页面
                              var pages = wx.getStorageSync('router_after_login');
                              app.handleRoutes(pages, 0);
                            }
                          });
                        } else {
                          wx.reLaunch({
                            url: '/pages/web/visitorIndex',
                            success: function (e) {
                              // 登录跳转成功，根据登陆前设置的路由，跳转到对应的页面
                              var pages = wx.getStorageSync('router_after_login');
                              app.handleRoutes(pages, 0);
                            }
                          });
                          userData = 1;
                        }

                        wx.setStorageSync('userData', userData);
                      } else {
                        // wx.showModal({
                        //   title: "温馨提示",
                        //   content: "请求失败",
                        //   showCancel: false,
                        //   confirmText: "确定"
                        // });
                      }
                    } else {
                      // wx.showModal({
                      //   title: "温馨提示",
                      //   content: "网络连接或服务器内部错误",
                      //   showCancel: false,
                      //   confirmText: "确定"
                      // });
                    }
                  });
                } else if (e.data.resultcode == '200' && e.data.code == 'LN_500') {
                  //说明登录失败
                  wx.showModal({
                    title: "温馨提示",
                    content: '用户名或密码错误',
                    showCancel: false,
                    confirmText: "确定"
                  });
                } else {
                  //说明登录失败
                  // wx.showModal({
                  //   title: "温馨提示",
                  //   content: e.data.ResultInfo,
                  //   showCancel: false,
                  //   confirmText: "确定"
                  // });
                }
              } else {
                // wx.showModal({
                //   title: "温馨提示",
                //   content: "网络连接或服务器内部错误",
                //   showCancel: false,
                //   confirmText: "确定"
                // });
              }
            } else {
              // wx.showModal({
              //   title: "温馨提示",
              //   content: "网络连接或服务器内部错误",
              //   showCancel: false,
              //   confirmText: "确定"
              // });
            }
          });
        } else {
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "网络连接或服务器内部错误",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
        }
      })

    } else if (that.data.currentTab == 1) {
      if (!this.data.mobile) {
        wx.showModal({
          title: "温馨提示",
          content: "请输入手机号",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }

      let reg = new RegExp('^[1][3,4,5,7,8,9][0-9]{9}$');
      if (!reg.test(this.data.mobile)) {
        wx.showModal({
          title: "温馨提示",
          content: "请输入正确的手机号",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }

      if (!this.data.imgcode) {
        wx.showModal({
          title: "温馨提示",
          content: "请输入校验码",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }


      if (!this.data.smscode) {
        wx.showModal({
          title: "温馨提示",
          content: "请输入验证码",
          showCancel: false,
          confirmText: "确定"
        });
        return;
      }
      that.mobileLogin(that);
    }

  },




  //获取图形验证码接口
  imgcodeApi: function() {
    var that = this;
    var url = app.globalData.oldBaseUrl + app.globalData.imgcodeApi + "?sig=" + that.data.sig;
    that.setData({
      imgcodeUrl: url
    });
  },

  //获取前端手机号
  getMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  //获取前端验证码
  getSmsCode: function(e) {
    this.data.smscode = e.detail.value;
  },

  //获取前端校验码
  getImgCode: function(e) {
    this.data.imgcode = e.detail.value;
  },

  //发送短信验证码
  sendSmsCode: function(e) {
    var that = this;

    var url = app.globalData.oldBaseUrl + app.globalData.smsApi;
    //校验手机号是否格式正确
    let reg = new RegExp('^[1][3,4,5,7,8,9][0-9]{9}$');
    if (!reg.test(this.data.mobile)) {
      wx.showModal({
        title: "温馨提示",
        content: "请输入正确的手机号",
        showCancel: false,
        confirmText: "确定"
      });
      return;
    }
    var param = {
      mobile: that.data.mobile,
      imgcode: that.data.imgcode,
      sig: that.data.sig,
    }

    util.callAjaxGet(url, param, function(e) {
      if (e) {
        if (e.statusCode == '200') {
          if (e.data.resultcode == '0') {
            // wx.showModal({
            //   title: "温馨提示",
            //   content: e.data.msg,
            //   showCancel: false,
            //   confirmText: "确定"
            // });
          } else {
            that.setData({
              sendSmsCodeShow: true
            });

            var currentTime = that.data.currentTime;
            that.setData({
              time: currentTime
            })
            var interval = setInterval(function() {
              that.setData({
                time: (currentTime - 1)
              })
              currentTime--;
              if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                  time: '',
                  currentTime: 59,
                  sendSmsCodeShow: false
                })
              }
            }, 1000)

          }
        } else {
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "网络连接或服务器内部错误",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
        }
      } else {
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "网络连接或服务器内部错误",
        //   showCancel: false,
        //   confirmText: "确定"
        // });
      }
    });

  },

  //手机验证登录
  mobileLogin: function(that) {
    var that = this;
    var url = app.globalData.oldBaseUrl + app.globalData.validateApi;
    var param = {
      mobile: that.data.mobile,
      smsCode: that.data.smscode,
      imgcode: that.data.imgcode,
      sig: that.data.sig,
    }

    let userDataf = null;
    let params = {
      loginId: param.mobile,
      password: param.imgcode
    }
    let urlGetMenber = app.globalData.bidBaseUrl + '/yjapi/expert/v2/getMenber';
    util.callAjaxGet(urlGetMenber, params, function(resl) {
      if (resl.data.resultcode == '0000') {
        userDataf = resl.data.data.role;


        util.callAjaxGet(url, param, function(e) {
          if (e) {
            if (e.statusCode == '200') {
              if (e.data.resultcode == '1') {
                // if (e.data.isNjGuzhu) {
                  //说明登录成功  保存当前登录的用户
                  wx.setStorageSync('username', that.data.mobile);
                  wx.setStorageSync('jfId', e.data.data.jfId);
                  wx.setStorageSync('jfcode', e.data.data.jfcode);
                  wx.setStorageSync('userId', e.data.data.userId);
                  wx.setStorageSync('headicon', '');
                  wx.setStorageSync('isLogin', true);
                  wx.setStorageSync('realname', e.data.data.realname);
                  wx.setStorageSync('mobile', that.data.mobile);
                  // 登录游客首页
                if (userDataf == 2 || userDataf == 3 ) {
                    wx.redirectTo({
                      url: '/pages/web/cityLeaderIndex',
                      success: function(e) {
                        let currPage = getCurrentPages().pop();
                        if (currPage == undefined || currPage == null) return;
                        currPage.onLoad();
                      }
                  });
                  userDataf = 3;
                  } else {
                    // url: '/pages/web/leadership-index',
                    wx.redirectTo({
                      url: '/pages/web/visitorIndex',
                      success: function(e) {
                        let currPage = getCurrentPages().pop();
                        if (currPage == undefined || currPage == null) return;
                        currPage.onLoad();
                      }
                    });
                  }
                // } else {
                  // wx.showModal({
                  //   title: "温馨提示",
                  //   content: "不是采购商账户",
                  //   showCancel: false,
                  //   confirmText: "确定"
                  // });
                // }
              } else {
                // wx.showModal({
                //   title: "温馨提示",
                //   content: e.data.msg,
                //   showCancel: false,
                //   confirmText: "确定"
                // });
              }
            } else {
              // wx.showModal({
              //   title: "温馨提示",
              //   content: "网络连接或服务器内部错误",
              //   showCancel: false,
              //   confirmText: "确定"
              // });
            }
          } else {
            // wx.showModal({
            //   title: "温馨提示",
            //   content: "网络连接或服务器内部错误",
            //   showCancel: false,
            //   confirmText: "确定"
            // });
          }
        });


      } else {
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "网络连接或服务器内部错误",
        //   showCancel: false,
        //   confirmText: "确定"
        // });
      }
    })

  },
  //刷新校验码
  refreshverify: function(e) {
    var that = this;
    var sig = uuid.getUuid(16, 16);
    var url = app.globalData.oldBaseUrl + app.globalData.imgcodeApi + "?sig=" + sig;
    that.setData({
      sig: sig,
      imgcodeUrl: url
    });
  },
  //跳转到保密协议页面
  toSecret:function(){
    wx.navigateTo({
      url: `/pages/web/secrecyAgreement`
    });
  }
})