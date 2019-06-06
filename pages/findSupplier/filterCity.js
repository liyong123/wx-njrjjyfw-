// pages/findSupplier/filter.js
let City = require('../../util/allCity.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: City
  },

  bindtap(e) {
    console.log(e.detail);
    const {name, key} = e.detail;
    const choosedCity = name;
    const pages = getCurrentPages(); //获取页面栈
    let currpage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面（父页面）
    prevPage.setData({
      choosedCity
    });  // 对上一个页面直接调用setData进行数据修改绑定
    
    wx.navigateBack();
  },
  input(e) {
    this.value = e.detail.value
  },
  searchMt() {
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if (!this.value) {
      this.value = '';
    }
    this.setData({
      value: this.value
    })
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