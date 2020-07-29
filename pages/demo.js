{
  "page": {
    "title": "代理商管理",
    "url": "/generator/agent_manage",
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
        "errorMessage": ""
      },
      "chart": {},
      "total": {},
      "summary": {}
    },
    "fields": [{
      "title": "代理商名称",
      "type": "text",
      "key": "name",
      "value": "",
      "defaultValue": "",
      "placeholder": "",
      "dataType": "string",
      "rules": [],
      "isAsync": false,
      "options": {
        "blur": ""
      },
      "showFilter": "",
      "componentName": ""
    }, {
      "title": "账户ID",
      "type": "text",
      "key": "agentId",
      "value": "",
      "defaultValue": "",
      "placeholder": "",
      "dataType": "string",
      "rules": [],
      "isAsync": false,
      "options": {
        "blur": ""
      },
      "showFilter": "",
      "componentName": ""
    }, {
      "title": "代理级别",
      "type": "dropdown",
      "key": "type",
      "value": "",
      "defaultValue": "",
      "placeholder": "",
      "dataType": "string",
      "rules": [],
      "isAsync": false,
      "options": {
        "data": [{
          "name": "一级代理",
          "value": "1"
        }, {
          "name": "二级代理",
          "value": "2"
        }],
        "reverse": false,
        "immediate": false,
        "hasAll": true
      },
      "showFilter": "",
      "componentName": ""
    }, {
      "title": "所属一代",
      "type": "dropdown",
      "key": "agentOne",
      "value": "",
      "defaultValue": "",
      "placeholder": "",
      "dataType": "string",
      "rules": [],
      "isAsync": true,
      "options": {
        "url": "console/mdsp/admin/agent/list",
        "method": "GET",
        "params": {
          "type": 1
        },
        "urlFilter": "",
        "beforeFilter": "",
        "filter": "return res.value.data.map(item => {\n    return {\n        name: item.name,\n        value: item.uid \n    }\n});",
        "successMessage": "",
        "errorMessage": "",
        "reverse": false,
        "hasAll": true
      },
      "showFilter": "",
      "componentName": ""
    }, {
      "title": "pageNumber",
      "type": "hidden",
      "key": "pageNumber",
      "value": "",
      "defaultValue": "1",
      "placeholder": "",
      "dataType": "number",
      "rules": [],
      "isAsync": false,
      "options": {},
      "showFilter": "",
      "componentName": ""
    }, {
      "title": "pageSize",
      "type": "hidden",
      "key": "pageSize",
      "value": "",
      "defaultValue": "10",
      "placeholder": "",
      "dataType": "number",
      "rules": [],
      "isAsync": false,
      "options": {},
      "showFilter": "",
      "componentName": ""
    }],
    "buttons": [{
      "text": "查询",
      "type": "search",
      "klass": "primary",
      "loading": false,
      "isAsync": false,
      "options": {}
    }, {
      "text": "新建代理",
      "type": "dialog",
      "klass": "primary",
      "loading": false,
      "isAsync": false,
      "options": {
        "name": "AddOrUpdateAgent",
        "status": "add",
        "showFilter": ""
      }
    }, {
      "text": "转移代理",
      "type": "dialog",
      "klass": "primary",
      "loading": false,
      "isAsync": false,
      "options": {
        "name": "Batch",
        "status": "add",
        "showFilter": ""
      }
    }]
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
      "show": true,
      "title": "操作",
      "width": "",
      "align": "center",
      "buttons": [{
        "text": "进入",
        "type": "link",
        "klass": "text",
        "loading": false,
        "isAsync": false,
        "options": {
          "target": "_blank",
          "path": "http://mzagent.meizu.com/agent/forward?id=<%= props.uid %>",
          "showFilter": ""
        }
      }, {
        "text": "编辑",
        "type": "dialog",
        "klass": "text",
        "loading": false,
        "isAsync": true,
        "options": {
          "name": "AddOrUpdateAgent",
          "status": "edit",
          "showFilter": "",
          "url": "console/mdsp/agent/query",
          "method": "GET",
          "params": [{
            "name": "userId",
            "value": "uid"
          }],
          "urlFilter": "",
          "beforeFilter": "",
          "filter": "return res.value;",
          "successMessage": "",
          "errorMessage": ""
        }
      }, {
        "text": "查看代理",
        "type": "dialog",
        "klass": "text",
        "loading": false,
        "isAsync": true,
        "options": {
          "name": "ViewAgentInfo",
          "status": "view",
          "showFilter": "",
          "url": "console/mdsp/agent/query",
          "method": "GET",
          "params": [{
            "name": "userId",
            "value": "uid"
          }],
          "urlFilter": "",
          "beforeFilter": "",
          "filter": "res.value.isView = true;\nreturn res.value;",
          "successMessage": "",
          "errorMessage": ""
        }
      }, {
        "text": "删除",
        "type": "confirm",
        "klass": "text",
        "loading": false,
        "isAsync": true,
        "options": {
          "showFilter": "",
          "confirmMessage": "确认删除该代理商？",
          "url": "/console/mdsp/admin/agent/delete",
          "method": "GET",
          "params": [{
            "name": "agentUid",
            "value": "uid"
          }],
          "urlFilter": "",
          "beforeFilter": "",
          "filter": "",
          "successMessage": "删除成功",
          "errorMessage": ""
        }
      }]
    },
    "batch": {
      "show": false,
      "params": "[{\"name\": \"agentTwo\", \"value\": \"uid\"}]",
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
          "key": "pageNumber",
          "filter": "return page.curr;"
        },
        "size": {
          "type": "map",
          "key": "pageSize",
          "filter": ""
        }
      }
    }
  },
  "dialogs": {
    "AddOrUpdateAgent": {
      "name": "AddOrUpdateAgent",
      "show": false,
      "loading": false,
      "type": "default",
      "status": "add",
      "size": "tiny",
      "labelWidth": "120px",
      "title": "",
      "titles": {
        "add": "",
        "edit": "",
        "view": ""
      },
      "fields": [{
        "title": "",
        "type": "other-component",
        "key": "",
        "value": "",
        "defaultValue": "",
        "placeholder": "",
        "dataType": "string",
        "rules": [],
        "isAsync": false,
        "options": {},
        "showFilter": "",
        "componentName": "UpdateAgent"
      }],
      "urls": {
        "save": {},
        "add": {},
        "edit": {}
      },
      "template": "",
      "props": [],
      "buttons": [],
      "css": "",
      "extend": {},
      "options": {
        "add": {
          "disabled": []
        },
        "edit": {
          "disabled": []
        },
        "view": {}
      }
    },
    "ViewAgentInfo": {
      "name": "ViewAgentInfo",
      "show": false,
      "loading": false,
      "type": "default",
      "status": "add",
      "size": "tiny",
      "labelWidth": "120px",
      "title": "",
      "titles": {
        "add": "",
        "edit": "",
        "view": ""
      },
      "fields": [{
        "title": "",
        "type": "other-component",
        "key": "",
        "value": "",
        "defaultValue": "",
        "placeholder": "",
        "dataType": "string",
        "rules": [],
        "isAsync": false,
        "options": {},
        "showFilter": "",
        "componentName": "AgentInfo"
      }],
      "urls": {
        "save": {},
        "add": {},
        "edit": {}
      },
      "template": "",
      "props": [],
      "buttons": [],
      "css": "",
      "extend": {},
      "options": {
        "add": {
          "disabled": []
        },
        "edit": {
          "disabled": []
        },
        "view": {}
      }
    },
    "Batch": {
      "name": "Batch",
      "show": false,
      "loading": false,
      "type": "default",
      "status": "add",
      "size": "tiny",
      "labelWidth": "120px",
      "title": "代理转移",
      "titles": {
        "add": "",
        "edit": "",
        "view": ""
      },
      "fields": [{
        "title": "",
        "type": "other-component",
        "key": "",
        "value": "",
        "defaultValue": "",
        "placeholder": "",
        "dataType": "string",
        "rules": [],
        "isAsync": false,
        "options": {},
        "showFilter": "",
        "componentName": "AgentBatch"
      }],
      "urls": {
        "save": {},
        "add": {},
        "edit": {}
      },
      "template": "",
      "props": [],
      "buttons": [],
      "css": "",
      "extend": {},
      "options": {
        "add": {
          "disabled": []
        },
        "edit": {
          "disabled": []
        },
        "view": {}
      }
    }
  },
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