//filter.js
const app = getApp();
const appData = app.globalData;

function identityFilter(pageObj) {
  if (pageObj.onShow) {
    let _onShow = pageObj.onShow;
    pageObj.onShow = function() {
      const currentInstance = getPageInstance();
      currentInstance.setData({
        expertAvatarUrl: appData.expertAvatarUrl,
        supplierAvatarUrl: appData.supplierAvatarUrl
      })
      const route = currentInstance.__route__;
      // 白名单不登录也能访问的页面
      const whiteList = [
        "pages/web/visitorIndex", // 游客首页
        "pages/user/index", //我的
        "pages/user/login", // 登录页
        "pages/web/demandPublish",
        "pages/user/cooperation",
        "pages/user/myFocus",
      ]
      let escapeLogin = false
      whiteList.forEach(wl => {
        route === wl && (escapeLogin = true);
      })

      //  不同权限跳转不同登录页
      const userData = wx.getStorageSync("userData") + "";
      switch (userData) {
        case "":
        case "1":
          if (route == "pages/web/index" || route == "pages/web/leadership-index") {
            // wx.navigateToMiniProgram({
            //   appId: app.globalData.touristAppid,
            //   path: '/pages/web/visitorIndex',
            //   envVersion: app.globalData.env
            // })

            wx.redirectTo({
              url: '/pages/web/visitorIndex',
            })
            return;
          };
          break;
        case "2":
          if (route == "pages/web/visitorIndex" || route == "pages/web/index") {
            wx.redirectTo({
              url: '/pages/web/leadership-index',
            })
            return;
          };
          break;
        case "3":
          if (route == "pages/web/index" || route == "pages/web/visitorIndex") {
            // if (route == "/pages/web/leadership-index" || route == "pages/web/visitorIndex") {
            wx.redirectTo({
              url: '/pages/web/cityLeaderIndex',
              // url: '/pages/web/index',
            })
            return;
          };
          break;
      }

      // 不在白名单中的页面要判断登录，否则跳游客首页
      if (!escapeLogin) {
        app.checkLogin(() => {
          //获取页面实例，防止this劫持               
          _onShow.call(currentInstance);

        }, () => {
          //跳转到登录页
          // wx.navigateToMiniProgram({
          //   appId: app.globalData.touristAppid,
          //   path: '/pages/web/visitorIndex',
          //   envVersion: app.globalData.env
          // })

          wx.redirectTo({
            url: '/pages/user/login',
          })
        });
      } else {
        _onShow.call(currentInstance);
      }
    }
  }
  return pageObj;
}

function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

exports.identityFilter = identityFilter;