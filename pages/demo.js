{
  "page": {
    "title": "demo",
    "url": "/demo",
    "css": "",
    "navs": []
  },
  "searchForm": {
    "title": "搜索",
    "labelWidth": "120px",
    "immediate": true,
    "urls": {
      "list": {
        "url": "console/mdsp/admin/agent/list",
        "method": "GET",
        "params": {},
        "urlFilter": "",
        "beforeFilter": "",
        "filter": "",
        "successMessage": "",
        "errorMessage": "",
        "isSecondSure": "2",
        "secondSureText": "是否确定保存"
      },
      "chart": {},
      "total": {},
      "summary": {}
    },
    "fields": [],
    "buttons": []
  },
  "dataTable": {
    "title": "数据列表",
    "loading": false,
    "data": [],
    "total": 0,
    "summary": {},
    "supportSort": false,
    "defaultSort": {
      "prop": "",
      "order": "ascending"
    },
    "useLocalSort": false,
    "useLocalPagination": false,
    "summaryPosition": "last",
    "columns": [{
      "type": "raw",
      "title": "账号ID",
      "align": "center",
      "width": "",
      "text": "",
      "field": "uid",
      "sortable": false,
      "canHidden": false,
      "group": "",
      "klass": "",
      "showFilter": "",
      "format": "",
      "maps": {},
      "options": {}
    }, {
      "type": "raw",
      "title": "Flyme账号",
      "align": "center",
      "width": "",
      "text": "",
      "field": "flyme",
      "sortable": false,
      "canHidden": false,
      "group": "",
      "klass": "",
      "showFilter": "",
      "format": "",
      "maps": {},
      "options": {}
    }, {
      "type": "raw",
      "title": "代理名称",
      "align": "center",
      "width": "",
      "text": "",
      "field": "name",
      "sortable": false,
      "canHidden": false,
      "group": "",
      "klass": "",
      "showFilter": "",
      "format": "",
      "maps": {},
      "options": {}
    }, {
      "type": "raw",
      "title": "所属商务部门",
      "align": "center",
      "width": "",
      "text": "",
      "field": "partment",
      "sortable": false,
      "canHidden": false,
      "group": "",
      "klass": "",
      "showFilter": "",
      "format": "",
      "maps": {},
      "options": {}
    }, {
      "type": "raw",
      "title": "代理级别",
      "align": "center",
      "width": "",
      "text": "",
      "field": "agentType",
      "sortable": false,
      "canHidden": false,
      "group": "",
      "klass": "",
      "showFilter": "",
      "format": "",
      "maps": {},
      "options": {}
    }, {
      "type": "raw",
      "title": "所属一代",
      "align": "center",
      "width": "",
      "text": "",
      "field": "agentOneName",
      "sortable": false,
      "canHidden": false,
      "group": "",
      "klass": "",
      "showFilter": "",
      "format": "",
      "maps": {},
      "options": {}
    }, {
      "type": "raw",
      "title": "注册日期",
      "align": "center",
      "width": "",
      "text": "",
      "field": "createTime",
      "sortable": false,
      "canHidden": false,
      "group": "",
      "klass": "",
      "showFilter": "",
      "format": "",
      "maps": {},
      "options": {}
    }],
    "columnsFilter": "",
    "operations": {
      "show": false,
      "title": "操作",
      "width": "",
      "align": "center",
      "buttons": []
    },
    "batch": {
      "show": false,
      "params": "",
      "selectable": "",
      "buttons": []
    },
    "sortUrls": {
      "up": {},
      "down": {},
      "jump": {}
    },
    "pagination": {
      "show": true,
      "sizes": [10, 20, 50, 100],
      "layout": ["total", "sizes", "prev", "pager", "next", "jumper"],
      "currentPage": 1,
      "pageSize": 10,
      "maps": {
        "page": {
          "type": "map",
          "key": "start",
          "filter": "return (page.curr - 1) * page.size;"
        },
        "size": {
          "type": "map",
          "key": "max",
          "filter": ""
        }
      }
    }
  },
  "dialogs": {},
  "chart": {
    "yAxisFormatter": "{value}",
    "title": "",
    "xAxisKey": {
      "key": "",
      "options": ""
    },
    "seriesKeys": [],
    "resultData": [],
    "compare": {
      "key": "",
      "day": []
    },
    "options": {
      "legend": {
        "data": [],
        "selected": {}
      },
      "tooltip": {
        "trigger": "axis"
      },
      "xAxis": {
        "type": "category",
        "boundaryGap": false,
        "data": []
      },
      "yAxis": {
        "type": "value"
      },
      "series": []
    }
  }
}