import {
  QUERY_STATE_CAIGOUZHONG
} from './pages/list/constants.js'

module.exports = {
  pages: [
    [{
        "iconPath": "../../img/home1.png",
        "selectedIconPath": "../../img/home2.png",
        "pagePath": "/pages/web/visitorIndex",
        "text": "首页"
      },
      {
        "iconPath": "../../img/wd1.png",
        "selectedIconPath": "../../img/wd2.png",
        "pagePath": "/pages/user/index",
        "text": "我的"
      }
    ],
    // 游客权限
    [{
        "iconPath": "../../img/home1.png",
        "selectedIconPath": "../../img/home2.png",
        "pagePath": "/pages/web/visitorIndex",
        "text": "首页"
      },
      {
        "iconPath": "../../img/wd1.png",
        "selectedIconPath": "../../img/wd2.png",
        "pagePath": "/pages/user/index",
        "text": "我的"
      }
    ],
    // 员工权限

    [{
        "iconPath": "../../img/home1.png",
        "selectedIconPath": "../../img/home2.png",
        "pagePath": "/pages/web/leadership-index",
        "text": "首页"
      },
      {
        "iconPath": "../../img/xmlb1.png",
        "selectedIconPath": "../../img/xmlb2.png",
        "pagePath": "/pages/list/index",
        "text": "项目列表"
      },
      {
        "iconPath": "../../img/zgys1.png",
        "selectedIconPath": "../../img/zgys2.png",
        "pagePath": "/pages/findSupplier/index",
        "text": "找供应商",
        "params": {
          "isTabbar": true,
        }
      },
      {
        "iconPath": "../../img/wd1.png",
        "selectedIconPath": "../../img/wd2.png",
        "pagePath": "/pages/user/index",
        "text": "我的"
      }
    ],

    // 领导权限
    [{
        "iconPath": "../../img/banb2.png",
        "selectedIconPath": "../../img/banb1.png",
        "pagePath": "/pages/web/cityLeaderIndex",
        "text": "看板"
      },
      {
        "iconPath": "../../img/zgys1.png",
        "selectedIconPath": "../../img/zgys2.png",
        "pagePath": "/pages/findSupplier/index",
        "text": "找供应商",
        "params": {
          "isTabbar": true,
        }
      }, {
        "iconPath": "../../img/need1.png",
        "selectedIconPath": "../../img/need2.png",
        "pagePath": "/pages/web/demandDetail",
        "text": "需求大厅",
        "params": {
          "isTabbar": true,
        }
      },
      {
        "iconPath": "../../img/wd1.png",
        "selectedIconPath": "../../img/wd2.png",
        "pagePath": "/pages/user/index",
        "text": "我的"
      }
    ]
  ]

}