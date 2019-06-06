// pages/findSupplier/index.js
import util from '../../util/util.js';

const jfId = wx.getStorageSync('jfId');
var app = getApp();
import { pages } from '../../auth.js';

// bindtap = 'supplierItemCilck' data - spid="{{item.spId}}"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNO: 1,
    pageSize: 10,

    ads:[],
    showAd: true,

    preSearchText:'',
    searchText:'',

    listIsEnd: false,
    list:[],

    sortItems: [{
      key: 'buildtime',
      name: '注册时间',
      isAsc: false,
    },{
        key:'rstcapital',
        name:'注册资本',
        isAsc:false,
    }, {
        key: 'staff',
        name: '人员规模',
        isAsc: false,
      }],
    sortIndex: -1,

    preFilterData: [{},{},{}],
    filterData: [{},{},{}],

    domainsShowNum: 3,
    pages: [],

    logoUrl: 'https://qdrc.jfh.com/qingdao/webchat/supplier/supplier_logo.png',

    showTabbar: false,
    scrollTop: 0,
  },

// 跳转到筛选页面
  filterClick: function() {
    wx.navigateTo({
      url: './filterDetail?filter=' + encodeURIComponent(JSON.stringify(this.data.filterData))
    });
  },

// 供应商排序   registeredAssets:注册资本  registeredAssets:人员规模  annualSales:年营业额
  sortItemClick:function(event) {
    var index = event.currentTarget.dataset.index;
    
    if (index == this.data.sortIndex) {
      this.data.sortItems[index].isAsc = !this.data.sortItems[index].isAsc;
    }else if (this.data.sortIndex != -1){
      // 单项排序！！！！
      this.data.sortItems[this.data.sortIndex].isAsc = false;
    }

    this.setData({
      sortItems: this.data.sortItems,
      sortIndex: index,
      listIsEnd: false,
    });
    this.data.pageNO = 1;
    wx.showLoading({
      title: '',
    })
    this.loadList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userData = wx.getStorageSync("userData") || '0';
    var showTabbar = options.isTabbar == 'true'; 
    this.setData({ 
      pages: pages[userData * 1],
      showTabbar: showTabbar
    });
    wx.showLoading({
      title: '',
    })
    this.getAds();
    this.loadList();
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
    var refresh = false;
    if (this.data.searchText != this.data.preSearchText){
      refresh = true;
      this.data.preSearchText = this.data.searchText;
    }

    console.log(this.data.filterData);
    if (JSON.stringify(this.data.preFilterData) != JSON.stringify(this.data.filterData)) {
      refresh = true;
      this.data.preFilterData = this.data.filterData;
    }

    if (refresh) {
      if (this.data.sortIndex != -1) {
        this.data.sortItems[this.data.sortIndex].isAsc = false;
      }
      this.setData({
        sortIndex: -1
      })
      wx.showLoading({
        title: '',
      })
      this.data.pageNO = 1;
      this.loadList();
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
    console.log('pull down');
    this.data.pageNO = 1;
    this.setData({
      listIsEnd: false
    })
    wx.showLoading({
      title: '',
    })
    this.loadList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.listIsEnd) return;

    this.data.pageNO++;
    this.loadList();
  },

  /**
   * 广告图片
   */
  getAds: function(){
    let url = app.globalData.bidBaseUrl + app.globalData.hotSupplierListApi;

    // 页面头部轮播图
    let params = {
      type: 'wxzgysgg'
    }
    util.callAjaxGetSign(url, params, res => {
      if (res) {
        if (res.statusCode == '200') {
          //赋值
          this.setData({
            ads: res.data.data,
            showAd: res.data.data.length > 0
          })
        }
      }
    });
  },

  /**
   * 抓取供应商列表
   */
  loadList: function () {
    var url = app.globalData.yjBaseUrl + app.globalData.spList;
    var sortItem = this.data.sortItems[this.data.sortIndex] || '';
    var params = {
      'keyWord':this.data.searchText || '',
      'sort':sortItem ? sortItem.key : '',
      'sortType': sortItem ? (sortItem.isAsc ? 2: 1) : '',//0不排序，1降序，2升序,
      'page': this.data.pageNO,
      'rows':this.data.pageSize,
    }

    if (JSON.stringify(this.data.filterData[0]) != '{}') params.cityCode = this.data.filterData[0].cityCode;
    if (JSON.stringify(this.data.filterData[1]) != '{}') params.industry = this.data.filterData[1].indCode;
    if (JSON.stringify(this.data.filterData[2]) != '{}') params.workType = this.data.filterData[2].tagCode;

    var that = this;
    util.callAjaxGetRestful(url, params, res => {
      wx.hideLoading()
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.status == 1) {
          var newlist = res.data.data || [];
          var isEnd = newlist.length < that.data.pageSize;
          for(var i=0; i < newlist.length; i++){
            newlist[i].indName = (newlist[i].indName || '暂无').split(',', that.data.domainsShowNum);
            newlist[i].rstCapital = parseInt(newlist[i].rstCapital || 0) == 0 ? '未披露' : parseInt(newlist[i].rstCapital) + '万元'; 
          }
          //赋值
          if (that.data.pageNO == 1) {
            that.setData({
              list: newlist,
              listIsEnd: isEnd,
              scrollTop: 0,
            }, ()=>{
              // wx.pageScrollTo({
              //   scrollTop: 0,
              //   duration: 0
              // })
            })
          } else {
            that.setData({
              list: that.data.list.concat(newlist),
              listIsEnd: isEnd
            })
          }
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 关闭广告
   */
  closeAd: function(e){
    this.setData({
      showAd: false
    })
  },

  /**
   * 搜索框点击
   */
  searchClick: function(e){
    wx.navigateTo({
      url: './search?text=' + this.data.searchText,
    })
  },

  /**
   * 点击供应商，查看详情
   */
  supplierItemCilck: function(e) {
    // console.log(e);
    var spid = e.currentTarget.dataset.spid;
    wx.navigateTo({
      url: './detail?spid=' + spid,
    })
  }
})