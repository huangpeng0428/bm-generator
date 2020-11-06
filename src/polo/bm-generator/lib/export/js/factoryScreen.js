import Config from '../../config'
import Helper from '../../helper'
import request from '../../request'
import router from '../../../../../../src/router'
import CodeEditor from '../../components/CodeEditor'
import CfObjectTable from '../../components/CfObjectTable'

// 默认请求实体
const defaultUrlEntity = {
  url: '', // 请求路径
  method: 'GET', // 请求的method
  params: '', // 请求参数（用于简易情况）
  urlFilter: '', // 动态url过滤器
  beforeFilter: '', // 请求前的过滤器，用于返回请求的参数
  filter: '', // 请求后的过滤器，用于处理返回值的填充
  successMessage: '', // 请求成功的提示文案
  errorMessage: '', // 请求错误的提示文案
  isSecondSure: '2', // 是否需要二次确认弹框
  secondSureText: '是否确定保存' // 二次确认文案
}

// 默认配置请求实体的弹出框配置
const defaultUrlDialog = {
  visible: false,
  supportParams: true,
  supportDynamicParams: true,
  paramsMessage: '',
  supportMessages: true,
  supportBeforeFilter: true,
  beforeFilterMessage: '',
  supportFilter: true,
  filterMessage: '',
  supportUrlFilter: false,
  save() {}
}

// 默认表单控件实体
const defaultFieldEntity = {
  title: '',
  type: 'text',
  key: '',
  value: '',
  defaultValue: '',
  placeholder: '',
  dataType: 'string',
  rules: [],
  isAsync: false,
  options: {
    blur: ''
  },
  showFilter: '',
  componentName: ''
}

// 默认配置表单控件弹出框配置
const defaultFieldDialog = {
  visible: false,
  save() {}
}

// 默认键值实体
const defaultValueEntity = {
  name: '',
  value: ''
}

// 默认配置键值弹出框配置
const defaultValueDialog = {
  visible: false,
  nameLabel: '显示值(name)',
  valueLabel: '实际值(value)',
  save() {}
}

// 默认显示列弹框配置
const defaultColumnShowDialog = {
  visible: false,
  columnFields: [],
  save() {}
}

// 默认按钮实体
const defaultButtonEntity = {
  text: '查询',
  type: 'search',
  klass: 'default',
  loading: false,
  isAsync: false,
  options: {
  }
}

// 默认配置按钮弹出框配置
const defaultButtonDialog = {
  visible: false,
  supportTypes: Object.keys(Config.buttonTypes),
  showFilterMessage: `
    函数会传入<code>data</code>作为参数，参数值是当前按钮的执行环境数据。必须返回一个<code>Boolean</code>，作为是否显示的依据。<br>
    如果为必定显示，请留空
  `,
  save() {}
}

// 默认列实体
const defaultColumnEntity = {
  type: 'raw',
  title: '',
  align: 'center',
  width: '',
  text: '',
  field: '',
  sortable: false,
  canHidden: false,
  group: '',
  klass: '',
  showFilter: '',
  format: '',
  maps: {
  },
  options: {
  }
}

// 默认配置列弹出框配置
const defaultColumnDialog = {
  visible: false,
  save() {}
}

// 默认对话框实体
const defaultDialogEntity = {
  name: '',
  show: false,
  loading: false,
  type: 'default',
  status: 'add',
  size: 'tiny',
  labelWidth: '120px',
  title: '',
  titles: {
    add: '',
    edit: '',
    view: ''
  },
  fields: [],
  urls: {
    save: {
    },
    add: {
    },
    edit: {
    }
  },
  template: '',
  props: [],
  buttons: [],
  css: '',
  extend: {},
  options: {
    add: {
      disabled: []
    },
    edit: {
      disabled: []
    },
    view: {}
  }
}

// 默认配置对话框弹出框配置
const defaultDialogItemDialog = {
  visible: false,
  isSameTitle: true,
  isDynamicButton: false,
  save() {}
}

const defaultRuleEntity = {
  type: 'string',
  required: true,
  len: '',
  max: '',
  min: '',
  message: ''
}

const defaultRuleDialog = {
  visible: false,
  save() {}
}

const defaultNavEntity = {
  type: 'router',
  name: '',
  paramsParams: '',
  queryParams: '',
  text: '',
  path: '',
  active: false
}

const defaultNavDialog = {
  visible: false,
  save() {}
}

const defaultChartSeriesEntity = {
  name: '',
  key: '',
  type: 'line',
  dataType: 'raw',
  defaultShow: true
}

const defaultChartSeriesDialog = {
  visible: false,
  save() {}
}

const defaultUploadEntity = {
  name: '',
  action: '',
  withCredentials: true,
  beforeUpload: '',
  uploadSuccess: ''
}

const defaultUploadDialog = {
  visible: false,
  save() {}
}

