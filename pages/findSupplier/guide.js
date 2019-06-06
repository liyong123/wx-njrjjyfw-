// pages/findSupplier/guide.js
Page({

  changeTab: function (e) {
    this.setData({
      currentTabIndex: e.target.dataset.index * 1
    })
  },
  
  guideLink: function () {
    wx.redirectTo({
      url: '/pages/user/login',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex: 0,
    cgdwImgs: [
      {
        src: "http://qdrc.jfh.com/qingdao/webchat/jfh/page/cg/supplier-guide-bg1.jpg",
        key: 1,
      },
      {
        src: "http://qdrc.jfh.com/qingdao/webchat/jfh/page/cg/supplier-guide-bg2.jpg",
        key: 2,
      },
      {
        src: "http://qdrc.jfh.com/qingdao/webchat/jfh/page/cg/supplier-guide-bg3.jpg",
        key: 3,
      }
    ],
    gysImgs: [
      {
        src: "http://qdrc.jfh.com/qingdao/webchat/jfh/page/cg/supplier-guide-bg4.jpg",
        key: 4,
      },
      {
        src: "http://qdrc.jfh.com/qingdao/webchat/jfh/page/cg/supplier-guide-bg5.jpg",
        key: 5,
      },
      {
        src: "http://qdrc.jfh.com/qingdao/webchat/jfh/page/cg/supplier-guide-bg6.jpg",
        key: 6,
      }
    ],
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