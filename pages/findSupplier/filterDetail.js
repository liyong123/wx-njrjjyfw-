// pages/findSupplier/filterDetail.js
import util from '../../util/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosedCity: { "cityCode": "1","cityName": "全国"},
    //choosedCityIndex:[0,0],
    //cityIndex:[0,0],
    choosedCityIndex:0,
    cityIndex:0,

    choosedIndustry: { "indCode": "1","indName": "全部"},
    choosedIndustryIndex:0,
    industryIndex:0,

    choosedWorkType: { tagCode: '1', tagName: '全部' },
    workTypeIndex: 0,

    rawHotCities:[],
    rawCities: [],
    // cities: [[{
    //   "cityCode": "0",
    //   "cityName": "热门城市"
    //   },{
    //     "cityCode": "1",
    //     "cityName": "全国"
    //   }],[]],
    cities:[],

    rawIndustries:[],  
    industries: [],

    workTypes: [],

    initialFiliter:[],
  },

  /*cityChanged:function(e){
    var index = e.detail.value;
    this.setData({
      choosedCityIndex:index,
      choosedCity:this.data.cities[1][index[1]],
    })
  },
  cityCancel:function(e){
    var data = {
      cityIndex: this.data.choosedCityIndex,
      cities: this.data.cities,
      choosedCity: this.data.choosedCity
    }

    if (this.data.cityIndex[0] != this.data.choosedCityIndex[0]) {
      data.cities[1] = this.data.choosedCityIndex[0] == 0 ? this.data.rawHotCities : this.data.rawCities;
    }
    data.choosedCity = this.data.cities[1][this.data.choosedCityIndex[1]]
    this.setData(data)
  },
  cityColumnChanged: function(e){
    var data = {
      "cities": this.data.cities,
      "cityIndex": this.data.cityIndex
    }
    data.cityIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0: // 滑动第0列
        switch(data.cityIndex[0]) { 
          case 0: // 热门城市
            data.cities[1] = this.data.rawHotCities;
            break;
          case 1: // 全国
            data.cities[1] = this.data.rawCities;
            break;
        }
        data.cityIndex[1] = 0;
        break; 
      case 1:
      break;
    }
    this.setData(data);
  },*/
  cityChanged: function (e) {
    var index = e.detail.value;
    this.setData({
      choosedCityIndex: index,
      choosedCity: this.data.cities[index]
    })
  },
  cityCancel: function () {
    this.setData({
      cityIndex: this.data.choosedCityIndex
    })
  },

  industryChanged: function (e) {
    var index = e.detail.value;
    this.setData({
      choosedIndustryIndex: index,
      choosedIndustry: this.data.industries[index]
    })
  },
  industryCancel:function(){
    this.setData({
      industryIndex: this.data.choosedIndustryIndex
    })
  },

  // 选择工作类型
  workTypeChanged: function (event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      choosedWorkType: this.data.workTypes[index],
      workTypeIndex: index
    });

    // const 
  },

  // 确认按钮
  confirmSearch: function(event) {
    var isHot = false;
    if (this.data.rawHotCities.length > 0 && this.data.cityIndex[0]==0) isHot = true;
    this.data.choosedCity.isHot = isHot;

    var filterData = [{},{},{}];
    if (this.data.choosedCity.cityCode != '1') filterData[0] = this.data.choosedCity;
    if (this.data.choosedIndustry.indCode != '1') filterData[1] = this.data.choosedIndustry;
    if (this.data.choosedWorkType.tagCode != '1') filterData[2] = this.data.choosedWorkType;

    console.log('输出选择是', filterData)
    const pages = getCurrentPages(); //获取页面栈
    let currpage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面（父页面）
    prevPage.setData({
      filterData
    });  // 对上一个页面直接调用setData进行数据修改绑定
    wx.navigateBack();
  },

  // 重置按钮
  resetSearch: function() {
    var index = 0;
    this.data.cities[1] = this.data.rawCities;
    this.setData({
      cityIndex: [1,0],
      choosedCity: this.data.cities[1][0],
      cities: this.data.cities,

      industryIndex: index,
      choosedIndustry: this.data.industries[index],

      workType: this.data.workTypes[index],
      workTypeIndex: index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var filter = JSON.parse(decodeURIComponent(options.filter || '[{},{},{}]'));
    console.log('输入选择是', filter);
    this.data.initialFiliter = filter;

    this.getWorkTypes();
    this.getHotCities();
    this.getCities();
    this.getIndustries();
  },

  /**
   * 获取数据
   */
  getHotCities:function(){
    var that = this;
    var url = app.globalData.bidBaseUrl + app.globalData.popularList;
    util.callAjaxNoToast(url, { 'popuType': 'wxrmc' }, function (res) {
      var data = res.data.data||[];
      var list = [];
      for(var i = 0; i < data.length; i++){
        list[i] = {
          cityCode : data[i].code,
          cityName : data[i].cnName,
        }
      }
      that.setData({
        rawHotCities: list,
      })
      if (that.data.rawCities.length > 0) that.initCityPicker();
    })
  },

  getCities:function(){
    
    if (app.globalData.savedBasicInfo.city){
      var saved =  wx.getStorageSync('filter-city') || [];
      if (saved.length > 0) {
        this.setData({
          'rawCities': saved,
        })
        //if (this.data.rawHotCities.length > 0) this.initCityPicker();
        this.initCityPicker();
        return;
      }
    } 

    var list = [{
      "cityCode": "1",
      "cityName": "全国"
    }];
    var url = app.globalData.yjBaseUrl + app.globalData.queryCity;

    var that = this;
    util.callAjaxGetRestful(url, {}, res => {
      if (res) {
        if (res.data.status == 1) {
          list = list.concat(res.data.data || []);
          that.setData({
            'rawCities': list,
          })
          //if (that.data.rawHotCities.length > 0) that.initCityPicker();
          that.initCityPicker();

          wx.setStorageSync('filter-city', list);
          app.globalData.savedBasicInfo.city = true;
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  getIndustries:function(){
    if (app.globalData.savedBasicInfo.industry) {
      var saved = wx.getStorageSync('filter-industry') || [];
      if (saved.length > 0) {
        this.setData({
          rawIndustries: saved,
        })
        this.initIndustryPicker();
        return;
      }
    } 

    var list = [{
      "indCode": "1",
      "indName": "全部"
    }]

    var url = app.globalData.yjBaseUrl + app.globalData.queryIndustry;

    var that = this;
    util.callAjaxGetRestful(url, {}, res => {
      if (res) {
        if (res.data.status == 1) {
          list = list.concat(res.data.data || []);
          that.setData({
            rawIndustries: list,
          })
          that.initIndustryPicker();
          
          wx.setStorageSync('filter-industry', list);
          app.globalData.savedBasicInfo.industry = true;
        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  getWorkTypes:function(){
    if (app.globalData.savedBasicInfo.worktype) {
      var saved = wx.getStorageSync('filter-worktype') || [];
      if (saved.length > 0) {
        this.setData({
          workTypes: saved,
        })
        this.initWorkType();
        return;
      }
    } 

    var list = [{ tagCode: '1', tagName: '全部' }];

    var url = app.globalData.yjBaseUrl + app.globalData.queryWorkType;

    var that = this;
    util.callAjaxGetRestful(url, {}, res => {
      if (res) {
        if (res.data.status == 1) {
          list = list.concat(res.data.data || []);
          that.setData({
            workTypes: list,
          })
          that.initWorkType();

          wx.setStorageSync('filter-worktype', list);
          app.globalData.savedBasicInfo.worktype = true;

        } else {
          util.showAjaxTip();
        }
      } else {
        util.showAjaxTip();
      }
    })
  },

  // initCityPicker: function(){
  //   var inital = this.data.initialFiliter[0];

  //   var data = {
  //     cities: this.data.cities,
  //     cityIndex: this.data.cityIndex
  //   }
  //   // 全国
  //   if (JSON.stringify(inital) == '{}') {
  //     data.cities[1] = this.data.rawCities;
  //     data.cityIndex = [1,0];
  //   }else {
  //     if (intial.isHot) { // 热门城市
  //       data.cities[1] = this.data.rawHotCities;
  //       for(var i = 0; i < this.data.rawHotCities.length; i++) {
  //         if (this.data.rawHotCities[i].cityCode == inital.cityCode) {
  //           data.cityIndex = [0, i];
  //           break;
  //         }
  //       }
  //     }else { // 省市
  //       for (var i = 0; i < this.data.rawCities.length; i++) {
  //         if (this.data.rawCities[i].cityCode == inital.cityCode) {
  //           data.cityIndex = [1, i];
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   data.choosedCityIndex = data.cityIndex;
    
  //   this.setData(data);
  // },
  initCityPicker: function () {
    var inital = this.data.initialFiliter[0];

    var data = {
      cities: this.data.rawCities,
      cityIndex: this.data.cityIndex
    }
    // 全国
    if (JSON.stringify(inital) == '{}') {
      data.cityIndex = 0;
    } else {
      for (var i = 0; i < data.cities.length; i++) {
        if (data.cities[i].cityCode == inital.cityCode) {
          data.cityIndex = i;
          break;
        }
      }
    }
    data.choosedCityIndex = data.cityIndex;
    data.choosedCity = data.cities[data.choosedCityIndex];

    this.setData(data);
  },

  initIndustryPicker:function(){
    var inital = this.data.initialFiliter[1];

    var data = {
      industries: this.data.rawIndustries,
      industryIndex: this.data.industryIndex
    }
    // 全部行业
    if (JSON.stringify(inital) == '{}') {
      data.industryIndex = 0;
    }else {
      for (var i = 0; i < data.industries.length; i++) {
        if (data.industries[i].indCode == inital.indCode) {
          data.industryIndex = i;
          break;
        }
      }
    }
    data.choosedIndustryIndex = data.industryIndex;
    data.choosedIndustry = data.industries[data.choosedIndustryIndex];
    this.setData(data);
  },

  initWorkType: function(){
    var inital = this.data.initialFiliter[2];
    var index = 0;
    if (JSON.stringify(inital) == '{}'){ // 全部
      index = 0;
    }else{
      for (var i = 0; i < this.data.workTypes.length; i++) {
        if (this.data.workTypes[i].tagCode == inital.tagCode) {
          index = i;
          break;
        }
      }
    }
    this.setData({
      workTypeIndex: index,
    })
  }

})