export default {
  name: 'FactoryScreen',

  components: {
    CodeEditor,
    CfObjectTable
  },

  filters: {
    searchFormUrlTypeFilter(val) {
      const map = {
        list: '列表',
        chart: '图表',
        total: '计数',
        summary: '汇总'
      }

      return map[val]
    },

    dataTableSortUrlTypeFilter(val) {
      const map = {
        up: '上移',
        down: '下移动',
        jump: '快速移动'
      }

      return map[val]
    },

    fieldTypeFilter(val) {
      return Config.fieldTypes[val]
    },

    buttonTypeFilter(val) {
      return Config.buttonTypes[val]
    },

    columnTypeFilter(val) {
      return Config.columnTypes[val]
    },

    dialogUrlTypeFilter(val) {
      const map = {
        save: '共用保存接口',
        add: '新增保存接口',
        edit: '编辑保存接口'
      }

      return map[val]
    },

    fieldFormatArrayFilter(val) {
      if (Array.isArray(val)) {
        return val.join(', ');
      }
      return val;
    },

    columnFieldToTitleFilter(val, columns) {
      if (!Array.isArray(val)) {
        val = [val]
      }
      return val.map(d => columns.reduce((p, c) => {
        return c.field == d ? c.title : p
      }, ''))
    }
  },

  data() {
    return {
      config: Helper.assign({}, Config),

      namedRouter: (() => {
        const namedRouter = router.options.routes.map(route => ({
          label: route.name,
          value: route.name
        })).filter(route => !!route.value)

        namedRouter.unshift({
          label: '默认',
          value: ''
        })

        return namedRouter
      })(),

      // 所有支持的请求method类型
      requestMethods: ['GET', 'POST', 'DELETE', 'HEAD', 'PUT', 'PATCH'],

      routerParamsTypes: ['params', 'query'],

      fieldSupportAsync: ['dropdown', 'cascader', 'search-input', 'autocomplete', 'checkbox-group', 'radio-group'],

      fieldOnlySupportAsync: ['cascader', 'search-input', 'autocomplete'],

      fieldSupportStaticData: ['dropdown', 'checkbox-group', 'radio-group'],

      fieldUnsupportDefaultValue: ['custom'],

      dateTypes: Helper.convertMapToArray(Config.dateTypes),

      dateDefaultValues: [
        { label: '无', value: '' },
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '本周', value: 'this_week' },
        { label: '上周', value: 'last_week' },
        { label: '本月', value: 'this_month' },
        { label: '上个月', value: 'last_month' }
      ],

      dateDisabledDateTypes: [
        { label: '无', value: '' },
        { label: '今天之前', value: 'beforeToday' },
        { label: '今天之后', value: 'afterToday' },
        { label: '自定义', value: 'custom' }
      ],

      daterangeTypes: [{ label: '无', value: '' }].concat(
                        Helper.convertMapToArray(Config.daterangeShortcuts)
                      ),

      daterangeShortcuts: Helper.convertMapToArray(Config.daterangeShortcuts),

      dataTypes: Helper.convertMapToArray(Config.dataTypes),

      // 所有表单控件类型
      fieldTypes: Helper.convertMapToArray(Config.fieldTypes),

      buttonTypes: Helper.convertMapToArray(Config.buttonTypes),

      buttonTargetTypes: Helper.convertMapToArray(Config.buttonTargetTypes),

      dialogStatus: Helper.convertMapToArray(Config.dialogStatus),

      dialogTypes: Helper.convertMapToArray(Config.dialogTypes),

      columnTypes: Helper.convertMapToArray(Config.columnTypes),

      ruleTypes: Helper.convertMapToArray(Config.ruleTypes),

      fileTypes: Helper.convertMapToArray(Config.fileTypes),

      dialogSizeTypes: Helper.convertMapToArray(Config.dialogSizeTypes),

      paginationLayout: Helper.convertMapToArray(Config.paginationLayout),

      alignTypes: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' }
      ],

      urlEntity: Helper.assign({}, defaultUrlEntity),

      urlDialog: Helper.assign({}, defaultUrlDialog),

      fieldEntity: Helper.assign({}, defaultFieldEntity),

      fieldDialog: Helper.assign({}, defaultFieldDialog),

      valueEntity: Helper.assign({}, defaultValueEntity),

      valueDialog: Helper.assign({}, defaultValueDialog),

      columnShowDialog: Helper.assign({}, defaultColumnShowDialog),

      buttonEntity: Helper.assign({}, defaultButtonEntity),

      buttonDialog: Helper.assign({}, defaultButtonDialog),

      columnEntity: Helper.assign({}, defaultColumnEntity),

      columnDialog: Helper.assign({}, defaultColumnDialog),

      dialogEntity: Helper.assign({}, defaultDialogEntity),

      dialogItemDialog: Helper.assign({}, defaultDialogItemDialog),

      ruleEntity: Helper.assign({}, defaultRuleEntity),

      ruleDialog: Helper.assign({}, defaultRuleDialog),

      navEntity: Helper.assign({}, defaultNavEntity),

      navDialog: Helper.assign({}, defaultNavDialog),

      chartSeriesEntity: Helper.assign({}, defaultChartSeriesEntity),

      chartSeriesDialog: Helper.assign({}, defaultChartSeriesDialog),

      uploadEntity: Helper.assign({}, defaultUploadEntity),

      uploadDialog: Helper.assign({}, defaultUploadDialog),

      // 当前激活的tab
      activeTab: 'page',

      id: 0,

      pageCode: '',

      disabledPageCode: false,

      // 页面配置选项
      page: Helper.assign({}, Config.setup.page),

      // 页面配置项目按的验证配置
      pageRules: {
        title: [
          { required: true, message: '请输入页面标题', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入页面url', trigger: 'blur' }
        ]
      },

      // 搜索表单配置选项
      searchForm: Helper.assign({}, Config.setup.searchForm),

      // 搜索表单配置选项的验证配置
      searchFormRules: {
        title: [
          { required: true, message: '请输入页面标题', trigger: 'blur' }
        ]
      },

      dataTable: Helper.assign({}, Config.setup.dataTable),

      chart: Helper.assign({}, Config.setup.chart),

      paginationSizes: [10, 20, 50, 100],

      dialogs: Helper.assign({}, Config.setup.dialogs),

      loading: false
    }
  },

  computed: {
    fieldTableColumnHiddenData() {
      return this.dataTable.columns.filter(d => d.canHidden).map(d => ({
        title: d.title,
        field: d.field, // 去除含有 .
        group: d.group
      }))
    },
    fieldTableColumnHiddenGroupData() {
      return this.fieldTableColumnHiddenData.reduce((p, c) => {
        if (!p[c.group]) {
          p[c.group] = []
        }
        p[c.group].push(c)
        return p
      }, {})
    },
    dataTableSortKeyOptions() {
      return this.dataTable.columns
                .filter(c => c.sortable)
                .map(c => ({ prop: c.field, order: 'ascending', label: c.title }))
    },
    chartSeriesKeyOptions() {
      return this.dataTable.columns.map((c) => {
        let disabled = false;
        if (this.chart.xAxisKey == c.field) {
          disabled = true;
        }
        for (let i = 0, ilen = this.chart.seriesKeys.length; i < ilen; i++) {
          if (this.chart.seriesKeys[i].key == c.field) {
            disabled = true;
            break;
          }
        }
        return {
          value: c.field,
          label: c.title,
          disabled: disabled,
          type: c.type
        }
      }).filter((c) => {
        return !!c.value
      })
    },
    chartxAxisKeyOptions() {
      return this.dataTable.columns.map((c) => {
        let disabled = false;
        for (let i = 0, ilen = this.chart.seriesKeys.length; i < ilen; i++) {
          if (this.chart.seriesKeys[i].key == c.field) {
            disabled = true;
            break;
          }
        }
        return {
          value: c.field,
          label: c.title,
          type: c.type,
          disabled: disabled
        }
      }).filter((c) => {
        return !!c.value
      })
    },

    // 搜索表单的请求url的表格映射（直接展示object有点太繁琐）
    searchFormUrls() {
      const result = []

      Object.keys(this.searchForm.urls).forEach((u) => {
        const url = this.searchForm.urls[u]
        let r = {
          type: u,
          raw: url
        }

        if (Object.keys(url).length) {
          r = Helper.assign(r, {
            config: true,
            url: url.url,
            method: url.method,
            params: JSON.stringify(url.params)
          })
        } else {
          r = Helper.assign(r, {
            config: false,
            url: '',
            method: '',
            params: ''
          })
        }

        result.push(r)
      })

      return result
    },

    // 数据列表的排序url的表格映射
    dataTableSortUrls() {
      const result = []

      Object.keys(this.dataTable.sortUrls).forEach((u) => {
        const url = this.dataTable.sortUrls[u]
        let r = {
          type: u,
          raw: url
        }

        if (Object.keys(url).length) {
          r = Helper.assign(r, {
            config: true,
            url: url.url,
            method: url.method,
            params: JSON.stringify(url.params)
          })
        } else {
          r = Helper.assign(r, {
            config: false,
            url: '',
            method: '',
            params: ''
          })
        }

        result.push(r)
      })

      return result
    },

    dialogList() {
      const result = []

      Object.keys(this.dialogs).forEach((name) => {
        result.push({
          name,
          isConfigFields: this.dialogs[name].fields.length > 0 ? '是' : '否',
          isConfigUrls: Object.keys(this.dialogs[name].urls) > 0 ? '是' : '否',
          raw: this.dialogs[name]
        })
      })

      return result
    },

    dialogUrls() {
      const result = []

      Object.keys(this.dialogEntity.urls).forEach((u) => {
        const url = this.dialogEntity.urls[u]
        let r = {
          type: u,
          raw: url
        }

        if (Object.keys(url).length) {
          r = Helper.assign(r, {
            config: true,
            url: url.url,
            method: url.method,
            params: JSON.stringify(url.params)
          })
        } else {
          r = Helper.assign(r, {
            config: false,
            url: '',
            method: '',
            params: ''
          })
        }

        result.push(r)
      })

      return result
    },

    supportButtonTypes() {
      return this.buttonTypes.filter(button => (
        this.buttonDialog.supportTypes.indexOf(button.value) !== -1
      ))
    }
  },

  watch: {
    'fieldEntity.type'(val) {
      this.fieldEntity.key = ''
      this.fieldEntity.value = ''
      this.fieldEntity.defaultValue = ''
      this.fieldEntity.isAsync = false

      this.$set(this.fieldEntity, 'options', this.getFieldEntityDefaultOptions(val, false))
      switch (val) {
        case 'cascader':
        case 'autocomplete':
        case 'search-input':
          this.fieldEntity.isAsync = true

          // if (!this.fieldEntity.options.data) {
          //   this.fieldEntity.options.data = ''
          // }
          break
        case 'checkbox-group':
        case 'text-list':
          if (!Array.isArray(this.fieldEntity.value)) this.fieldEntity.value = []
          break
        case 'daterange':
        case 'datetimerange':
          if (!Array.isArray(this.fieldEntity.key)) this.fieldEntity.key = ['', '']
          if (!Array.isArray(this.fieldEntity.value)) this.fieldEntity.value = ['', '']
          break
        case 'switch':
          this.fieldEntity.defaultValue = false
          break
        case 'table-column-hidden':
          if (!Array.isArray(this.fieldEntity.defaultValue)) this.fieldEntity.defaultValue = []
          if (!Array.isArray(this.fieldEntity.value)) this.fieldEntity.value = []
          break;
        default:
          break
      }
    },

    'fieldEntity.isAsync'(val) {
      this.$set(this.fieldEntity, 'options', this.getFieldEntityDefaultOptions(this.fieldEntity.type, val))
    },

    'buttonEntity.type'(val) {
      this.buttonEntity.text = ''
      this.buttonEntity.isAsync = false
      this.$set(this.buttonEntity, 'options', {})
      switch (val) {
        case 'search':
          if (!this.buttonEntity.text) this.buttonEntity.text = '查询'
          break
        case 'export':
          if (!this.buttonEntity.text) this.buttonEntity.text = '导出'
          break
        case 'dialog':
          this.$set(this.buttonEntity, 'options', {
            name: '',
            status: 'add',
            showFilter: ''
          })
          break
        case 'confirm':
          this.buttonEntity.isAsync = true
          this.$set(this.buttonEntity, 'options', {
            showFilter: '',
            confirmMessage: ''
          })
          break
        case 'request':
          this.buttonEntity.isAsync = true
          this.$set(this.buttonEntity, 'options', {
            showFilter: ''
          })
          break
        case 'router':
          this.$set(this.buttonEntity, 'options', {
            path: '',
            name: '',
            paramsParams: '',
            queryParams: '',
            showFilter: ''
          })
          break
        case 'link':
          this.$set(this.buttonEntity, 'options', {
            target: '_self',
            path: '',
            showFilter: ''
          })
          break
        default:
          break
      }
    },

    'columnEntity.type'(val) {
      switch (val) {
        case 'router':
          this.$set(this.columnEntity, 'options', {
            path: '',
            name: '',
            paramsParams: '',
            queryParams: ''
          })
          break
        case 'link':
          this.$set(this.columnEntity, 'options', {
            target: '_self',
            path: ''
          })
          break
        case 'inner':
          this.$set(this.columnEntity, 'options', {
            callback: ''
          })
          break
        default:
          break
      }
    },

    $route() {
      if (this.$route.params.code) {
        this.loadData(this.$route.params.code)
      } else {
        this.page = Helper.assign({}, Config.setup.page)
        this.searchForm = Helper.assign({}, Config.setup.searchForm)
        this.dataTable = Helper.assign({}, Config.setup.dataTable)
        this.dialogs = Helper.assign({}, Config.setup.dialogs)
      }
    }
  },

  methods: {
    getFieldEntityDefaultOptions(type, isAsync) {
      let opts = {}
      switch (type) {
        case 'autocomplete':
          if (isAsync) {
            opts = Helper.assign({}, defaultUrlEntity, {
              param: '',
              ref: '',
              refProp: ''
            })
          } else {
            opts = {
              data: [],
              ref: '',
              refProp: ''
            }
          }
          break
        case 'cascader':
          if (isAsync) {
            opts = Helper.assign({}, defaultUrlEntity, {
              showFullPath: true,
              selectAnyLevel: false,
              ref: '',
              item: {}
            })
          } else {
            opts = {
              showFullPath: true,
              selectAnyLevel: false,
              ref: '',
              item: {},
              data: ''
            }
          }
          break
        case 'checkbox-group':
          if (isAsync) {
            opts = Helper.assign({}, defaultUrlEntity)
          } else {
            opts = { data: [] }
          }
          break
        case 'radio-group':
          if (isAsync) {
            opts = Helper.assign({}, defaultUrlEntity, { reverse: false })
          } else {
            opts = { data: [] }
          }
          break
        case 'custom':
          opts = {
            config: ''
          }
          break
        case 'date':
          opts = {
            format: 'yyyy-MM-dd',
            disabledDate: '',
            disabledDateFilter: ''
          }
          break
        case 'datetime':
          opts = {
            format: 'yyyy-MM-dd HH:mm:ss'
          }
          break
        case 'daterange':
        case 'datetimerange':
          opts = {
            value: [],
            format: type === 'datetimerange' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd',
            shortcuts: [].concat(this.daterangeShortcuts),
            disabledDate: '',
            disabledDateFilter: '',
            notIncludeToday: false
          }
          break
        case 'dropdown':
          if (isAsync) {
            opts = Helper.assign({}, defaultUrlEntity, { reverse: false })
          } else {
            opts = {
              data: [],
              reverse: false,
              immediate: false,
              hasAll: true
            }
          }
          break
        case 'enum':
          opts = {
            maps: {}
          }
          break
        case 'search-input':
          if (isAsync) {
            opts = Helper.assign({}, defaultUrlEntity, {
              param: '',
              ref: ''
            })
          } else {
            opts = {
              data: [],
              ref: ''
            }
          }
          break
        case 'text':
          opts = {
            blur: ''
          }
          break
        case 'switch':
          opts = {
            value: '',
            on: {
              text: '',
              value: ''
            },
            off: {
              text: '',
              value: ''
            }
          }
          break
        case 'upload':
          opts = Helper.assign({}, defaultUploadEntity)
          break
        case 'table-column-hidden':
          opts = {
            data: {},
            limit: 8
          }
          break;
        default:
          break
      }
      return opts
    },

    // 打开搜索表单的url配置页面（调用urlDialog）
    handleSearchFormUrlConfig(row, type = 'searchForm') {
      this.urlDialog.beforeFilterMessage = `
        函数会传入 <code>params</code> 作为参数。该参数是搜索表单的值，必须要返回一个对象，作为查询条件。<br>
        如果不需要做过滤，请留空。
      `

      if (row.type === 'list' || row.type === 'chart') {
        this.urlDialog.filterMessage = `
          函数会传入 <code>res</code>, <code>params</code>, <code>url</code>作为参数。该参数是服务端请求返回值，必须要返回一个对象，作为数据列表的数据集。<br>
          示例：<code>{ data: [], total: 0 }</code> 返回值对象中total不是必须属性，如果配置了计数的请求接口的话。<br>
          如果不需要做过滤，请留空。
        `
      }
      if (row.type == 'summary') {
        this.urlDialog.filterMessage = `
          函数会传入 <code>res</code>, <code>params</code>, <code>url</code>作为参数。该参数是服务端请求返回值，必须要返回一个对象，作为数据总计的数据集。<br>
          如果不需要做过滤，请留空。
        `
      }

      this.urlDialog.supportUrlFilter = true

      const urlEntity = Helper.assign({}, defaultUrlEntity, row.raw)
      if (typeof urlEntity.params === 'object') {
        urlEntity.params = JSON.stringify(urlEntity.params)
      }
      this.urlEntity = urlEntity

      this.urlDialog.save = (urlInfo) => {
        if (type === 'searchForm') {
          this.searchForm.urls[row.type] = urlInfo
        } else if (type === 'dataTableSort') {
          this.dataTable.sortUrls[row.type] = urlInfo
        }
      }
      this.urlDialog.visible = true
    },

    // 处理接口请求配置框的关闭动作
    handleUrlDialogClose() {
      this.urlEntity = Helper.assign({}, defaultUrlEntity)
      this.urlDialog = Helper.assign({}, defaultUrlDialog)
    },

    // 处理接口请求配置框的保存动作
    handleUrlDialogSave() {
      const urlInfo = Helper.assign({}, this.urlEntity)
      if (urlInfo.params.trim()) {
        try {
          urlInfo.params = JSON.parse(urlInfo.params)
        } catch (e) {
          this.$alert('url的params无法被转换，请检查', '警告')
          console.error(e)
          return
        }
      } else {
        urlInfo.params = {}
      }
      urlInfo.beforeFilter = urlInfo.beforeFilter.trim()
      urlInfo.filter = urlInfo.filter.trim()
      this.urlDialog.save(urlInfo)
      this.$message({
        type: 'success',
        message: '保存请求接口配置成功'
      })
      this.handleUrlDialogClose()
    },

    // 清空url配置
    handleClearUrlConfig(origin, urlInfo) {
      if (origin === 'searchForm') {
        this.$confirm('是否清空该url配置', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.searchForm.urls[urlInfo.type] = {}
        }).catch(() => {})
      } else if (origin === 'dataTableSort') {
        this.$confirm('是否清空该url配置', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataTable.sortUrls[urlInfo.type] = {}
        }).catch(() => {})
      }
    },

    // 新增搜索表单的表单控件
    handleSearchFormFieldAdd() {
      this.handleFieldDialogOpen(null, (fieldInfo) => {
        this.searchForm.fields.push(fieldInfo)
      })
    },

    // 编辑搜索表单的表单控件
    handleSearchFormFieldEdit(row, index) {
      this.handleFieldDialogOpen(row, (fieldInfo) => {
        this.$set(this.searchForm.fields, index, fieldInfo)
      })
    },

    // 删除搜索表单的表单控件
    handleSearchFormFieldDelete(index) {
      this.searchForm.fields.splice(index, 1)
    },

    // 处理表单控件框的打开动作
    handleFieldDialogOpen(fieldEntity, save) {
      if (fieldEntity !== null) {
        this.watchPropertyComplete(
          this.fieldEntity,
          [
            { name: 'type', value: fieldEntity.type },
            { name: 'isAsync', value: fieldEntity.isAsync }
          ],
          () => {
            this.fieldEntity = Helper.assign({}, defaultFieldEntity, fieldEntity)
            this.$set(this.fieldEntity, 'options', Helper.assign(
              {},
              this.getFieldEntityDefaultOptions(fieldEntity.type, fieldEntity.isAsync),
              this.fieldEntity.options || {},
              fieldEntity.type == 'table-column-hidden' ? { data: Helper.assign({}, this.fieldTableColumnHiddenGroupData) } : {}
            ))
          }
        )
      }
      this.fieldDialog.visible = true
      this.fieldDialog.save = save
    },

    // 处理表单控件框的关闭动作
    handleFieldDialogClose() {
      this.fieldEntity = Helper.assign({}, defaultFieldEntity, { rules: [] })
      this.fieldDialog = Helper.assign({}, defaultFieldDialog)
    },

    // 处理表单控件的保存动作
    handleFieldDialogSave() {
      const fieldInfo = Helper.assign({}, this.fieldEntity)

      this.fieldDialog.save(fieldInfo)
      this.$message({
        type: 'success',
        message: '保存表单控件成功'
      })
      this.handleFieldDialogClose()
    },

    // 渲染控件的数据表格的操作栏头部
    /* eslint-disable no-unused-vars */
    renderFieldStaticDataOperationColumn(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleFieldStaticDataAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    // 新增下拉列表的数据项
    handleFieldStaticDataAdd() {
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        this.fieldEntity.options.data.push(valueInfo)
      }
    },

    // 编辑下拉列表的数据项
    handleFieldStaticDataEdit(row, index) {
      this.valueEntity = Helper.assign({}, row)
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        this.$set(this.fieldEntity.options.data, index, valueInfo)
      }
    },

    // 编辑下拉列表的对 datable 列的显示控制
    handleFieldDataTableColumnShowEdit(row, index) {
      this.columnShowDialog.visible = true
      this.columnShowDialog.columnFields = row.columnFields || []
      this.columnShowDialog.save = (columnFields) => {
        this.$set(this.fieldEntity.options.data[index], 'columnFields', columnFields)
      }
    },

    // 删除下拉列表的数据项
    handleFieldStaticDataDelete(index) {
      this.fieldEntity.options.data.splice(index, 1)
    },

    // 编辑异步表单控件的接口请求配置
    handleFieldAsyncConfigOpen() {
      const urlEntity = Helper.assign({}, defaultUrlEntity, this.fieldEntity.options)
      if (typeof urlEntity.params === 'object') {
        urlEntity.params = JSON.stringify(urlEntity.params)
      }
      this.urlEntity = urlEntity
      this.urlDialog.supportParams = false
      this.urlDialog.supportDynamicParams = false
      this.urlDialog.supportBeforeFilter = false

      switch (this.fieldEntity.type) {
        case 'dropdown':
          this.urlDialog.supportParams = true
          this.urlDialog.filterMessage = `
          函数会传入 <code>res</code> 作为参数。该参数是服务端请求返回值，必须要返回一个数组，作为数据列表的数据集。<br>
          示例：<code>[ {name: '显示值', value: '选中值'}, {name: '显示值2', value: '选中值2'} ]</code>
          `
          break
        case 'search-input':
          this.urlDialog.filterMessage = `
          函数会传入 <code>res</code> 作为参数。该参数是服务端请求返回值，必须要返回一个数组，作为数据列表的数据集。<br>
          示例：<code>[ {name: '显示值', value: '选中值'}, {name: '显示值2', value: '选中值2'} ]</code>
          `
          break
        case 'cascader':
          this.urlDialog.supportParams = true
          this.urlDialog.supportDynamicParams = true
          this.urlDialog.filterMessage = `
          函数会传入 <code>res</code> 作为参数。该参数是服务端请求返回值，必须要返回一个数组，作为数据列表的数据集。<br>
          示例：<code>[{label: '显示值', value: '选中值', children: [{label: '下级显示值', value: '下级选中值'}] },]</code><br>
          可以在children中可以循环添加下级菜单
          `
          break
        case 'checkbox-group':
          this.urlDialog.supportParams = true
          this.urlDialog.supportDynamicParams = true
          this.urlDialog.filterMessage = `
          函数会传入 <code>res</code> 作为参数。该参数是服务端请求返回值，必须要返回一个数组，作为数据列表的数据集。<br>
          示例：<code>[ {name: '显示值', value: '选中值', disabled: false, checked: false } ]</code>
          `
          break
        default:
          break
      }

      this.urlDialog.save = (urlInfo) => {
        this.fieldEntity.options = Helper.assign({}, this.fieldEntity.options, urlInfo)
      }
      this.urlDialog.visible = true
    },

    handleCascaderItemAsyncConfigOpen() {
      const urlEntity = Helper.assign({}, defaultUrlEntity, this.fieldEntity.options.item)
      if (typeof urlEntity.params === 'object') {
        urlEntity.params = JSON.stringify(urlEntity.params)
      }
      this.urlEntity = urlEntity
      this.urlDialog.supportBeforeFilter = false
      this.urlDialog.paramsMessage = `
      当前执行环境会传入<code>{ value: 1, selected: [1, 2, 3] }</code>作为参数<br>
      其中<code>value</code>是当前选中的值，<code>selected</code>是整个选择层级的所有值
      `
      this.urlDialog.filterMessage = `
      函数会传入 <code>res</code> 作为参数。该参数是服务端请求返回值，必须要返回一个数组，作为数据列表的数据集。<br>
      示例：<code>[{label: '显示值', value: '选中值', children: [{label: '下级显示值', value: '下级选中值'}] },]</code><br>
      可以在children中可以循环添加下级菜单，如果是最后一级，请不要添加children
      `
      this.urlDialog.save = (urlInfo) => {
        this.fieldEntity.options.item = Helper.assign({}, urlInfo)
      }
      this.urlDialog.visible = true
    },

    // 处理键值框的关闭动作
    handleValueDialogClose() {
      this.valueEntity = Helper.assign({}, defaultValueEntity)
      this.valueDialog = Helper.assign({}, defaultValueDialog)
    },

    // 处理键值框的保存动作
    handleValueDialogSave() {
      const valueInfo = Helper.assign({}, this.valueEntity)
      this.valueDialog.save(valueInfo)
      this.handleValueDialogClose()
    },

    // 处理显示列框的关闭动作
    handleColumnShowDialogClose() {
      this.columnShowDialog = Helper.assign({}, defaultColumnShowDialog)
    },

    // 处理显示列框的保存动作
    handleColumnShowDialogSave() {
      this.columnShowDialog.save([].concat(this.columnShowDialog.columnFields))
      this.handleColumnShowDialogClose()
    },

    // 新增搜索表单的按钮
    handleSearchFormButtonAdd() {
      this.handleButtonDialogOpen(null, (buttonInfo) => {
        this.searchForm.buttons.push(buttonInfo)
      }, 'searchForm')
    },

    // 编辑搜索表单的按钮
    handleSearchFormButtonEdit(row, index) {
      this.handleButtonDialogOpen(row, (buttonInfo) => {
        this.$set(this.searchForm.buttons, index, buttonInfo)
      }, 'searchForm')
    },

    // 删除搜索表单的按钮
    handleSearchFormButtonDelete(index) {
      this.searchForm.buttons.splice(index, 1)
    },

    // 切换按钮配置框的按钮样式
    handleButtonChoiceKlass(type) {
      this.buttonEntity.klass = type
    },

    handleButtonDialogOpen(buttonInfo, save, origin) {
      const isAdd = buttonInfo === null
      if (buttonInfo !== null) {
        const buttonEntity = Helper.assign({}, buttonInfo)
        this.watchPropertyComplete(
          this.buttonEntity,
          [{ name: 'type', value: buttonEntity.type }],
          () => {
            if (buttonEntity.type === 'router') {
              buttonEntity.options.paramsParams = JSON.stringify(buttonEntity.options.paramsParams)
              buttonEntity.options.queryParams = JSON.stringify(buttonEntity.options.queryParams)
            }
            this.buttonEntity = Helper.assign({}, defaultButtonEntity, buttonEntity)
          }
        )
      }

      switch (origin) {
        case 'searchForm':
          if (isAdd) this.buttonEntity.type = 'search'
          this.buttonDialog.supportTypes = [
            'search',
            'export',
            'import',
            'link',
            'router',
            'dialog',
            'reset'
          ]
          break
        case 'dataTable':
          if (isAdd) this.buttonEntity.type = 'dialog'
          this.buttonDialog.supportTypes = [
            'link',
            'router',
            'dialog',
            'confirm'
          ]
          break
        case 'dialog':
          if (isAdd) this.buttonEntity.type = 'request'
          this.buttonDialog.supportTypes = [
            'close',
            'request',
            'dialog',
            'confirm'
          ]
          break
        default:
          break
      }

      this.buttonDialog.visible = true
      this.buttonDialog.save = save
    },

    // 处理按钮配置框的关闭动作
    handleButtonDialogClose() {
      this.buttonEntity = Helper.assign({}, defaultButtonEntity)
      this.buttonDialog = Helper.assign({}, defaultButtonDialog)
    },

    // 处理按钮配置框的保存动作
    handleButtonDialogSave() {
      const buttonInfo = Helper.assign({}, this.buttonEntity)
      if (buttonInfo.type === 'router') {
        buttonInfo.options.paramsParams = JSON.parse(buttonInfo.options.paramsParams || '{}')
        buttonInfo.options.queryParams = JSON.parse(buttonInfo.options.queryParams || '{}')
      }
      this.buttonDialog.save(buttonInfo)
      this.handleButtonDialogClose()
    },

    // 配置异步请求的按钮配置
    handleButtonAsyncConfigOpen() {
      const urlEntity = {}
      Object.keys(defaultUrlEntity).forEach((prop) => {
        if (!Helper.isUndef(this.buttonEntity.options[prop])) {
          urlEntity[prop] = this.buttonEntity.options[prop]
        } else {
          urlEntity[prop] = defaultUrlEntity[prop]
        }
      })
      if (typeof urlEntity.params === 'object') {
        urlEntity.params = JSON.stringify(urlEntity.params)
      }
      this.urlEntity = urlEntity

      if (this.buttonEntity.type === 'request') {
        this.urlDialog.supportParams = false
        if (this.dialogItemDialog.visible) {
          if (this.dialogEntity.type === 'template') {
            this.urlDialog.beforeFilterMessage = `
              函数会传入 <code>props</code> 作为参数。<br>
              <code>props.data</code>是数据源<br>
              <code>props.dynamic</code>是动态属性<br>
              <code>props.dialog</code>是对话框配置<br>
              函数必须要返回一个Object作为请求参数
            `
          } else {
            this.urlDialog.beforeFilterMessage = `
              函数会传入 <code>params</code>以及<code>dialog</code> 作为参数。<br>
              其中<code>params</code>是当前对话框的表单实体<br>
              <code>dialog</code>是当前对话框的所有配置项
            `
          }
        }
      } else {
        this.urlDialog.supportBeforeFilter = false
        if (this.buttonEntity.type === 'dialog') {
          this.urlDialog.filterMessage = `
          函数会传入 <code>res, data</code> 作为参数。该参数是服务端请求返回值，必须要返回一个对象，作为编辑框的数据源。<br>
          示例：<code>{ title: '标题', type: '类型' }</code>
          `
        }
      }
      this.urlDialog.visible = true
      this.urlDialog.save = (urlInfo) => {
        Object.keys(urlInfo).forEach((prop) => {
          this.buttonEntity.options[prop] = urlInfo[prop]
        })
      }
    },

    // 新增数据列表的列
    handleDataTableColumnAdd() {
      this.handleColumnDialogOpen(null, (columnInfo) => {
        this.dataTable.columns.push(columnInfo)
      })
    },

    // 编辑数据列表的列
    handleDataTableColumnEdit(row, index) {
      this.handleColumnDialogOpen(row, (columnInfo) => {
        this.$set(this.dataTable.columns, index, columnInfo)
      })
    },

    // 删除数据列表的列
    handleDataTableColumnDelete(index) {
      this.dataTable.columns.splice(index, 1)
    },

    handleColumnDialogOpen(columnInfo, save) {
      if (columnInfo !== null) {
        const columnEntity = Helper.assign({}, columnInfo)
        this.watchPropertyComplete(
          this.columnEntity,
          [{ name: 'type', value: columnEntity.type }],
          () => {
            if (columnEntity.type === 'router') {
              columnEntity.options.queryParams = JSON.stringify(columnEntity.options.queryParams)
              columnEntity.options.paramsParams = JSON.stringify(columnEntity.options.paramsParams)
            }
            this.columnEntity = Helper.assign({}, defaultColumnEntity, columnEntity)
          }
        )
      }

      this.columnDialog.visible = true
      this.columnDialog.save = save
    },

    // 处理列配置框的保存动作
    handleColumnDialogSave() {
      const columnInfo = Helper.assign({}, this.columnEntity)
      if (columnInfo.type === 'router') {
        columnInfo.options.queryParams = JSON.parse(columnInfo.options.queryParams || '{}')
        columnInfo.options.paramsParams = JSON.parse(columnInfo.options.paramsParams || '{}')
      }
      this.columnDialog.save(columnInfo)
      this.handleColumnDialogClose()
    },

    // 处理列配置框的关闭动作
    handleColumnDialogClose() {
      this.columnEntity = Helper.assign({}, defaultColumnEntity)
      this.columnDialog = Helper.assign({}, defaultColumnDialog)
    },

    // 渲染列的枚举类型的列头部
    /* eslint-disable no-unused-vars */
    renderColumnMapsOperationColumn(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleColumnMapsAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    // 新增列枚举值
    handleColumnMapsAdd() {
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        this.$set(this.columnEntity.maps, valueInfo.name, valueInfo.value)
      }
    },

    // 编辑列枚举值
    handleColumnMapsEdit(prop) {
      this.valueEntity = Helper.assign({}, defaultValueEntity, prop)
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        if (prop.name !== valueInfo.name) {
          this.$delete(this.columnEntity.maps, prop.name)
        }
        this.$set(this.columnEntity.maps, valueInfo.name, valueInfo.value)
      }
    },

    // 删除列枚举值
    handleColumnMapsDelete(prop) {
      this.$delete(this.columnEntity.maps, prop.name)
    },

    // 渲染数据列表的操作列头部
    /* eslint-disable no-unused-vars */
    renderDataTableOperationHeader(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleDataTableOperationsButtonAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    // 新增数据列表的操作列按钮
    handleDataTableOperationsButtonAdd() {
      this.handleButtonDialogOpen(null, (buttonInfo) => {
        this.dataTable.operations.buttons.push(buttonInfo)
      }, 'dataTable')
    },

    // 编辑数据列表的操作列按钮
    handleDataTableOperationsButtonEdit(row, index) {
      this.handleButtonDialogOpen(row, (buttonInfo) => {
        this.$set(this.dataTable.operations.buttons, index, buttonInfo)
      }, 'dataTable')
    },

    // 删除数据列表的操作列按钮
    handleDataTableOperationsButtonDelete(index) {
      this.dataTable.operations.buttons.splice(index, 1)
    },

    // 新增数据列表的操作列按钮
    handleDataTableBatchButtonAdd() {
      this.handleButtonDialogOpen(null, (buttonInfo) => {
        this.dataTable.batch.buttons.push(buttonInfo)
      }, 'dataTable')
    },

    // 编辑数据列表的操作列按钮
    handleDataTableBatchButtonEdit(row, index) {
      this.handleButtonDialogOpen(row, (buttonInfo) => {
        this.$set(this.dataTable.batch.buttons, index, buttonInfo)
      }, 'dataTable')
    },

    // 删除数据列表的操作列按钮
    handleDataTableBatchButtonDelete(index) {
      this.dataTable.batch.buttons.splice(index, 1)
    },

    // 新增对话框
    handleDialogsItemAdd() {
      this.dialogItemDialog.visible = true
      this.dialogItemDialog.save = (dialogInfo) => {
        this.$set(this.dialogs, dialogInfo.name, dialogInfo)
      }
    },

    // 编辑对话框
    handleDialogsItemEdit(row, isCopy) {
      this.dialogEntity = Helper.assign({}, defaultDialogEntity, row, isCopy ? { name: '' } : {})
      this.dialogItemDialog.isSameTitle = this.dialogEntity.title !== '' || (
        this.dialogEntity.title === '' && (
          this.dialogEntity.titles.add ||
          this.dialogEntity.titles.edit ||
          this.dialogEntity.titles.view
        ) === ''
      )
      if (this.dialogEntity.type === 'default') {
        this.dialogItemDialog.isDynamicButton = !!this.dialogEntity.buttons.length
      }
      this.dialogItemDialog.save = (dialogInfo) => {
        if (row.name !== dialogInfo.name && !isCopy) {
          this.$delete(this.dialogs, row.name)
        }
        this.$set(this.dialogs, dialogInfo.name, dialogInfo)
      }
      this.dialogItemDialog.visible = true
    },

    // 删除对话框
    handleDialogsItemDelete(row) {
      this.$delete(this.dialogs, row.name)
    },

    // 渲染对话框的表单控件列表渲染
    /* eslint-disable no-unused-vars */
    renderDialogFieldOperationHeader(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleDialogFieldAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    // 新增对话框表单控件
    handleDialogFieldAdd() {
      this.handleFieldDialogOpen(null, (fieldInfo) => {
        this.dialogEntity.fields.push(fieldInfo)
      })
    },

    // 编辑对话框表单控件
    handleDialogFieldEdit(row, index) {
      this.handleFieldDialogOpen(row, (fieldInfo) => {
        this.$set(this.dialogEntity.fields, index, fieldInfo)
      })
    },

    // 删除对话框表单控件
    handleDialogFieldDelete(index) {
      this.dialogEntity.fields.splice(index, 1)
    },

    // 编辑对话框的请求接口
    handleDialogUrlConfig(row) {
      const urlEntity = Helper.assign({}, defaultUrlEntity, row.raw)
      if (typeof urlEntity.params === 'object') {
        urlEntity.params = JSON.stringify(urlEntity.params)
      }
      this.urlEntity = urlEntity

      this.urlDialog.beforeFilterMessage = `
        函数会传入 <code>params, dialog</code> 作为参数。<br>
        <code>params</code>是当前对话框表单的值<br>
        <code>dialog</code>是当前对话框的配置（包含所有属性）<br>
        函数必须要返回一个对象，作为请求的参数值。如果不需要做过滤，请留空。
      `
      this.urlDialog.supportParams = false
      this.urlDialog.supportFilter = false
      this.urlDialog.save = (urlInfo) => {
        this.dialogEntity.urls[row.type] = urlInfo
      }
      this.urlDialog.visible = true
    },

    handleDialogUrlClear(row) {
      this.dialogEntity.urls[row.type] = {}
    },

    // 处理对话框关闭动作
    handleDialogItemDialogClose() {
      this.dialogEntity = Helper.assign({}, defaultDialogEntity)
      this.dialogItemDialog = Helper.assign({}, defaultDialogItemDialog)
    },

    // 处理对话框保存动作
    handleDialogItemDialogSave() {
      const dialogInfo = Helper.assign({}, this.dialogEntity)
      if (
        dialogInfo.type === 'default' &&
        !this.dialogItemDialog.isDynamicButton &&
        dialogInfo.buttons.length) {
        dialogInfo.buttons = []
      }
      this.dialogItemDialog.save(dialogInfo)
      this.handleDialogItemDialogClose()
    },

    /* eslint-disable no-unused-vars */
    renderDialogPropsOperationColumn(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleDialogPropAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    // 新增对话框动态属性
    handleDialogPropAdd() {
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        this.dialogEntity.props.push(valueInfo)
      }
    },

    // 编辑对话框动态属性
    handleDialogPropEdit(row, index) {
      this.valueEntity = Helper.assign({}, row)
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        this.$set(this.dialogEntity.props, index, valueInfo)
      }
    },

    // 删除对话框动态属性
    handleDialogPropDelete(index) {
      this.dialogEntity.props.splice(index, 1)
    },

    // 渲染对话框按钮表格操作栏
    /* eslint-disable no-unused-vars */
    renderDialogButtonOperationHeader(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleDialogButtonAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    // 增加对话框底部按钮
    handleDialogButtonAdd() {
      this.handleButtonDialogOpen(null, (buttonInfo) => {
        this.dialogEntity.buttons.push(buttonInfo)
      }, 'dialog')
    },

    // 编辑对话框底部按钮
    handleDialogButtonEdit(row, index) {
      this.handleButtonDialogOpen(row, (buttonInfo) => {
        this.$set(this.dialogEntity.buttons, index, buttonInfo)
      }, 'dialog')
    },

    // 删除对话框底部按钮
    handleDialogButtonDelete(index) {
      this.dialogEntity.buttons.splice(index, 1)
    },

    /* eslint-disable no-unused-vars */
    renderFieldRulesOperationColumn(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleFieldRuleAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    handleFieldRuleAdd() {
      this.handleRuleDialogOpen(null, (ruleInfo) => {
        this.fieldEntity.rules.push(ruleInfo)
      })
    },

    handleFieldRuleEdit(row, index) {
      this.handleRuleDialogOpen(row, (ruleInfo) => {
        this.$set(this.fieldEntity.rules, index, ruleInfo)
      })
    },

    handleFieldRuleDelete(index) {
      this.fieldEntity.rules.splice(index, 1)
    },

    handleRuleDialogOpen(ruleEntity, save) {
      if (ruleEntity !== null) {
        this.ruleEntity = Helper.assign({}, defaultRuleEntity, ruleEntity)
      }
      this.ruleDialog.save = save
      this.ruleDialog.visible = true
    },

    handleRuleDialogSave() {
      const ruleInfo = Helper.assign({}, this.ruleEntity)

      Object.keys(ruleInfo).forEach((name) => {
        if (typeof ruleInfo[name] === 'string' && ruleInfo[name] === '') {
          delete ruleInfo[name]
        }
      })

      this.ruleDialog.save(ruleInfo)
      this.handleRuleDialogClose()
    },

    handleRuleDialogClose() {
      this.ruleEntity = Helper.assign({}, defaultRuleEntity)
      this.ruleDialog = Helper.assign({}, defaultRuleDialog)
    },

    handleNavButtonConfig() {
      this.handleButtonDialogOpen()
    },

    /* eslint-disable no-unused-vars */
    renderNavOperationColumn(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleNavAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    handleNavAdd() {
      this.handleNavDialogOpen(null, (navInfo) => {
        this.page.navs.push(navInfo)
      })
    },

    handleNavEdit(row, index) {
      this.handleNavDialogOpen(row, (navInfo) => {
        this.$set(this.page.navs, index, navInfo)
      })
    },

    handleNavDelete(index) {
      this.page.navs.splice(index, 1)
    },

    handleNavDialogOpen(navEntity, save) {
      if (navEntity !== null) {
        this.navEntity = Helper.assign({}, defaultNavEntity, navEntity)
      }
      this.navDialog.save = save
      this.navDialog.visible = true
    },

    handleNavDialogSave() {
      const navInfo = Helper.assign({}, this.navEntity)
      this.navDialog.save(navInfo)
      this.handleNavDialogClose()
    },

    handleNavDialogClose() {
      this.navEntity = Helper.assign({}, defaultNavEntity)
      this.navDialog = Helper.assign({}, defaultNavDialog)
    },

    /* eslint-disable no-unused-vars */
    renderChartSeriesOperationColumn(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleChartSeriesAdd}>
          </el-button>
        </div>
      )
    },
    /* eslint-enable no-unused-vars */

    handleChartSeriesAdd() {
      this.handleChartSeriesDialogOpen(null, (entity) => {
        this.chart.seriesKeys.push(entity)
      })
    },

    handleChartSeriesEdit(row, index) {
      this.handleChartSeriesDialogOpen(row, (info) => {
        this.$set(this.chart.seriesKeys, index, info)
      })
    },

    handleChartSeriesDelete(index) {
      this.chart.seriesKeys.splice(index, 1)
    },

    handleChartSeriesDialogOpen(entity, save) {
      if (entity !== null) {
        this.chartSeriesEntity = Helper.assign({}, defaultChartSeriesEntity, entity)
      }
      this.chartSeriesDialog.save = save
      this.chartSeriesDialog.visible = true
    },

    handleChartSeriesDialogSave() {
      this.chartSeriesKeyOptions.forEach((item) => {
        if (item.value == this.chartSeriesEntity.key) {
          this.chartSeriesEntity.dataType = item.type;
          this.chartSeriesEntity.name = item.label;
        }
      });
      let info = Helper.assign({}, this.chartSeriesEntity)
      this.chartSeriesDialog.save(info)
      this.handleChartSeriesDialogClose()
    },

    handleChartSeriesDialogClose() {
      this.chartSeriesEntity = Helper.assign({}, defaultChartSeriesEntity)
      this.chartSeriesDialog = Helper.assign({}, defaultChartSeriesDialog)
    },

    handleFieldUploadConfig() {
      const uploadEntity = {}

      Object.keys(defaultUploadEntity).forEach((prop) => {
        uploadEntity[prop] = this.fieldEntity.options[prop]
      })

      this.handleUploadDialogOpen(uploadEntity, (uploadInfo) => {
        this.fieldEntity.options = Helper.assign({}, this.fieldEntity.options, uploadInfo)
      })
    },

    handleUploadDialogOpen(uploadEntity, save) {
      if (uploadEntity !== null) {
        this.uploadEntity = Helper.assign({}, defaultUploadEntity, uploadEntity)
      }
      this.uploadDialog.save = save
      this.uploadDialog.visible = true
    },

    handleUploadDialogSave() {
      const uploadInfo = Helper.assign({}, this.uploadEntity)
      this.uploadDialog.save(uploadInfo)
      this.handleUploadDialogClose()
    },

    handleUploadDialogClose() {
      this.uploadEntity = Helper.assign({}, defaultUploadEntity)
      this.uploadDialog = Helper.assign({}, defaultUploadDialog)
    },

    handleFieldEnumsMapsAdd() {
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        this.$set(this.fieldEntity.options.maps, valueInfo.name, valueInfo.value)
      }
    },

    handleFieldEnumsMapsEdit(prop) {
      this.valueEntity = Helper.assign({}, defaultValueEntity, prop)
      this.valueDialog.visible = true
      this.valueDialog.save = (valueInfo) => {
        if (prop.name !== valueInfo.name) {
          this.$delete(this.fieldEntity.options.maps, prop.name)
        }
        this.$set(this.fieldEntity.options.maps, valueInfo.name, valueInfo.value)
      }
    },

    handleFieldEnumsMapsDelete(prop) {
      this.$delete(this.fieldEntity.options.maps, prop.name)
    },

    handleTableRowUp(dataType, index) {
      this.handleTableRowUpDown(dataType, 'up', index)
    },

    handleTableRowDown(dataType, index) {
      this.handleTableRowUpDown(dataType, 'down', index)
    },

    handleTableRowUpDown(dataType, type, index) {
      let curr = null
      const next = type === 'up' ? index - 1 : index + 1
      switch (dataType) {
        case 'dataTable-columns':
          curr = this.dataTable.columns.splice(index, 1)[0]
          this.dataTable.columns.splice(next, 0, curr)
          break
        case 'dataTable-buttons':
          curr = this.dataTable.operations.buttons.splice(index, 1)[0]
          this.dataTable.operations.buttons.splice(next, 0, curr)
          break
        case 'searchForm-fields':
          curr = this.searchForm.fields.splice(index, 1)[0]
          this.searchForm.fields.splice(next, 0, curr)
          break
        case 'searchForm-buttons':
          curr = this.searchForm.buttons.splice(index, 1)[0]
          this.searchForm.buttons.splice(next, 0, curr)
          break
        case 'dialog-fields':
          curr = this.dialogEntity.fields.splice(index, 1)[0]
          this.dialogEntity.fields.splice(next, 0, curr)
          break
        case 'dialog-buttons':
          curr = this.dialogEntity.buttons.splice(index, 1)[0]
          this.dialogEntity.buttons.splice(next, 0, curr)
          break
        case 'chart-series':
          curr = this.chart.seriesKeys.splice(index, 1)[0]
          this.chart.seriesKeys.splice(next, 0, curr)
          break
        default:
          break
      }
    },

    renderFieldEnumsMapsOperationColumn(h) {
      return this.renderOperationColumn(h, this.handleFieldEnumsMapsAdd)
    },

    renderOperationColumn(h, cb) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={cb}>
          </el-button>
        </div>
      )
    },

    // 辅助方法，用于处理对象的属性被watch后，会被多处地方重新赋值，而导致的和预期不符合问题
    /* eslint-disable no-param-reassign */
    watchPropertyComplete(target, props, cb) {
      if (props.length) {
        const prop = props.shift()
        this.$set(target, prop.name, prop.value)
        this.$nextTick(() => {
          this.watchPropertyComplete(target, props, cb)
        })
      } else {
        cb()
      }
    },
    /* eslint-enable no-param-reassign */

    // 加载页面配置
    loadData(pageCode, isCopy = false) {
      if (!isCopy) {
        this.pageCode = pageCode
        this.disabledPageCode = true
      }

      const setPageConfig = (pageConfig) => {
        Object.keys(pageConfig).forEach((prop) => {
          Helper.correct(Config.setup[prop], pageConfig[prop])
          this.$set(this.$data, prop, pageConfig[prop])
        })
      }

      const loadLocalConfig = () => {
        this.loading = true
        request({
          url: '/meta/info',
          baseURL: '',
          params: {
            code: pageCode
          }
        }).then((res) => {
          this.loading = false
          const pageConfig = res.value
          if (pageConfig) {
            setPageConfig(JSON.parse(pageConfig))
          }
        })
      }

      loadLocalConfig()
    },

    // 保存页面配置逻辑
    handleSave() {
      for (let i = 0, ilen = this.chartxAxisKeyOptions.length; i < ilen; i++) {
        let item = this.chartxAxisKeyOptions[i]
        if (item.value == this.chart.xAxisKey.key) {
          this.chart.xAxisKey = Helper.assign({}, this.chart.xAxisKey, {
            'name': item.label,
            'key': item.value,
            'dataType': item.type
          })
          break;
        }
      }
      const pageConfig = JSON.stringify({
        page: this.page,
        searchForm: this.searchForm,
        dataTable: this.dataTable,
        dialogs: this.dialogs,
        chart: this.chart
      })

      let params = {
        type: Config.metaTypes.page,
        code: this.pageCode,
        value: pageConfig
      }

      // let url = '/console/page/meta/save'
      let url = '/meta/save'
      console.log(this.id)
      if (this.id !== 0) {
        url = '/console/page/meta/update'
        params.id = this.id
      }

      this.loading = true
      request({
        url,
        baseURL: '',
        method: 'post',
        data: params
      }).then((res) => {
        this.loading = false
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '保存页面配置成功'
          })

          if (this.id === 0) {
            router.push({
              name: 'factory',
              params: {
                code: this.pageCode
              }
            }, () => {
              this.loadData(this.pageCode)
            })
          }
        } else {
          this.$msgbox({
            type: 'error',
            message: res.message || '保存页面配置失败'
          })
        }
      }).catch((e) => {
        console.log(e)
        this.$msgbox({
          type: 'error',
          message: '请求保存页面配置接口失败'
        })
      })
    }
  },

  mounted() {
    if (this.$route.params.code) {
      this.loadData(this.$route.params.code)
    } else if (this.$route.query.from) {
      this.loadData(this.$route.query.from, true)
    }
  }
}
