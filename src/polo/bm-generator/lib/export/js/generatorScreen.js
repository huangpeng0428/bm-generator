import { mapState } from 'vuex'
import ExportJS from 'exportjs'
import Tmpl from 'coffee-tmpl'
import axios from 'axios'
import ECharts from 'vue-echarts/components/ECharts.vue'
import quicksort from '../../quicksort'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import request from '../../request'
import Helper from '../../helper'
import Config from '../../config'
import Expose from '../../expose'
import Bus from '../../bus'
import FormItem from '../../components/FormItem'

const defaultIframe = {
  src: '',
  title: '',
  show: false,
  size: 'small'
}

const requestCancelObj = {
  dataTableCancelFn: null,
  chartCancelFn: null,
  summaryCancelFn: null,
  totalCancelFn: null,
  configCancelFn: null
}

export default {
  name: 'Generator',

  provide() {
    return {
      screen: this
    };
  },

  props: {
    code: String
  },

  components: {
    FormItem,
    chart: ECharts
  },

  data() {
    const setup = Helper.assign({}, Config.setup)
    return {
      ...setup,
      pageCode: '',
      exports: {
        show: false,
        text: '导出报表',
        percent: 0,
        status: ''
      },
      cache: {
      },
      styleTag: null,
      iframe: Helper.assign({}, defaultIframe),
      oldSearchFormInfo: {}, // 存储最近一次查询
      dataTableSelectedRows: [],
      pageLoading: false,
      jumpOrder: '',
      chartCompareDay: Helper.convertMapToArray(Config.chartCompareDayMap)
    }
  },

  computed: {
    ...mapState([
      'permissionTree',
      'navChildPage'
    ]),

    breadcrumb() {
      const url = this.$route.path
      let result = []
      let parent = null
      let curr = null
      let last = null

      this.permissionTree.forEach((tree) => {
        if (tree.children.length == 0) {
          if (tree.url === url || tree.url === this.navChildPage[url]) {
            parent = { title: tree.title }
          }
        } else {
          tree.children.forEach((item) => {
            if (item.url === url) {
              parent = { title: tree.title }
              curr = { title: item.title }
            } else if (item.url === this.navChildPage[url]) { // 在第三层级中
              parent = { title: tree.title }
              curr = { title: item.title, url: item.url }
              last = { title: this.page.title }
            }
          })
        }
      })

      if (parent) result.push(parent)
      if (curr) result.push(curr)
      if (last) result.push(last)

      return result
    },

    hideSearchForm() {
      return this.searchForm.buttons.length == 0 &&
        this.searchForm.fields.filter(p => p.type != 'hidden').length == 0
    },

    searchFormFields() {
      return this.searchForm.fields.map(p => {
        p.show = true
        if (p.showFilter) {
          /* eslint-disable no-param-reassign */
          /* eslint-disable no-new-func */
          if (typeof p.showFilter === 'string') {
            p.showFilter = new Function('searchForm', p.showFilter)
          }
          /* eslint-enable no-new-func */
          /* eslint-enable no-param-reassign */
          p.show = p.showFilter(this.searchFormInfo)
        }
        return p
      })
    },

    searchFormInfo() {
      const info = {}
      this.searchForm.fields.forEach((field) => {
        let key = field.key
        if (Array.isArray(key) || key.indexOf(',') != -1) { // 添加逗号分隔
          if (!Array.isArray(key)) {
            key = key.split(',')
          }
          key.forEach((k, i) => {

            // console.log(field.value);
            if (Array.isArray(field.value)) {
              info[k] = field.value[i]
            } else {
              info[k] = field.value
            }
          })
        } else if (Array.isArray(field.value)) {
          info[key] = JSON.stringify(field.value)
        } else {
          info[key] = field.value
        }
      })

      // this.$router.replace({
      //   path: this.$route.path,
      //   query: info,
      // })
      return info
    },

    dialogEntities() {
      const entities = {}

      Object.keys(this.dialogs).forEach((dialogName) => {
        entities[dialogName] = {}

        this.dialogs[dialogName].fields.forEach((field) => {
          if (Array.isArray(field.key)) {
            field.key.forEach((k, i) => {
              if (Array.isArray(field.value)) {
                entities[dialogName][k] = field.value[i]
              } else {
                entities[dialogName][k] = field.value
              }
            })
          } else {
            entities[dialogName][field.key] = field.value
          }
        })
      })
      return entities
    },

    isChartCompareDay() {
      const params = this.getDataTableParams(this.searchForm.urls.chart.beforeFilter, '请求数据列表接口的处理查询条件有误，返回值必须是一个对象')
      if (this.chart.compare && this.chart.compare.key) {
        let dateKeys = this.chart.compare.key.split(',')
        if (this.chart.compare.day && params[dateKeys[0]] == params[dateKeys[1]]) {
          return true
        }
      }
      return false
    }
  },

  watch: {
    $route(to, from) {

      // this.resetDefalutConfig()
      if (to.path != from.path) {
        console.log('-------------loadPageConfig');

        this.loadPageConfig()
      }
    }
  },

  filters: {
    dialogViewFieldValue(val, entry) {
      let r = val
      switch (entry.type) {
        case 'dropdown':
          if (entry.isAsync === false) {
              entry.options.data.forEach((d) => {
                if (d.value === val.toString()) r = d.name
              })
          }
          break
        case 'date':
        case 'datetime':
          if (val) {
            r = Helper.formatDate(
              val,
              entry.options.format
            )
          }
          break;
      }
      return r
    },

    percent(val) {
      let v = val
      if (typeof v !== 'number') v = parseFloat(v)
      if (isNaN(v)) return ''
      return `${(v * 100).toFixed(2)}%`
    },

    textRouteParse(val, query) {
      return Helper.textParse(val, query)
    }

  },

  methods: {
    resetDefalutConfig() {
      const setup = Helper.assign({}, Config.setup)
      for (let key in setup) {
        this.$set(this.$data, key, setup[key])
      }
    },

    // 公共发请求处理
    request(req, options = {}) {
      const opts = Helper.assign({
        always() { },
        success() { },
        error() { }
      }, options)
      if (req.method === 'POST' || req.method === 'post') {
        req.data = Helper.deepCopy(req.params)
        req.params = {}
        delete req.data['']
      }
      return request(req).then((res) => {
        opts.always()
        if (res.code === 200) {
          opts.success(res)
        } else {
          opts.error(res)
        }
      }).catch(() => {
        opts.always()
      })
    },

    // datatable 行添加样式
    dataTableRowClassName(row) {
      return row.isSummary ? 'data-table-summary' : ''
    },

    // 加入 searchForm 的数据
    mixinSearchFormData(val) {
      return Helper.assign({}, this.oldSearchFormInfo, val)
    },

    // datatable 排序
    handleDataTableSort(sortData) {
      this.updateSearchFormSortFieldValue(sortData)
      this.handleButtonClick('searchForm', { type: 'search' }, { isRefresh: !this.dataTable.useLocalSort, needRemoteLoad: !this.dataTable.useLocalSort })
    },

    handleDataTableSelectionChange(val) {
      this.dataTableSelectedRows = val
    },

    rowSelectable(row, index) {
      if (this.dataTable.batch.selectable) {
        if (typeof this.dataTable.batch.selectable == 'string') {
          // eslint-disable-next-line no-new-func
          this.dataTable.batch.selectable = new Function('row', 'index', this.dataTable.batch.selectable)
        }
        return this.dataTable.batch.selectable(row, index)
      }
      return true
    },

    // ref引用值同步修改
    syncRefValueChange(key, value, type, extend) {
      const findField = (fields) => {
        let index = null
        fields.forEach((field, inx) => {
          if (Array.isArray(field.key)) {
            if (field.key.indexOf(key) !== -1) {
              index = inx
            }
          } else if (field.key === key) {
            index = inx
          }
        })
        return index === null ? null : fields[index]
      }

      this.setField(
        findField(type === 'dialog' ? this.dialogs[extend.name].fields : this.searchForm.fields),
        value,
        key
      )
    },

    // 获取数据列表的column显示值
    getColumnValue(column, row, index, origin = 'list') {
      let r = ''
      switch (column.type) {
        case 'index':
          if (origin === 'list') {
            r = index + (
              (this.dataTable.pagination.currentPage - 1) *
              this.dataTable.pagination.pageSize
            ) + 1
            if (row.isSummary) {
              r = '合计'
            }
          }
          break
        case 'plain':
          r = column.text
          break
        case 'enum':
          if (column.options.maps) {
            column.maps = this[column.options.maps]
          }
          if (column.options.multiple) {
            let val = Helper.getValueByPath(row, column.field)
            if (val) {
              r = val.split(',').map(x => {
                return column.maps[x]
              }).join(',')
            }
          } else {
            r = column.maps[Helper.getValueByPath(row, column.field)]
          }
          break
        case 'percent':
          r = this.$options.filters.percent(Helper.getValueByPath(row, column.field))
          break
        case 'link':
        case 'router':
        case 'inner':
          r = column.text || Helper.getValueByPath(row, column.field)
          break
        case 'money': {
          const money = Helper.getValueByPath(row, column.field)
          const split = String(money).split('.')
          const t = split[0].split('').reverse()
          const k = []

          while (t.length) {
            k.push(t.splice(0, 3))
          }

          r = [k.map(x => x.reverse().join('')).reverse().join(',')].concat(split[1] || []).join('.')
          break
        }
        case 'time':
          if (Array.isArray(column.options.field)) {
            let t1 = Helper.getValueByPath(row, column.options.field[0])
            let t2 = Helper.getValueByPath(row, column.options.field[1])
            let rowVal = Helper.getValueByPath(row, column.options.condition[0])
            let conditionVal = column.options.condition[1]
            let text = column.options.condition[2]
            if (t1 > 0 && t2 > 0) {
              let time1 = t1 == null || isNaN(Number(t1)) || (typeof t1 == 'number' && t1 < 1000 * 3600 * 24) ? t1 : Helper.formatDate(t1, column.format)
              let time2 = t2 == null || isNaN(Number(t2)) || (typeof t2 == 'number' && t2 < 1000 * 3600 * 24) ? t2 : Helper.formatDate(t2, column.format)
              r = time1 + '至' + time2
            } else if (rowVal == conditionVal) {

              // 特殊时间,如：永久
              r = text
            } else {

              // 错误时间
              r = ''
            }
          } else {
            let time = Helper.getValueByPath(row, column.field)
            r = time == null || isNaN(Number(time)) || (typeof time == 'number' && time < 1000 * 3600 * 24) ? time : Helper.formatDate(time, column.format)
          }
          break
        case 'date':
          let date = Helper.getValueByPath(row, column.field)
          if (date == null) {
            r = ''
          } else if (isNaN(Number(date))) {
            r = date.split(' ')[0]
          } else {
            r = Helper.formatDate(date, column.format)
          }
          break
        case 'float': // 浮点，强制保留两位
          r = Number(Helper.getValueByPath(row, column.field))
          r = isNaN(r) ? '' : r.toFixed(2)
          break
        case 'filter':// 处理如：0=无 这种情况
          // eslint-disable-next-line no-new-func
          let fn = new Function('value', column.options.filter)
          r = fn(Helper.getValueByPath(row, column.field))
          break
        case 'raw':
        default:
          r = Helper.getValueByPath(row, column.field)
          break
      }
      if (origin == 'list-title') {
        r = r && r.length > 12 ? r : ''
      }
      return r
    },

    // 判断列是否显示
    handleColumnVisible(column) {
      let visible = true

      if (column.showFilter) {
        /* eslint-disable no-param-reassign */
        /* eslint-disable no-new-func */
        if (typeof column.showFilter === 'string') {
          column.showFilter = new Function('searchForm', column.showFilter)
        }
        /* eslint-enable no-new-func */
        /* eslint-enable no-param-reassign */
        visible = column.showFilter(this.searchFormInfo)
      }

      return visible
    },

    // 按钮是否显示
    handleButtonVisible(origin, btn, data) {
      let visible = true

      if (btn.options && btn.options.showFilter) {
        /* eslint-disable no-param-reassign */
        /* eslint-disable no-new-func */
        if (typeof btn.options.showFilter === 'string') {
          btn.options.showFilter = new Function('data', btn.options.showFilter)
        }
        /* eslint-enable no-new-func */
        /* eslint-enable no-param-reassign */
        if (origin === 'dialog') {
          data = data.extend
        }
        visible = btn.options.showFilter(data)
      }

      return visible
    },

    // 根据url配置来判断对话框的保存按钮是否需要显示
    handleDialogSaveButtonVisible(dialog) {
      let visible = true

      // console.log('dialog', dialog.urls);
      if (!dialog.urls) return
        if (
          !Object.keys(dialog.urls.save).length &&
          !Object.keys(dialog.urls.add).length &&
          !Object.keys(dialog.urls.edit).length
        ) {
          visible = false;
        }

      if (dialog.status === 'disabled' ||
        dialog.status === 'view') {
        visible = false
      }

      return visible
    },

    // 公共按钮点击处理事件
    handleButtonClick(origin, btn, data) {
      console.log(origin, btn, data)
      console.log('-------------handleButtonClick', origin);

      if (origin == 'dataTableBatch' && this.dataTableSelectedRows && this.dataTableSelectedRows.length == 0) { // 如果没有勾选数据
        this.$message.error('请先勾选数据');
        return;
      }
      let batchData = {}
      if (origin == 'dataTableBatch') {

        // 批量操作合同批量参数
        const batchParams = data.params ? JSON.parse(data.params) : {}
        if (Helper.isPureObject(batchParams)) {
          batchData = batchParams
        } else if (Array.isArray(batchParams)) {
          batchParams.forEach((param) => {
            if (typeof param === 'string' ||
              (Helper.isPureObject(param) && 'value' in param)) {
              const name = typeof param === 'string' ? param : param.name
              const value = typeof param === 'string' ? param : param.value
              this.dataTableSelectedRows.forEach(p => {
                if (typeof batchData[name] == 'undefined') {
                  batchData[name] = []
                }
                batchData[name].push(p[value])
              })
              batchData[name] = batchData[name].join(',')
            } else if (Helper.isPureObject(param) && 'raw' in param) {
              batchData[param.name] = param.raw
            }
          })
        }
      }
      switch (btn.type) {
        case 'reset':
          if (origin === 'searchForm') {
            this.resetSearchFormFields()
          }
          break
        case 'search':
          this.oldSearchFormInfo = this.searchFormInfo
          Expose.searchFlag = true
          this.loadDataTableData(data)
          this.loadChartData(data)
          break
        case 'dialog': {
          const dialog = this.dialogs[btn.options.name]
          if (origin === 'dialog') {
            dialog.parent = data.name
          }
          dialog.loading = false
          if (btn.options.status === 'add') {
            this.resetDialogFields(btn.options.name)
            this.handleDialog(btn.options.name, true, btn.options.status)
            this.updateDialogFieldsValue(btn.options.name, this.$route.query)
          } else if (btn.isAsync) {
            dialog.loading = true
            this.handleDialog(btn.options.name, true, btn.options.status, data)
            const params = Helper.makeParams(btn.options.params, data)

            this.request({
              ...btn.options,
              params
            }, {
              always: () => {
                dialog.loading = false
              },
              success: (res) => {
                let value = null
                if (btn.options.filter) {
                  /* eslint-disable no-param-reassign */
                  /* eslint-disable no-new-func */
                  if (typeof btn.options.filter === 'string') {
                    btn.options.filter = new Function('res', 'data', btn.options.filter)
                  }
                  /* eslint-enable no-new-func */
                  /* eslint-enable no-param-reassign */
                  if (origin === 'dialog') {
                    value = btn.options.filter(res, data.extend)
                  } else {
                    value = btn.options.filter(res, data)
                  }
                } else if (Helper.isPureObject(res.value)) {
                  value = res.value
                }

                dialog.extend = value

                if (value !== null) {
                  this.updateDialogFieldsValue(btn.options.name, value)
                } else {
                  this.$msgbox({
                    type: 'warning',
                    message: `
                      无法处理返回值，请使用filter
                      url: ${btn.options.url}
                    `
                  })
                }
              },
              error: () => {
                this.$msgbox({
                  type: 'error',
                  message: `请求对话框内容失败: ${btn.options.url}`
                })
              }
            })
          } else if (origin == 'dataTableBatch') {
            this.handleDialog(btn.options.name, true, btn.options.status, batchData)
            this.updateDialogFieldsValue(btn.options.name, batchData)
          } else {
            this.handleDialog(btn.options.name, true, btn.options.status,
              Helper.assign({}, this.$route.query, data))
            this.updateDialogFieldsValue(btn.options.name,
              Helper.assign({}, this.$route.query, data))
          }
          break
        }
        case 'confirm':
          this.$confirm(btn.options.confirmMessage, '提示')
            .then(() => {

              // 不能删除弹出提示的如：上架
              if (btn.options.confirmCheck) {
                let { message, rule } = btn.options.confirmCheck
                // eslint-disable-next-line no-new-func
                let fn = new Function('data', rule)
                if (fn(data)) {
                  this.$message({
                    type: 'error',
                    message: message
                  })
                  return
                }
              }
              if (btn.isAsync) {
                let params
                if (origin === 'dialog') {
                  params = Helper.makeParams(btn.options.params, data.extend)
                } else {
                  params = Helper.makeParams(btn.options.params, Helper.assign({}, this.$route.query, data))
                }

                this.request({
                  ...btn.options,
                  params
                }, {
                  success: () => {
                    this.$message({
                      type: 'success',
                      message: btn.options.successMessage || '操作成功'
                    })
                    if (origin === 'dataTable') {
                      this.loadDataTableData()
                    } else if (origin == 'dialog') {
                      this.dialogs[data.name].show = false
                      this.loadDataTableData()
                    }
                  },
                  error: (res) => {
                    this.$message({
                      type: 'error',
                      message: btn.options.errorMessage || res.message || '操作失败'
                    })
                  }
                })
                Bus.$emit('generator-action', 'confirm-dialog', {
                  btn
                })
              }
            }).catch(() => { })
          break
        case 'close':
          this.dialogs[data.name].show = false
          break
        case 'request': {
          const dialog = this.dialogs[data.name]

          /* eslint-disable no-param-reassign */
          /* eslint-disable no-new-func */
          if (typeof btn.options.beforeFilter === 'string') {
            if (dialog.type === 'template') {
              btn.options.beforeFilter = new Function('props', btn.options.beforeFilter)
            } else {
              btn.options.beforeFilter = new Function('params', 'dialog', btn.options.beforeFilter)
            }
          }
          /* eslint-enable no-new-func */
          /* eslint-enable no-param-reassign */

          if (dialog.type === 'template') {
            let $dynamic = this.$refs[`dialog-${data.name}-dynamic`]
            if (Array.isArray($dynamic)) $dynamic = $dynamic[0]

          } else {
          }
          let dialogName = data.name,
            $form = this.$refs[`form-${dialogName}`],
            isError = false,
            componentObj = {};
          if (Array.isArray($form)) $form = $form[0]
          dialog.fields.forEach(field => {
            if (field.type === 'other-component') {
              componentObj = this.$refs[`otherComponent${field.componentName}`]
              if (Array.isArray(componentObj)) componentObj = componentObj[0]
              if (componentObj.hasOwnProperty('syncValidateFn')) {
                isError = componentObj.syncValidateFn() || isError;
              }
            }
          });
          if (isError) break;
          $form.validate((valid) => {
            if (valid) {
              let params = this.dialogEntities[dialogName]
              let req = null
              if (dialog.urls.save && dialog.urls.save.url) {
                req = dialog.urls.save
              } else {
                req = dialog.urls[dialog.status]
              }

              if (req !== null) {
                if (req.beforeFilter) {
                  /* eslint-disable no-new-func */
                  if (typeof req.beforeFilter === 'string') {
                    req.beforeFilter = new Function('params', 'dialog', req.beforeFilter)
                  }
                  /* eslint-enable no-new-func */
                  params = req.beforeFilter(params, dialog)
                }
                dialog.loading = true
                this.request({
                  ...btn.options,
                  params
                }, {
                  always: () => {
                    dialog.loading = false
                  },
                  success: (res) => {
                    if (btn.options.filter) {
                      /* eslint-disable no-param-reassign */
                      /* eslint-disable no-new-func */
                      if (typeof btn.options.filter === 'string') {
                        btn.options.filter = new Function('res', 'data', btn.options.filter)
                      }
                      /* eslint-enable no-new-func */
                      /* eslint-enable no-param-reassign */
                      btn.options.filter(res, data)
                    } else {
                      this.$message({
                        type: 'success',
                        message: btn.options.successMessage || '操作成功'
                      })
                      this.dialogs[data.name].show = false
                      if (dialog.parent) {
                        this.dialogs[data.parent].show = false
                      }
                      this.loadDataTableData()
                    }
                  },
                  error: (res) => {
                    this.$msgbox({
                      type: 'error',
                      message: res.message || btn.options.errorMessage || '接口请求出错'
                    })
                  }
                })
              } else {
                this.$msgbox({
                  type: 'error',
                  mssage: '找不到保存接口路径，请检查配置'
                })
              }
            } else {
              this.$message({
                type: 'error',
                message: '请正确的填写信息'
              })
            }
          })
          break
        }
        case 'fast-request': {
          let params = Helper.makeParams(btn.options.params, Helper.assign({}, batchData, this.$route.query))

          // params = btn.options.beforeFilter(this.dialogEntities[data.name], dialog)

          this.request({
            ...btn.options,
            params
          }, {
            success: (res) => {
              if (btn.options.filter) {
                /* eslint-disable no-param-reassign */
                /* eslint-disable no-new-func */
                if (typeof btn.options.filter === 'string') {
                  btn.options.filter = new Function('res', 'data', btn.options.filter)
                }
                /* eslint-enable no-new-func */
                /* eslint-enable no-param-reassign */
                btn.options.filter(res, data)
              } else {
                this.$message({
                  type: 'success',
                  message: btn.options.successMessage || '操作成功'
                })
                this.loadDataTableData()
              }
            },
            error: (res) => {
              this.$msgbox({
                type: 'error',
                message: res.message || btn.options.errorMessage || '接口请求出错'
              })
            }
          })
          break
        }
        case 'batch-match': {
          let params = Helper.makeParams(btn.options.params, Helper.assign({}, batchData, this.$route.query));
          let matchStatus = params.matchStatus.split(',');
          let appStatus = params.appStatus.split(',');
          let pass = true;
          matchStatus.forEach((item, index) => {
            if (item != 2 || (appStatus[index] != 50 && appStatus[index] != 70)) { // 匹配有结果 并且应用状态是 上架或者下架才可以
              pass = false
            }
          })
          if (pass) {
            this.$confirm('确认匹配所选项目？', '批量确认匹配', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              let params = Helper.makeParams(btn.options.params, Helper.assign({}, batchData, this.$route.query));
              let appName = params.appName.split(',');
              let appId = params.appId.split(',')
              let apps = [];
              appName.forEach((item, index) => {
                apps.push({
                  appId: appId[index],
                  appName: item
                })
              })
              this.request({
                method: 'post',
                url: '/console/wish/confirm_match',
                params: {
                  apps: JSON.stringify(apps)
                }
              }, {
                success: () => {
                  this.$message({
                    message: '批量确认成功',
                    type: 'success'
                  });
                  this.loadDataTableData()
                },
                error: (res) => {
                  this.$msgbox({
                    type: 'error',
                    message: res.message || btn.options.errorMessage || '接口请求出错'
                  })
                }
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: '您选择了不合法的心愿单',
              type: 'error'
            });
          }
          break
        }
        case 'batch-delete': {
          this.$alert('确认删除所选项目？', '批量删除', {
            confirmButtonText: '确定',
            callback: () => {
              let params = Helper.makeParams(btn.options.params, Helper.assign({}, batchData, this.$route.query));
              this.request({
                method: 'get',
                url: '/console/wish/delete',
                params: {
                  ids: params.ids
                }
              }, {
                success: () => {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.loadDataTableData()
                },
                error: (res) => {
                  this.$msgbox({
                    type: 'error',
                    message: res.message || btn.options.errorMessage || '接口请求出错'
                  })
                }
              })
            }
          });
          break
        }
        case 'export':
          this.handleExportReport()
          Bus.$emit('generator-action', btn.type, {
            btn
          })
          break
        case 'iframe': {
          const opts = Helper.assign({}, btn.options)
          Object.keys(opts).forEach((op) => {
            opts[op] = Tmpl.parse(opts[op], {
              data,
              searchForm: this.searchFormInfo
            })
          })
          this.iframe = Helper.assign({}, defaultIframe, opts)
          this.iframe.show = true
          break
        }
        default:
          break
      }
    },

    // 弹框操作
    handleDialog(name, show, status, extend = {}) {
      console.log('this.dialogs', this.dialogs);
      const dialog = this.dialogs[name]
      dialog.status = status
      dialog.show = show
      dialog.extend = extend
      dialog.name = name

      // 这里的执行顺序可能会有问题，因为在没有获取数据之前就做了disabled工作
      // 有该状态值的选项
      /* eslint-disable no-param-reassign */
      if (status === 'disabled') {
        dialog.fields.forEach((field) => {
          field.disabled = true
        })
      } else if (dialog.options && status in dialog.options) {
        if (dialog.options[status] && dialog.options[status].disabled) {
          if (Array.isArray(dialog.options[status].disabled)) {
            dialog.fields.forEach((field) => {
              field.isUpdated = true
              if (typeof field.key === 'string') {
                field.disabled = dialog.options[status].disabled.indexOf(field.key) !== -1
              } else if (Array.isArray(field.key)) {
                field.key.forEach((k) => {
                  field.disabled = dialog.options[status].disabled.indexOf(k) !== -1
                })
              }
            })
          }
        }
      }
      /* eslint-enable no-param-reassign */
    },

    // 重置表单控件值
    /* eslint-disable no-param-reassign */
    resetField(field) {
      switch (field.type) {
        case 'switch':
          if (field.defaultValue) field.value = field.options.on.value
          else field.value = field.options.off.value
          field.options.value = field.defaultValue
          break
        case 'date':
        case 'datetime':
          if (!Helper.isEmptyValue(field.defaultValue)) {
            field.value = Helper.formatDate(
              Helper.getDate(field.defaultValue),
              field.options.format
            )
          } else {
            field.value = field.defaultValue
          }
          break
        case 'daterange':
        case 'datetimerange': {
          if (!Helper.isEmptyValue(field.defaultValue)) {
            const range = Helper.getDateRange(field.defaultValue, field.options.notIncludeToday)
            field.options.value = range
            field.value = [
              Helper.formatDate(range[0], field.options.format),
              Helper.formatDate(range[1], field.options.format)
            ]
          } else {
            field.value = ['', '']
            field.options.value = ['', '']
          }
          break
        }
        case 'checkbox-group':
          if (Helper.isEmptyValue(field.defaultValue)) {
            field.value = []
          }
          break
        case 'dropdown':
          if (field.dataType === 'number' && field.defaultValue !== '') {
            field.value = Number(field.defaultValue)
          } else {
            field.value = field.defaultValue
          }
          break
        default:
          field.value = field.defaultValue
      }
    },
    /* eslint-enable no-param-reassign */

    // 重置表单控件组（循环调用resetField）
    resetFields(fields) {
      fields.map(field => this.resetField(field))
    },

    // 重置搜索表单表单控件
    resetSearchFormFields() {
      this.resetFields(this.searchForm.fields)
    },

    // 重置弹框表单项
    resetDialogFields(name) {
      this.resetFields(this.dialogs[name].fields)
    },

    // 设置表单控件值
    /* eslint-disable no-param-reassign */
    setField(field, val, key) {
      if (field === null) return
      switch (field.type) {

        // case 'date':
        // case 'datetime':
        //   field.value = Helper.formatDate(new Date(val), field.options.format)
        //   break
        case 'daterange':
        case 'datetimerange': {
          const index = field.key.indexOf(key)
          if (index !== -1) {
            if (field.dataType == 'string') {
              val = Helper.formatDate(new Date(val), field.options.format)
            }
            this.$set(field.value, index, val)
            this.$set(field.options.value, index, val)
          }
          break
        }
        case 'switch':
          /* eslint-disable eqeqeq */
          field.options.value = field.value == field.options.on.value
          /* eslint-enable eqeqeq */
          field.value = val
          break
        default:
          field.value = val
      }
    },
    /* eslint-enable no-param-reassign */

    // 更新弹框表单
    updateDialogFieldsValue(name, info) {
      const dialog = this.dialogs[name]
      if (dialog.type === 'template') {
        this.$set(dialog, 'data', info)
      } else {
        /* eslint-disable no-param-reassign */
        (dialog.fields || []).forEach((field) => {
          let fieldKeys = []
          if (!Array.isArray(field.key)) {
            fieldKeys = field.key.split(',')
          } else {
            fieldKeys = [field.key]
          }

          if (fieldKeys.length > 1) {
            const val = []
            fieldKeys.forEach((key) => {
              if (typeof info[key] !== 'undefined') {
                val.push(info[key])
              }
            })
            if (val.length > 0) {
              this.setField(field, val, field.key)
            } else {
              field = this.resetField(field)
            }
          } else {
            if (Array.isArray(field.key)) {
              let isUndefined = false
              field.key.forEach((key) => {
                if (typeof info[key] == 'undefined') {
                  isUndefined = true
                } else {
                  this.setField(field, info[key], key)
                }
              })
              isUndefined && (field = this.resetField(field))
            } else {
              const val = field.key ? info[field.key] : info;
              if (typeof val === 'undefined') {
                field = this.resetField(field)
              } else {
                this.setField(field, val, field.key)
              }
            }
          }
        })
        /* eslint-enable no-param-reassign */
      }
    },

    // 更新搜索框内容
    updateSearchFormFieldValue(key, value) {
      let fieldIndex = null
      this.searchForm.fields.forEach((field, index) => {
        if (Array.isArray(field.key)) {
          if (field.key.indexOf(key) !== -1) {
            fieldIndex = index
          }
        } else if (field.key === key) {
          fieldIndex = index
        }
      })

      if (fieldIndex != null) {
        const field = this.searchForm.fields[fieldIndex]
        this.setField(field, value, key)
      }
    },

    sendSortRequest(sortConfig, row) {
      /* eslint-disable no-param-reassign */
      /* eslint-disable no-new-func */
      // if (typeof sortConfig.beforeFilter === 'string') {
      //     sortConfig.beforeFilter = new Function('params', sortConfig.beforeFilter)
      // }
      /* eslint-enable no-new-func */
      /* eslint-enable no-param-reassign */
      const params = Helper.makeParams(sortConfig.params, Helper.assign({}, this.$route.query, row))

      // sortConfig.beforeFilter()

      this.request({
        ...sortConfig,
        params
      }, {
        success: (res) => {
          if (sortConfig.filter) {
            /* eslint-disable no-param-reassign */
            /* eslint-disable no-new-func */
            if (typeof sortConfig.filter === 'string') {
              sortConfig.filter = new Function('res', 'data', sortConfig.filter)
            }
            /* eslint-enable no-new-func */
            /* eslint-enable no-param-reassign */
            // eslint-disable-next-line no-undef
            sortConfig.filter(res, data)
          } else {
            this.$message({
              type: 'success',
              message: sortConfig.successMessage || '操作成功'
            })
            this.loadDataTableData()
          }
        },
        error: (res) => {
          this.$msgbox({
            type: 'error',
            message: res.message || sortConfig.errorMessage || '接口请求出错'
          })
        },
        always: () => {
          document.getElementsByTagName('div')[0].click()
        }
      })
    },

    // inner内部操作column类型的回调
    handleColumnInnerClick(column, row) {
      if (column.options.callback) {
        /* eslint-disable no-param-reassign */
        /* eslint-disable no-new-func */
        if (typeof column.options.callback === 'string') {
          column.options.callback = new Function('data', column.options.callback).bind(this)
        }
        /* eslint-enable no-new-func */
        /* eslint-enable no-param-reassign */
        column.options.callback(row)
      }
    },

    // sort操作column类型的回调
    handleColumnSortClick(row, type) {
      if (type == 'jump') {
        this.jumpOrder = ''
      } else {
        this.sendSortRequest(this.dataTable.sortUrls[type], row, type)
      }
    },

    handleSortJump(row, type) {
      if (!this.jumpOrder) return
      this.sendSortRequest(this.dataTable.sortUrls[type],
        Helper.assign({}, row, { order: this.jumpOrder }), type)
    },

    handleFieldVisible(field, model, extend) {
      let r = true
      if (field.showFilter) {
        /* eslint-disable no-param-reassign */
        /* eslint-disable no-new-func */
        if (typeof field.showFilter === 'string') {
          field.showFilter = new Function('model', 'extend', field.showFilter)
        }
        /* eslint-enable no-new-func */
        /* eslint-enable no-param-reassign */
        r = field.showFilter(model, extend)
      }
      return r
    },

    // 获取数据列表查询时的查询参数
    getDataTableParams(beforeFilter, msg) {
      const searchFormInfo = this.searchFormInfo
      let params = Helper.assign({}, searchFormInfo)
      if (typeof beforeFilter === 'function') {
        params = beforeFilter(params)
        if (!Helper.isPureObject(params)) {
          this.$msgbox({
            type: 'error',
            message: msg
          })
          console.error(msg, beforeFilter, params)
          return null
        }
      }
      return params
    },

    // 返回包含 summary 的 dataTable 的 data 数据
    getSummaryDataTableData() {

      // 无key值，或者value都是null，则无总计
      if (this.dataTable.summary == null || Object.keys(this.dataTable.summary).length == 0 || Object.values(this.dataTable.summary).filter(p => p !== null).length == 0) {
        this.dataTable.summary = null
      }
      if (this.dataTable.summary == null) return this.dataTable.data
      this.dataTable.summary.isSummary = true
      let data = this.dataTable.data.filter(d => !d.isSummary)
      return this.dataTable.summaryPosition == 'first'
        ? [this.dataTable.summary].concat(data)
        : data.concat([this.dataTable.summary])
    },

    // 加载数据列表的列表
    loadDataTableList(options) {
      const opts = Helper.assign({
        always() { },
        success() { },
        error() { },
        params: {},
        needRemoteLoad: true
      }, options)

      const sortFn = (p1, p2) => {
        p1 = Helper.getValueByPath(p1, params.orderBy) || 0
        p2 = Helper.getValueByPath(p2, params.orderBy) || 0
        if (Helper.isString(p1) && Helper.isStringNumber(p1)) {
          p1 = parseFloat(p1)
        }
        if (Helper.isString(p2) && Helper.isStringNumber(p2)) {
          p2 = parseFloat(p2)
        }
        return (params.sortType == 'desc' ? p1 <= p2 : p1 >= p2) ? 1 : -1
      }

      if (this.searchForm.urls.list.beforeFilter && typeof this.searchForm.urls.list.beforeFilter === 'string') {
        /* eslint-disable no-new-func */
        this.searchForm.urls.list.beforeFilter = new Function('params', this.searchForm.urls.list.beforeFilter)
        /* eslint-enable no-new-func */
      }

      const params = this.getDataTableParams(this.searchForm.urls.list.beforeFilter, '请求数据列表接口的处理查询条件有误，返回值必须是一个对象')

      if (params === null) return

      if (opts.params) {
        Object.keys(opts.params).forEach((param) => {
          params[param] = opts.params[param]
        })
      }

      // 不需要 refresh ,则本地读取
      if (!opts.needRemoteLoad && this.dataTable.allResult) {
        let data = this.dataTable.allResult.data.slice();
        if (this.dataTable.useLocalSort) {
          if (params.orderBy) {

            // data.sort(sortData)
            data = quicksort(data, sortFn)
          }
        }
        opts.success({
          data: data.slice(params.start, params.start + parseInt(params.max)),
          total: this.dataTable.allResult.total
        })
        opts.always()
        return
      }

      const req = this.searchForm.urls.list

      if (req.urlFilter) {
        /* eslint-disable no-new-func */
        if (typeof req.urlFilter === 'string') {
          req.urlFilter = new Function('searchForm', req.urlFilter)
        }
        /* eslint-disable no-new-func */
        req.url = req.urlFilter(this.searchFormInfo)
      }

      // 返回成功的拦截器， 处理 useLocalSort, useLocalPagination
      // data 可能为 null
      const successInterceptor = ({ data, total, summary }) => {
        data = data || []
        if (this.dataTable.columnsFilter) {
          /* eslint-disable no-new-func */
          if (typeof this.dataTable.columnsFilter === 'string') {
            this.dataTable.columnsFilter = new Function('data', 'searchForm', this.dataTable.columnsFilter)
          }
          /* eslint-enable no-new-func */
          this.dataTable.columns = this.dataTable.columnsFilter(data, this.searchFormInfo)
        }
        if (data.length > 0) {
          this.dataTable.columns = this.dataTable.columns.filter(p => {
            if (!p.field) return true
            let filterData = data[0]
            const keys = p.field.split('.')
            let isUndefined = false
            keys.forEach(k => {
              if (typeof filterData[k] == 'undefined') {
                isUndefined = true
              } else {
                filterData = filterData[k]
              }
            })
            return !isUndefined
          })
        }
        if (!params.orderBy) {
          params.orderBy = (this.dataTable.columns.filter(p => p.sortable)[0] || {}).field
        }
        if (this.dataTable.useLocalSort || this.dataTable.useLocalPagination) {
          this.dataTable.allResult = {
            data,
            total,
            summary
          }
          if (this.dataTable.useLocalSort) {
            if (params.orderBy) {

              // data.sort(sortData)
              data = quicksort(data, sortFn)
            }
          }
          if (this.dataTable.useLocalPagination) {
            data = data.slice(params.start, params.start + parseInt(params.max))
          }
        }
        opts.success({ data, total, summary })
      }

      if (requestCancelObj.dataTableCancelFn) {
        requestCancelObj.dataTableCancelFn(`loadDataTableList() - url:${req.url}`)
        requestCancelObj.dataTableCancelFn = null
      }

      if (Expose.searchFlag) {
        this.dataTable.pagination.currentPage = 1
        if (params.hasOwnProperty('start')) {
          params.start = 0
        } else if (params.hasOwnProperty('pageNumber')) {
          params.pageNumber = 1
        }
      }

      this.request({
        url: req.url,
        method: req.method,
        params,
        cancelToken: new axios.CancelToken((c) => {

          // An executor function receives a cancel function as a parameter
          requestCancelObj.dataTableCancelFn = c
        })
      }, {
        always: () => {
          opts.always()
        },
        success: (res) => {
          Expose.searchFlag = false
          requestCancelObj.dataTableCancelFn = null
          if (this.searchForm.urls.list.filter) {
            /* eslint-disable no-new-func */
            if (typeof this.searchForm.urls.list.filter === 'string') {
              this.searchForm.urls.list.filter = new Function('res', 'params', 'url', 'route', this.searchForm.urls.list.filter)
            }
            /* eslint-enable no-new-func */
            const result = this.searchForm.urls.list.filter(res, params, req.url, this.$route)

            // 返回值不是对象，或者没有返回data属性
            if (!Helper.isPureObject(result) || !('data' in result)) {
              this.$msgbox({
                type: 'error',
                message: '数据列表接口返回值处理必须返回{data: []}的格式'
              })
              console.error('数据列表接口返回值处理必须返回{data: []}的格式', result, res)
              return
            }
            successInterceptor(result)
          } else {
            /* eslint-disable no-lonely-if */
            if (Array.isArray(res.value)) {
              successInterceptor({
                data: res.value,
                total: res.value.length
              })
            } else if (Helper.isPureObject(res.value)) {
              successInterceptor(res.value)
            } else {
              console.error('数据列表接口返回值没有找到默认处理方式且没有提供filter', res)
            }
            /* eslint-enable no-lonely-if */
          }
        },
        error: (e) => {
          console.error(e)
          opts.error()
        }
      })
    },

    // 加载 计数 数据
    loadDataTableTotalData() {

      // 请求列表总数数据
      if (this.searchForm.urls.total.url || this.searchForm.urls.total.urlFilter) {
        if (this.searchForm.urls.total.beforeFilter && typeof this.searchForm.urls.total.beforeFilter === 'string') {
          /* eslint-disable no-new-func */
          this.searchForm.urls.total.beforeFilter = new Function('params', this.searchForm.urls.total.beforeFilter)
          /* eslint-enable no-new-func */
        }
        const params = this.getDataTableParams(this.searchForm.urls.total.beforeFilter, '请求数据列表总数接口的处理查询条件有误，返回值必须是一个对象')

        if (params === null) return

        const req = this.searchForm.urls.total

        if (req.urlFilter) {
          /* eslint-disable no-new-func */
          if (typeof req.urlFilter === 'string') {
            req.urlFilter = new Function('searchForm', req.urlFilter)
          }
          /* eslint-enable no-new-func */
          req.url = req.urlFilter(this.searchFormInfo)
        }

        if (requestCancelObj.totalCancelFn) {
          requestCancelObj.totalCancelFn(`loadDataTableTotalData() - url:${req.url}`)
          requestCancelObj.totalCancelFn = null
        }
        this.request({
          url: req.url,
          method: req.method,
          params,
          cancelToken: new axios.CancelToken((c) => {

            // An executor function receives a cancel function as a parameter
            requestCancelObj.totalCancelFn = c
          })
        }, {
          success: (res) => {
            requestCancelObj.totalCancelFn = null
            if (this.searchForm.urls.total.filter) {
              /* eslint-disable no-new-func */
              if (typeof this.searchForm.urls.total.filter === 'string') {
                this.searchForm.urls.total.filter = new Function('res', 'params', 'url', this.searchForm.urls.total.filter)
              }
              /* eslint-enable no-new-func */
              const result = parseInt(this.searchForm.urls.total.filter(res, params, req.url), 10)
              if (isNaN(result)) {
                console.error('数据列表返回值处理有误，返回值应该是可转换为数字的内容', this.searchForm.urls.total.filter, res)
              } else {
                this.dataTable.total = result
              }
            } else {
              const result = parseInt(Helper.isPureObject(res) ? res.value : res, 10)
              if (isNaN(result)) {
                console.error('数据列表汇总返回值没有找到默认处理方式，请提供filter')
              } else {
                this.dataTable.total = result
              }
            }
          },
          error: () => {
            this.$message({
              type: 'error',
              message: '数据列表汇总接口出错'
            })
          }
        })
      }
    },

    // 加载 汇总 数据
    loadDataTableSummaryData() {

      // 请求列表汇总数据
      if (this.searchForm.urls.summary.url || this.searchForm.urls.summary.urlFilter) {
        if (this.searchForm.urls.summary.beforeFilter && typeof this.searchForm.urls.summary.beforeFilter === 'string') {
          /* eslint-disable no-new-func */
          this.searchForm.urls.summary.beforeFilter = new Function('params', this.searchForm.urls.summary.beforeFilter)
          /* eslint-enable no-new-func */
        }
        const params = this.getDataTableParams(this.searchForm.urls.summary.beforeFilter, '请求数据列表汇总接口的处理查询条件有误，返回值必须是一个对象')

        if (params === null) return

        const req = this.searchForm.urls.summary

        if (req.urlFilter) {
          /* eslint-disable no-new-func */
          if (typeof req.urlFilter === 'string') {
            req.urlFilter = new Function('searchForm', req.urlFilter)
          }
          /* eslint-enable no-new-func */
          req.url = req.urlFilter(this.searchFormInfo)
        }

        if (!req.url) return

        if (requestCancelObj.summaryCancelFn) {
          requestCancelObj.summaryCancelFn(`loadDataTableSummaryData() - url:${req.url}`)
          requestCancelObj.summaryCancelFn = null
        }
        this.request({
          url: req.url,
          method: req.method,
          params,
          cancelToken: new axios.CancelToken((c) => {

            // An executor function receives a cancel function as a parameter
            requestCancelObj.summaryCancelFn = c
          })
        }, {
          success: (res) => {
            requestCancelObj.summaryCancelFn = null
            if (this.searchForm.urls.summary.filter) {
              /* eslint-disable no-new-func */
              if (typeof this.searchForm.urls.summary.filter === 'string') {
                this.searchForm.urls.summary.filter = new Function('res', 'params', 'url', this.searchForm.urls.summary.filter)
              }
              /* eslint-enable no-new-func */
              const result = this.searchForm.urls.summary.filter(res, params, req.url)
              if (!Helper.isPureObject(result) && result !== null) {
                this.$msgbox({
                  type: 'error',
                  message: '数据汇总返回值处理有误，返回值该是object'
                })
                console.error('数据汇总返回值处理有误，返回值该是object', result, this.searchForm.urls.summary.filter, res)
              } else {
                this.dataTable.summary = result
                this.dataTable.data = this.getSummaryDataTableData()
              }
            } else {
              const result = res.value || {}
              if (!Helper.isPureObject(result)) {
                console.error('数据汇总返回值没有找到默认处理方式，请提供filter')
              } else {
                this.dataTable.summary = result
                this.dataTable.data = this.getSummaryDataTableData()
              }
            }
          },
          error: () => {
            this.$message({
              type: 'error',
              message: '数据列表汇总接口出错'
            })
          }
        })
      }
    },

    // 加载表格数据
    loadDataTableData({ isRefresh = true, needRemoteLoad = true } = {}) {

      // 请求列表数据
      console.log('------------------loadDataTableData', this.searchForm.urls);
      if (!this.searchForm.urls.list.url && !this.searchForm.urls.list.urlFilter) {
        this.$msgbox({
          type: 'error',
          message: '没有配置列表请求数据接口'
        })
      } else {
        this.dataTable.loading = true
        this.loadDataTableList({
          always: () => {
            this.dataTable.loading = false
          },
          success: ({ data, total, summary }) => {

            // 接口可能返回 data 为 null
            this.dataTable.data = data || []

            // 如果配置了计数接口，则此处不设置total
            if (!this.searchForm.urls.total.url) {
              this.dataTable.total = total
            }
            if (summary) this.dataTable.summary = summary
            if (this.dataTable.summary) this.dataTable.data = this.getSummaryDataTableData()
          },
          error: () => {
            this.$msgbox({
              type: 'error',
              message: '请求数据列表接口返回错误'
            })
          },
          needRemoteLoad
        })
        Bus.$emit('generator-action', 'search')
      }

      if (isRefresh) {
        this.loadDataTableTotalData()
        this.loadDataTableSummaryData()
      }
    },

    // 处理表格每页数量改变
    handleDataTableSizeChange(data) {
      if (!this.page.url) return // 页面重置，数据改动，不能加载数据
      this.dataTable.pagination.pageSize = data
      const field = this.dataTable.pagination.maps.size
      if (field.type === 'map') {
        this.updateSearchFormFieldValue(field.key, data)
        this.loadDataTableData({ isRefresh: false, needRemoteLoad: !this.dataTable.useLocalPagination })
      }
    },

    // 获取数据列表页码
    getDataTablePage(curr, size) {
      const field = this.dataTable.pagination.maps.page
      let page = curr - 1
      if (field.filter) {
        /* eslint-disable no-new-func */
        if (typeof field.filter === 'string') {
          field.filter = new Function('page', 'form', field.filter)
        }
        /* eslint-enable no-new-func */
        page = parseInt(field.filter({
          curr,
          size
        }, this.searchForm), 10)

        if (isNaN(page)) {
          console.error('翻页返回值处理有误，必须返回数字', field.filter)
        }
      } else {
        page = page * size
      }
      return page
    },

    // 处理页码变更
    handleDataTablePageChange(data) {
      this.dataTable.pagination.currentPage = data
      const field = this.dataTable.pagination.maps.page
      const page = this.getDataTablePage(data, this.dataTable.pagination.pageSize)
      this.updateSearchFormFieldValue(field.key, page)
      this.loadDataTableData({
        isRefresh: false,
        needRemoteLoad: !this.dataTable.useLocalPagination
      })
    },

    handleDialogClose(dialogName, dialog) {
      let $form = this.$refs[`form-${dialogName}`]
      if (Array.isArray($form)) $form = $form[0]

      if ($form) {
        $form.resetFields()
      }
      this.resetFields(dialog.fields)
    },

    // 弹框按钮回调处理
    handleDialogButtonClick(type, dialogName) {
      let $form = this.$refs[`form-${dialogName}`]
      if (Array.isArray($form)) $form = $form[0]
      const dialog = this.dialogs[dialogName]
      if (type === 'cancel') {
        dialog.show = false
      } else if (type === 'accept') {
        let isError = false,
          componentObj = {};
        dialog.fields.forEach(field => {
          if (field.type === 'other-component') {
            componentObj = this.$refs[`otherComponent${field.componentName}`]
            if (Array.isArray(componentObj)) componentObj = componentObj[0]
            if (componentObj.hasOwnProperty('syncValidateFn')) {
              isError = componentObj.syncValidateFn() || isError;
            }
          }
        });
        if (isError) return;
        $form.validate((valid) => {
          if (valid) {
            let params = this.dialogEntities[dialogName]
            let req = null
            if (dialog.urls.save && dialog.urls.save.url) {
              req = dialog.urls.save
            } else {
              req = dialog.urls[dialog.status]
            }

            if (req !== null) {
              if (req.beforeFilter) {
                /* eslint-disable no-new-func */
                if (typeof req.beforeFilter === 'string') {
                  req.beforeFilter = new Function('params', 'dialog', req.beforeFilter)
                }
                /* eslint-enable no-new-func */
                params = req.beforeFilter(params, dialog)
              }
              if (params && req.isSecondSure && (req.isSecondSure).toString() === '1') {
                this.$confirm(req.secondSureText + '？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.handleDialogRequest(dialog, req, params)
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              } else {
                this.handleDialogRequest(dialog, req, params)
              }

            } else {
              this.$msgbox({
                type: 'error',
                mssage: '找不到保存接口路径，请检查配置'
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: '请正确的填写信息'
            })
          }
        })
      }
    },
    handleDialogRequest(dialog, req, params) {
      dialog.loading = true
      this.request({
        ...req,
        params
      }, {
        always: () => {
          dialog.loading = false
        },
        success: (res) => {
          if (res.message.length >= 10) {
            this.$msgbox({
              type: 'success',
              message: res.message
            })
          } else {
            this.$message({
              type: 'success',
              message: res.message || req.successMessage || '保存成功'
            })
          }

          dialog.show = false
          Bus.$emit('generator-action', 'dialog', {
            status: dialog.status,
            name: dialog.name,
            params
          })

          // 防止history导致配置报错
          if (!dialog.cancelLoadDataTableData) {
            this.loadDataTableData()
          }
        },
        error: (res) => {
          this.$msgbox({
            type: 'error',
            message: res.message || req.errorMessage || '保存失败'
          })
        }
      })
    },

    // 处理报表导出
    handleExportReport() {
      const total = this.dataTable.total
      const exportFn = (result) => {
        let excelTitle = this.breadcrumb.map(p => Helper.textParse(p.title, this.$route.query)).join('-') +
          this.searchFormFields.filter(p => ['daterange', 'datetimerange'].indexOf(p.type) !== -1)
            .map(p => `(${p.value.join('~')})`).join('')
        ExportJS.toCSV({
          columns: this.dataTable.columns.filter(column => column.type !== 'index').map(column => ({
            title: column.title,
            key: column.field
          })),
          data: result.map(row => this.dataTable.columns.filter(column => column.type !== 'index').reduce((p, c) => {
            // eslint-disable-next-line no-useless-escape
            p[c.field] = `"${String(this.getColumnValue(c, row)).replace(/\"/g, '\'')}"`
            return p
          }, {})),
          fileName: `${excelTitle}.csv`
        })
      }
      if (total !== 0) {
        if (this.dataTable.useLocalPagination && this.dataTable.allResult) {
          exportFn([].concat(this.dataTable.allResult.data))
          return
        }
        const pageSize = 150 // btn.options.size || this.dataTable.pagination.pageSize || 20
        let pages = total / pageSize
        pages = parseInt(total % pageSize === 0 ? pages : pages + 1, 10)
        let result = []
        let currPage = 0
        const params = {}
        const pageKey = this.dataTable.pagination.maps.page.key
        params[this.dataTable.pagination.maps.size.key] = pageSize
        this.exports.text = '正在获取数据中...'

        const fn = () => {
          this.exports.percent = parseInt((currPage / pages) * 100, 10)
          if (currPage >= pages) {
            this.exports.text = '正在生成报表'
            this.exports.status = 'success'
            exportFn(result)
            this.exports.text = '生成报表成功'
            setTimeout(() => {
              this.exports.show = false
            }, 5000)
            return
          }

          params[pageKey] = this.getDataTablePage(currPage + 1, pageSize)
          this.loadDataTableList({
            params,
            success: ({ data }) => {
              if (data) {
                result = result.concat(data)
              }

              currPage += 1
              fn()
            },
            error: () => {
              this.exports.status = 'error'
              this.exports.text = '导出报表失败'
              setTimeout(() => {
                this.exports.show = false
              }, 5000)
              this.$message({
                type: 'error',
                message: '导出报表出错，请重试'
              })
            }
          })
        }

        this.exports.show = true
        fn()
      } else {
        this.$message({
          type: 'warning',
          message: '没有数据导出'
        })
      }
    },

    // 加载图表数据
    loadChartData({ isRefresh = true, needRemoteLoad = true }) {
      const params = this.getDataTableParams(this.searchForm.urls.chart.beforeFilter, '请求数据列表接口的处理查询条件有误，返回值必须是一个对象')

      // 存在当日环比，则加载多条数据
      if (this.isChartCompareDay) {
        let dateKeys = this.chart.compare.key.split(',')
        this.chart.compare.day.forEach(p => {
          const _params = Helper.assign({}, params)
          _params[dateKeys[1]] = _params[dateKeys[0]] =
            Helper.formatDate(Helper.getDate(p, new Date(_params[dateKeys[0]].replace(/-/g, '/'))))
          this.loadRemoteChartData({
            params: _params,
            isRefresh,
            needRemoteLoad,
            type: p
          })
        })
      } else {
        this.loadRemoteChartData({ params, isRefresh, needRemoteLoad })
      }
    },

    // 加载图表数据 - 精细处理
    loadRemoteChartData({ params = null, isRefresh = true, type }) {

      // 图表只是搜索条件变动时请求， 另外不存在图表x轴，则认为没有图表
      if (!isRefresh || !(this.chart && (this.searchForm.urls.chart.url || this.searchForm.urls.chart.urlFilter) && this.chart.xAxisKey && this.chart.xAxisKey.key)) {
        return;
      }

      // 请求图表数据
      if (!this.searchForm.urls.chart.url && !this.searchForm.urls.chart.urlFilter) {
        this.$msgbox({
          type: 'error',
          message: '没有配置图表请求数据接口'
        })
        return;
      }
      if (this.searchForm.urls.chart.beforeFilter && typeof this.searchForm.urls.chart.beforeFilter === 'string') {
        /* eslint-disable no-new-func */
        this.searchForm.urls.chart.beforeFilter = new Function('params', this.searchForm.urls.chart.beforeFilter)
        /* eslint-enable no-new-func */
      }

      if (params == null) return

      const req = this.searchForm.urls.chart

      if (req.urlFilter) {
        /* eslint-disable no-new-func */
        if (typeof req.urlFilter === 'string') {
          req.urlFilter = new Function('searchForm', req.urlFilter)
        }
        /* eslint-disable no-new-func */
        req.url = req.urlFilter(this.searchFormInfo)
      }

      const success = ({ data }) => {
        if (type) {
          if (Object.prototype.toString.call(this.chart.resultData) != '[object Object]') {
            this.chart.resultData = {}
          }
          this.chart.resultData[type] = data;
        } else {
          this.chart.resultData = data;
        }
        if (type == 'today' || !type) {
          this.renderChartLegend(type)
          this.chart.options.xAxis = Helper.assign({}, this.chart.options.xAxis, JSON.parse(this.chart.xAxisKey.options || '{}'))
        }
        this.renderChartView(type)
      }

      this.$refs.chart.showLoading()

      // if (requestCancelObj.chartCancelFn) {
      //   requestCancelObj.chartCancelFn(`loadChartData() - url:${req.url}`)
      //   requestCancelObj.chartCancelFn = null
      // }
      this.request({
        url: req.url,
        method: req.method,
        params,
        cancelToken: new axios.CancelToken(() => {

          // An executor function receives a cancel function as a parameter
          // requestCancelObj.chartCancelFn = c
        })
      }, {
        always: () => {
          this.$refs.chart && (this.$refs.chart.hideLoading())
        },
        success: (res) => {

          // requestCancelObj.chartCancelFn = null
          if (this.searchForm.urls.chart.filter) {
            /* eslint-disable no-new-func */
            if (typeof this.searchForm.urls.chart.filter === 'string') {
              this.searchForm.urls.chart.filter = new Function('res', 'params', 'url', this.searchForm.urls.chart.filter)
            }
            /* eslint-enable no-new-func */
            const result = this.searchForm.urls.chart.filter(res, params, req.url)

            // 返回值不是对象，或者没有返回data属性
            if (!Helper.isPureObject(result) || !('data' in result)) {
              this.$msgbox({
                type: 'error',
                message: '数据图表接口返回值处理必须返回{data: []}的格式'
              })
              console.error('数据图表接口返回值处理必须返回{data: []}的格式', result, res)
              return
            }
            const { data, total } = result
            success({
              data,
              total
            })
          } else {
            /* eslint-disable no-lonely-if */
            if (Array.isArray(res.value)) {
              this.dataTable.data = res.value
            } else if (Helper.isPureObject(res.value)) {
              const { data, total } = res.value
              success({
                data,
                total
              })
            } else {
              console.error('数据图表接口返回值没有找到默认处理方式且没有提供filter', res)
            }
            /* eslint-enable no-lonely-if */
          }
        },
        error: () => {
          this.$msgbox({
            type: 'error',
            message: '请求数据列表接口返回错误'
          })
        }
      })
    },

    // chart的legend改变时，触发重构图表series数据
    chartLengendSelectedChanged(data) {

      // console.log(selected, this.chart.options.legend.selected);
      this.renderChartHourSeries(data.selected)
    },

    // 环比日期改变时，触发重构图表series数据
    changeChartCompareDay(checked) {
      this.renderChartLegend(checked[0] || true, this.chart.options.legend.selected)
      this.renderChartHourSeries(this.chart.options.legend.selected)
    },

    // 加载图表的series数据
    renderChartView(type) {
      if (!type || type == 'today') {
        this.chart.options.xAxis.data = (this.chart.resultData[type] || this.chart.resultData).map(d => {
          let dataType = this.chart.xAxisKey.dataType
          let value = Helper.getValueByPath(d, this.chart.xAxisKey.key)
          switch (dataType) {
            case 'time':
            case 'date':
              value = value == null || isNaN(Number(value)) || (typeof value == 'number' && value < 1000 * 3600 * 24)
                ? value : Helper.formatData(value, dataType)
              break;
            default:
          }
          return value
        })
      }

      if (!type) {
        this.chart.options.series = this.chart.seriesKeys
          .filter(d => this.chart.options.legend.data.indexOf(d.name) != -1)
          .map((d, i) => ({
            type: d.type,
            name: d.name,
            smooth: true,
            itemStyle: {
              normal: {
                color: Config.colors[Math.floor(i / 3)][i % 3],
                lineStyle: {
                  color: Config.colors[Math.floor(i / 3)][i % 3]
                }
              }
            },
            data: this.chart.resultData.map(p => Helper.formatData(Helper.getValueByPath(p, d.key)), d.dataType)
          }))
      } else if (type && Object.keys(this.chart.resultData).length == this.chart.compare.day.length) {
        this.renderChartHourSeries(this.chart.options.legend.selected)
      }
    },

    // 渲染lengend的数据
    renderChartLegend(type, selected) {
      if (!type || this.chart.compare.day.length > 0) {

        // 获取legend对应的某日
        const day = Object.keys(Config.chartCompareDayMap)
          .filter(p => this.chart.compare.day.indexOf(p) != -1)[0]
        const prefix = !type || day == 'today' ? '' : `${Config.chartCompareDayMap[day]}`
        this.chart.options.legend.data = this.chart.seriesKeys.map(d => `${prefix}${d.name}`)
        this.chart.options.legend.selected = this.chart.seriesKeys.reduce((p, c) => {
          p[`${prefix}${c.name}`] = selected ? !!selected[`${this.chart.options.legend.selected.__prefix || ''}${c.name}`] : c.defaultShow
          return p
        }, {})
        this.chart.options.legend.selected.__prefix = prefix
      } else {
        this.chart.options.legend.data = []
      }
    },

    // 渲染小时环比的series
    // 以一个日期的legend控制并监听改变重新渲染
    renderChartHourSeries(selected) {
      if (!this.isChartCompareDay) return
      this.chart.options.series = [];
      const curDay = Object.keys(Config.chartCompareDayMap)
        .filter(p => this.chart.compare.day.indexOf(p) != -1)[0]
      const prefix = curDay == 'today' ? '' : `${Config.chartCompareDayMap[curDay]}`
      const seriesKeys = this.chart.seriesKeys.filter(d => this.chart.options.legend.data.indexOf(`${prefix}${d.name}`) != -1)
      seriesKeys.forEach((d, i) => {
        const curName = curDay == 'today' ? d.name : `${Config.chartCompareDayMap[curDay]}${d.name}`
        this.chart.compare.day.forEach((day, j) => {
          if (day != curDay && !selected[curName]) return // 未选中的不显示
          const data = this.chart.resultData[day]
          const name = day == 'today' ? d.name : `${Config.chartCompareDayMap[day]}${d.name}`
          const series = {
            type: d.type,
            name,
            smooth: true,
            data: (data || []).map(p => Helper.formatData(Helper.getValueByPath(p, d.key)), d.dataType)
          };
          if (i < Config.colors.length) {
            series['itemStyle'] = {
              normal: {
                color: Config.colors[i][j],
                lineStyle: {
                  color: Config.colors[i][j]
                }
              }
            };
          }
          this.chart.options.series.push(series)
        })
      })
      this.chart.options.legend.selected = selected
    },

    // 设置页面样式
    setCss(val) {
      if (this.styleTag === null) {
        this.styleTag = document.createElement('style')
        this.styleTag.type = 'text/css'
        document.querySelector('head').appendChild(this.styleTag)
      }

      if (this.styleTag.styleSheet) {   // 创建样式
        this.styleTag.styleSheet.cssText = val
      } else {
        while (this.styleTag.firstChild) {
          this.styleTag.removeChild(this.styleTag.firstChild)
        }
        this.styleTag.appendChild(document.createTextNode(val))
      }
    },

    // 加载页面配置
    loadPageConfig() {
      this.resetDefalutConfig()
      const setPageConfig = (pageConfig) => {
        Object.keys(pageConfig).forEach((prop) => {
          if (Config.setup[prop] == undefined) console.warn(prop, Object.keys(pageConfig));
          Helper.correct(Config.setup[prop], pageConfig[prop])
          this.$set(this.$data, prop, pageConfig[prop])   // 将每项挂在到vm实例
        })

        if (this.page.css) {
          this.setCss(this.page.css)
        }

        this.$nextTick(() => {

          // 处理 route 的参数，赋值到对应的 搜索域 中
          const names = Object.keys(this.$route.query)
          this.resetSearchFormFields()
          if (names.length) {
            names.forEach((name) => {
              this.updateSearchFormFieldValue(name, this.$route.query[name])
            })
          }

          // 设置特殊的 searchForm 对应 field 的值
          if (this.dataTable.supportSort) {
            this.updateSearchFormSortFieldValue(this.dataTable.defaultSort)
          }

          // 备份一份 dataTable 的 columns 原始数据
          let fieldTableColumnHidden = this.searchForm.fields.filter(d => d.type == 'table-column-hidden')
          this.dataTable.initColumns = [].concat(this.dataTable.columns)
          if (fieldTableColumnHidden.length > 0 && this.dataTable.columns) {
            this.fieldChangeDoSearch({ columnFields: fieldTableColumnHidden[0].value }, false)
          }
          if (this.searchForm.immediate) {
            if (this.permissionTree.length == 0) {
              const unwatch = this.$watch('permissionTree', () => {

                // 之后取消观察
                unwatch()
              })
            }

            // 调用 handleButtonClick 触发查询
            this.handleButtonClick('searchForm', { type: 'search' }, {})
          }
        })
      }

      this.pageLoading = true
      const loadLocalConfig = () => {
        if (requestCancelObj.configCancelFn) {
          // eslint-disable-next-line no-undef
          requestCancelObj.configCancelFn(`loadLocalConfig() - url:${req.url}`)
          requestCancelObj.configCancelFn = null
        }

        request({
          url: `${(Expose.configPrefix || '')}pages/${this.pageCode}.js?t=${Date.now()}`,
          baseURL: '',
          cancelToken: new axios.CancelToken((c) => {

            // An executor function receives a cancel function as a parameter
            requestCancelObj.configCancelFn = c
          })
        }).then((res) => {
          this.pageLoading = false
          requestCancelObj.configCancelFn = null
          if (res) {
            console.log('res', res)
            this.before_setPageConfig(res, setPageConfig)
          }
        }).catch((e) => {
          console.log(e);
        })
      }
      if (this.$route.params.code || this.code) {
        this.pageCode = this.$route.params.code || this.code
        loadLocalConfig()
      }
    },

    updateSearchFormSortFieldValue({ prop, order }) {
      this.updateSearchFormFieldValue('orderBy', prop)
      this.updateSearchFormFieldValue('sortType', order == 'ascending' ? 'asc' : 'desc')
    },

    fieldChangeDoSearch(options, load = true) {

      // 如何initColumns为undefined，说明dataTable的数据还为准备好(使用了nextTick的原因)
      if (typeof this.dataTable.initColumns == 'undefined') return
      this.dataTable.columns = (this.dataTable.initColumns || []).filter(d => {
        return !d.canHidden || (d.canHidden && options && options.columnFields && options.columnFields.indexOf(d.field) != -1)
      })
      if (load && !this.dataTable.loading) { // 需要重新加载，并且datatable未正在加载，避免重复请求
        this.handleButtonClick('searchForm', { type: 'search' }, { needRemoteLoad: true })
      }
    },

    before_setPageConfig(pageConfig, fn) {
      if (pageConfig.page.before_setPageConfig) {
        Promise.all(pageConfig.page.before_setPageConfig.map(config => {
          return new Promise((resolve) => {
            request({
              url: config.url
            }).then((res) => {

              config.dataResolver.forEach(d => {
                // eslint-disable-next-line no-new-func
                let filter = new Function('res', d.filter)
                this[d.field] = filter(res)
              })
              resolve()
            }).catch(() => {
              resolve()
            })
          })
        })).then(() => {

          fn(pageConfig)
        })
      } else {
        fn(pageConfig)
      }
    }
  },

  mounted() {
    console.log('-------mounted------');
    this.loadPageConfig()
  },

  beforeDestroy() {
    if (this.styleTag) {
      document.querySelector('head').removeChild(this.styleTag)
    }
  }
}
