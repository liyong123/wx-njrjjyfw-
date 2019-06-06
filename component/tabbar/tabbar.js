// component/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pages: {
      type: Array,
      value: []
    }
  },

  ready() {
    const currentPath = `/${getCurrentPages()[getCurrentPages().length - 1].__route__}`;
    this.setData({ currentPath });
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateTo: function (e) {
      const { pagePath, params } = e.currentTarget.dataset.page;
      let query = [];
      for (let key in params) {
        query.push(`${key}=${params[key]}`);
      }
      wx.reLaunch({
        url: query.length > 0 ? `${pagePath}?${query.join('&')}` : pagePath,
      })
    }
  }
})
