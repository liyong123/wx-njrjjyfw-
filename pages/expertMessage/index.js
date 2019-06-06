// pages/expertMessage/index.js
import util from '../../util/util.js';
var app = getApp()
var baseUrl = app.globalData.bidBaseUrl; 
var apiExpert = app.globalData.expertDetailApi;//获取页面数据接口
var apiFormSubmit = app.globalData.expertFormSubmitApi;//表单提交接口
var addFocusUrl = app.globalData.addFocusApi;//关注专家
var deleteFocusUrl = app.globalData.deleteFocusApi;//取消关注专家
var expertLabelAll = [];
var workExperienceAll = [];
var expertRemarkAll = "";
var shareUrlParams = "";
var jfId = wx.getStorageSync("jfId");
Page({
  data: {
    photo_url:"",
    name:"",
    sex:"",
    positional_title:"",
    age:"",
    birth_date:"",
    workinglife: "",
    province: "",
    city: "",
    score: "",
    count: "",
    followCount: "",
    expert_label: "",
    unit_name: "",
    job: "",
    workExperience: [],
    showExpericencedBtn:true,
    hideExpericencedBtn:true,
    showIntrodutionBtn:true,
    hideIntrodutionBtn:true,
    CONTENT:"",
    personal_achievement:[],
    expert_remark:"",
    mobile:"",
    projects:[],
    addFocusTrue:false,
    deleteFocusTrue:true,
    saveApplyExpertStatus: "0",
    identityContentWidth:(wx.getSystemInfoSync().windowWidth -110)+ "px",
    identityContentWidth2: (wx.getSystemInfoSync().windowWidth - 150) + "px",
    showDownDisabled:true,
    showUpDisabled:true,
    workResult:"",
    projects:[],
    personalProfile:""
  },


  onLoad: function (options) {
    var that = this;
    var jfId0 = wx.getStorageSync("jfId");
    shareUrlParams = options.jfId;
    var params = {
      "jfId":options.jfId,
      "jfIdMySelf": jfId0
    }
    var url = baseUrl + apiExpert;
    util.callAjaxGetSign(url, params,function(res){
      console.log("res:",res)
      wx.stopPullDownRefresh();
      if (res){
        if (res.data.resultcode == "0000"){
          var data = res.data.data;
          var identitiesOrgin = data.expert_label;
          var identitiesArr = [];
          if (identitiesOrgin && identitiesOrgin.length > 0) {
            identitiesArr = identitiesOrgin.split(",")
            expertLabelAll = [].concat(identitiesArr) ;
          };
          if (identitiesArr.length > 3) {
            identitiesArr = identitiesArr.splice(0, 3);
            that.setData({
              showDownDisabled: false
            })
          };
          //计算每一段工作经验的时长
          var workExperience = data.workExperience;
          for(var i = 0 ; i < workExperience.length ; i++) {
            var startTimeSec = new Date(workExperience[i].start_time);
            var endTimeSec = "";
            if (workExperience[i].end_time != "至今") {
              endTimeSec = new Date(workExperience[i].end_time);
            }else {
              endTimeSec = new Date()
            }
            var timeDif = endTimeSec.getTime() - startTimeSec.getTime();
            var yearTime = "";
            var monthTime= Math.floor(timeDif/(1000*60*60*24*30));
            if(monthTime == 0){
              workExperience[i].monthTime = 0;
              workExperience[i].yearTime = 0;
            } else if (monthTime > 0 && monthTime < 12){
              workExperience[i].monthTime = monthTime;
              workExperience[i].yearTime = 0;
            } else if (monthTime >= 12){
              yearTime = Math.floor(monthTime / 12);
              monthTime = monthTime % 12;
              workExperience[i].monthTime = monthTime;
              workExperience[i].yearTime = yearTime;
            }
          }
          workExperienceAll = [].concat(workExperience);
          if(workExperience.length > 2){
            workExperience = workExperience.splice(0, 2),
            that.setData({
              showExpericencedBtn:false
            })
          }
          var positionalTitle = "";
          if (data.positional_title){
            switch (data.positional_title) {
              case 1:
                positionalTitle = "初级职称";
                break;
              case 2:
                positionalTitle = "中级职称";
                break;
              case 3:
                positionalTitle = "副高职称";
                break;
              case 4:
                positionalTitle = "正高职称";
                break;
              default:
                positionalTitle = "暂无";
            }
          }
         
          var expertRemark = data.expert_remark;
          expertRemarkAll = data.expert_remark;
          if (expertRemark && expertRemark.length > 100) {
            expertRemark = expertRemark.substring(0,100);
            that.setData({
              showIntrodutionBtn:false
            })
          }
          var jfIdImg = wx.getStorageSync("jfId");
          that.setData({
            photo_url: app.globalData.expertAvatarUrl + '/' + shareUrlParams,
            name: data.name,
            positional_title: positionalTitle,
            sex: data.sex,
            age:data.age,
            birth_date:data.birth_date,
            workinglife:data.workinglife,
            province: data.province,
            city:data.city,
            score: data.score,
            count: data.count,
            followCount: data.followCount,
            expert_label: identitiesArr,
            unit_name: data.unit_name,
            job: data.job,
            workExperience: workExperience,
            CONTENT: data.CONTENT,
            personal_achievement: data.personal_achievement,
            expert_remark: expertRemark,
            mobile:data.mobile,
            projects:workExperienceAll,
            saveApplyExpertStatus: data.saveApplyExpertStatus
          })
        }else{
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "获取数据失败，请联系客服:400-064-0003",
          //   showCancel: false,
          //   confirmText: "关闭"
          // });
        }
      }else{
        // wx.showModal({
        //   title: "温馨提示",
        //   content: "获取数据失败，请联系客服:400-064-0003",
        //   showCancel: false,
        //   confirmText: "关闭"
        // });
      }
    })


  },
  /**
   * 生命周期函数--页面显示/切入前台时触发
   */
  onShow:function(){
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '',
      path: '/pages/expertMessage/index?jfId=' + shareUrlParams,
      imageUrl: "http://qdrc.jfh.com/qingdao/webchat/share/8781540027516_.pic_hd.jpg"
    }
  },
  //点击加关注
  addFocus:function(e){
    var that = this; 
    var addUrl = baseUrl + addFocusUrl;
    var jfIdAdd = wx.getStorageSync("jfId");
    var data = {
      "followJfid": jfIdAdd,
      "beFollowJfid": shareUrlParams,
      "followType":"2"
    }
    util.callAjaxGetSign(addUrl, data, function (res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == "0000") {
          that.setData({
            saveApplyExpertStatus:"1"
          })
        }else {
          that.setData({
            saveApplyExpertStatus: "0",
          })
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "关注失败",
          //   showCancel: false,
          //   confirmText: "关闭"
          // });
        }
      }

    })
  },
  //点击取消关注
  deleteFocus: function (e) {
    var that = this;
    var addUrl = baseUrl + deleteFocusUrl;
    var jfIdDel = wx.getStorageSync("jfId");
    var data = {
      "followJfid": jfIdDel,
      "beFollowJfid": shareUrlParams
    }
    util.callAjaxGetSign(addUrl, data, function (res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == "0000") {
          that.setData({
            saveApplyExpertStatus: "0",
          })
        } else {
          that.setData({
            saveApplyExpertStatus: "1",
          })
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "取消关注失败",
          //   showCancel: false,
          //   confirmText: "关闭"
          // });
        }
      }

    })
  },
  //“身份”的展示
  identityShowDownClick:function(e){
    var that = this;
    that.setData({
      expert_label: expertLabelAll,
      showDownDisabled: true,
      showUpDisabled:false
    })
  },
  //"身份" 的收起
  identityShowUpClick:function(e){
    var that = this;
    var identitiesArr = [];
     identitiesArr = [].concat(expertLabelAll);
    if (identitiesArr.length > 3) {
      identitiesArr = identitiesArr.splice(0, 3);
      that.setData({
        expert_label: identitiesArr,
        showDownDisabled: false,
        showUpDisabled: true
      })
    };
  },
  //查看全部工作经历 
  seeWorkExpericenceAllClick:function(){
    var that = this;
    that.setData({
      showExpericencedBtn:true,
      hideExpericencedBtn:false,
      workExperience:workExperienceAll
    })
  },
  //收起部分工作经历 
  seeWorkExpericencePartClick: function () {
    var that = this;
    var workExperienceArr = [];
    workExperienceArr = [].concat(workExperienceAll);
    if (workExperienceArr.length > 2) {
      workExperienceArr = workExperienceArr.splice(0, 2);
      that.setData({
        workExperience: workExperienceArr,
        showExpericencedBtn: false,
        hideExpericencedBtn: true
      })
    };
  },
  //联系电话
  callMe:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile,
    })
  },
  //个人简历展开
  showIntrodutionBtnClick:function(){
    var that = this;
    that.setData({
      showIntrodutionBtn: true,
      hideIntrodutionBtn:false,
      expert_remark: expertRemarkAll
    })
  },
  //个人简历收起
  hideIntrodutionBtnClick: function () {
    var that = this;
    var introdutionStr = expertRemarkAll;
    if (introdutionStr && introdutionStr.length > 100) {
      introdutionStr = introdutionStr.substring(0, 100);
      that.setData({
        showIntrodutionBtn: false,
        hideIntrodutionBtn:true,
        expert_remark: introdutionStr
      })
    }
  },
  //联系专家 表单提交
  formSubmit:function(e){
    var that = this;
    var formUrl = baseUrl + apiFormSubmit;
    var data = {
      expertJfid: parseInt(shareUrlParams),
      applyName: e.detail.value.applyName,
      applyPhone: e.detail.value.applyPhone,
      demandInterntion: e.detail.value.demandInterntion,
      appType:"0"
    }
    if (e.detail.value.applyName ==""  || e.detail.value.applyPhone == "" ){
      wx.showModal({
        title: "温馨提示",
        content: "您有必填项未填写",
        showCancel: false,
        confirmText: "关闭"
      });
      return
    }
    util.callAjaxGetSign(formUrl, data, function (res) {
      wx.stopPullDownRefresh();
      if (res) {
        if (res.data.resultcode == "0000") {
          wx.showModal({
            title: "提示",
            content: "提交成功",
            showCancel: false,
            confirmText: "关闭"
          });
        }else{
          // wx.showModal({
          //   title: "温馨提示",
          //   content: "提交失败",
          //   showCancel: false,
          //   confirmText: "关闭"
          // });
        }
      }
    })
  }

}) 