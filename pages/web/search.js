// bu_pages/serviceMarket/search.js
var util = require('../../util/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recents: [],
    hots: [],
    searchName: '',

    windowWidth: 0,
    windowHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.data.windowWidth = res.windowWidth;
        that.data.windowHeight = res.windowHeight;
      },
    })

    // 从本地存储获取最近搜索
    this.setData({
      recents: this.getRecentSearches(),
      searchName: options.text,
      isHome: options.isHome
    })

    // 从服务器获取热门数据
    this.fetchHots();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 热门数据
   */
  fetchHots: function () {
    var that = this;
    var url = app.globalData.bidBaseUrl + app.globalData.popularList;
    util.callAjaxNoToast(url, {'popuType':'wxrms'},function (res) {
        console.log(res);
        var list = res.data.data || [];
        var data = [];
        for (var i = 0; i < list.length; i++) {
          data.push(list[i].cnName);
        }
        that.setData({
          hots: data,
        })
      })
  },

  /**
   * search
   */
  beginSearch: function (str) {
    const pages = getCurrentPages(); //获取页面栈
    let currpage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面（父页面）
    prevPage.setData({
      searchName: this.data.searchName,
      refresh: true
    });  // 对上一个页面直接调用setData进行数据修改绑定

    if (str.length != 0) this.addRecentSearch(str);
    if (this.data.isHome) {
      wx.redirectTo({
        url: `../../pages/web/demandDetail?searchName=${this.data.searchName}`,
      })
    } else {
      wx.navigateBack();
    }
  },

  /**
  * 搜搜图标点击
  */
  searchIconClicked: function (e) {
    this.beginSearch(this.data.searchName);
  },
  /**
   * 输入框键盘搜索
   */
  searchInputConfirmed: function (e) {
    console.log('begin:' + this.data.searchName)
    this.beginSearch(this.data.searchName);
  },

  /**
   * 输入框变动
   */
  searchInputChanged: function (e) {
    this.setData({
      searchName: e.detail.value,
    })
  },
  /**
   * 清空搜索框
   */
  searchClearClicked: function (e) {
    console.log('searchClearClicked')
    this.setData({
      searchName: '',
    })
  },

  /**
   * 取消搜索
   */
  cancelClicked: function (e) {
    wx.navigateBack({
      delta: 1,
    })
  },

  getRecentSearches:function(){
    // 从本地存储获取最近搜索
    return wx.getStorageSync('recent_search2') || [];
  },

  addRecentSearch:function(text) {
    if (text.length == 0) return;

    var recents = this.getRecentSearches();
    var length = recents.length;
    for (var i = 0; i < length; i++) {
      if (recents[i] == text) {
        recents.splice(i, 1);
        break;
      }
    }
    recents.unshift(text);
    if (recents.length > 10) {
      recents.splice(10, recents.length - 10);
    }
    wx.setStorageSync('recent_search2', recents);
  },

  /**
   * 点击搜索项
   */
  searchItemClicked: function (e) {
    var str = e.target.dataset.value;
    this.data.searchName = str;
    this.beginSearch(str);
  }
})