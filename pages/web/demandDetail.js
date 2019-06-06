// pages/web/demandDetail.js
import util from '../../util/util.js';
import time from '../../util/dateUtil.js';
import { pages } from '../../auth.js';
const jfId = wx.getStorageSync('jfId');
let app = getApp();
const urlDemend = app.globalData.bidBaseUrl + app.globalData.urlDemend;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAd:true,
    pageNo: 1,
    pageSize: 10,
    searchName: '',
    listIsEnd: false,
    refresh: false,
    list: [],
    listSort: {
      putTime: { type: 'desc' },
      bidValidtime: { type: 'icon' },
      planPrice: { type: 'icon' }
    },
    filterData: [],
    sortStatusList: {
      putTime: true,
      bidValidtime: false,
      planPrice: false
    },
    imgUrls: [], //轮播图  图片地址
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 2000, //自动切换时间间隔,3s
    duration: 500, //  滑动动画时长1s
    showTabbar: false,
    pages: []
  },

  // 跳转到筛选页面
  filterClick: function () {
    wx.navigateTo({
      url: '/pages/findSupplier/filterDetail'
    });
  },

  // 搜索确认
  searchDemand: function(event) {
    this.setData({
      list: [],
      searchName: event.detail.value
    }, ()=> {this.loadList()});
  },

  /**
   * 搜索框点击
   */
  searchClick: function (e) {
    wx.navigateTo({
      url: './search?text=' + this.data.searchName,
    })
  },

  // 供应商排序   registeredAssets:注册资本  registeredAssets:人员规模  annualSales:年营业额
  sortItemClick: function (event) {
    wx.pageScrollTo({
      scrollTop: 0,
    })
    const that = this;
    const sortType = event.currentTarget.dataset.sortType;
    let currentType;

    if (this.data.listSort[sortType].type === 'icon') {
      currentType = 'desc';
    } else if (this.data.listSort[sortType].type === 'desc') {
      currentType = 'asc';
    } else if (this.data.listSort[sortType].type === 'asc') {
      currentType = 'desc';
    };
    //判断升降序图标

    this.data.listSort[sortType].type = currentType;
    if (sortType === 'planPrice') {
      that.setData({
        listSort: {
          planPrice: { type: currentType },
          putTime: { type: 'icon' },
          bidValidtime: { type: 'icon' }
        },
      });
    } else if (sortType === 'putTime') {
      that.setData({
        listSort: {
          planPrice: { type: 'icon' },
          putTime: { type: currentType },
          bidValidtime: { type: 'icon' }
        },
      });
    } else if (sortType === 'bidValidtime') {
      that.setData({
        listSort: {
          planPrice: { type: 'icon' },
          putTime: { type: 'icon' },
          bidValidtime: { type: currentType }
        },
      });
    }
    // that.setData({
    //   listSort: this.data.listSort
    // });

    let sortStatusList = this.data.sortStatusList;
    let itemStatus;
    for (itemStatus in sortStatusList) {
      if (itemStatus === sortType) {
        sortStatusList[itemStatus] = true;
      } else {
        sortStatusList[itemStatus] = false;
      }
    }
    that.setData({
      sortStatusList,
      pageNo: 1
    }, () => {
      this.loadList()
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var showTabbar = options.isTabbar == 'true'; 
    const userData = wx.getStorageSync("userData") || '0';
    this.setData({
      showTabbar,
      pages: pages[userData * 1]
    })
    if (options.searchName) {
      this.setData({ 
        searchName: options.searchName    
      })
    }
    this.setData({
      pageNo: 1,
    }, () => {
      this.loadList();
    })
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
    var that = this;
    const url = app.globalData.bidBaseUrl + app.globalData.hotSupplierListApi;
    // const url = "https://njdev.jfh.com" + "/yjapi/wx/v1/pro/dictList";
    var params = {
      type:"wxxqdt"
    };
    //需求大厅轮播图接口
    util.callAjaxGetSign(url, params, res => {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == '0000') {
            that.setData({
               imgUrls:res.data.data || []
            }) 
        }else {
          console.log("需求大厅轮播图获取失败！")
        }
      }
    })

    if(this.data.refresh) {
      this.setData({
        pageNo: 1,
        refresh: false
      }, () => {
        this.loadList();
      })
    }
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
    this.setData({
      pageNo: this.data.pageNo + 1,
    }, () => {
      this.loadList();
    })
  },
 
  formatTime: function (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].bidValidtime) {
        data[i].bidValidtime = time.formatTimeTwo(data[i].bidValidtime, 'Y-M-D');
      } else {
        data[i].bidValidtime = '无';
      }
      if (data[i].putTime){
        data[i].putTime = time.formatTimeTwo(data[i].putTime, 'Y-M-D');
      } else {
        data[i].putTime = '无';
      }
    }
    return data;
  },

  loadList: function () {
    let {
      pageNo,
      pageSize,
      list,
      listSort,
      sortStatusList,
      searchName
    } = this.data;

    let orderBy = 'planPrice';
    let sequence = '2';
    for (let key in sortStatusList) {
      if (sortStatusList[key]) {
        orderBy = key;
      }
    }

    sequence = listSort[orderBy].type === 'desc' ? 2 : 1;
    
    let params = {
      jfId,
      pageNo,
      pageSize,
      orderBy,
      sequence,
      searchName
    };

    util.callAjaxGetSign(urlDemend, params, res => {
      wx.stopPullDownRefresh();
      if (res) {
        // console.log(res);
        if (res.data.resultcode == '0000') {
          // 时间转换
          res.data.data = this.formatTime(res.data.data);
          if (pageNo == 1) {
            this.setData({
              list: res.data.data,
              listIsEnd: res.data.data.length < pageSize
            })
          } else {
            this.setData({
              list: list.concat(res.data.data),
              listIsEnd: res.data.data.length < pageSize
            })
          }

        } else {
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "数据提交失败，请联系客服:400-064-0003",
          //   showCancel: false,
          //   confirmText: "确定"
          // });
        }
      } else {
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "数据提交失败，请联系客服:400-064-0003",
        //   showCancel: false,
        //   confirmText: "确定"
        // });
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  /**
   * 点击供应商，查看详情
   */
  supplierItemCilck: function (e) {
    const { spid, spno } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/web/demandDetail1?orderId=${spid}&orderNo=${spno}`,
    })
  },

  closeAd: function (e) {
    this.setData({
      showAd: false
    })
  },
  // 跳转公告信息
  gotoBullInfo: function (e) {
    wx.navigateTo({
      url:""
      // url: `/pages/web/bullinfo?id=${e.target.dataset.id}`
    });
  },
})