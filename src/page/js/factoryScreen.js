/*
 * @Date: 2020-03-30 17:09:40
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-04-01 10:17:52
 */
import Config from '../../lib/config';
import Helper from '../../lib/helper';
import CodeEditor from '../../components/CodeEditor'
import router from '../../router'

// 页面导航配置
const defaultNavDialog = {
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

export default {
  name: 'FactoryScreen',

  components: {
    CodeEditor
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
    }
  },

  data() {
    return {
      loading: false,

      activeTab: 'page',

      id: 0,

      pageCode: '',

      disabledPageCode: false,

      requestMethods: ['GET', 'POST', 'DELETE', 'HEAD', 'PUT', 'PATCH'],

      // 页面配置项目按的验证配置
      pageRules: {
        title: [{ required: true, message: '请输入页面标题', trigger: 'blur' }],
        url: [{ required: true, message: '请输入页面url', trigger: 'blur' }]
      },

      // 搜索表单配置选项的验证配置
      searchFormRules: {
        title: [
          { required: true, message: '请输入页面标题', trigger: 'blur' }
        ]
      },

      // 页面配置选项
      page: Helper.assign({}, Config.setup.page),

      navDialog: Helper.assign({}, defaultNavDialog),
      navEntity: Helper.assign({}, defaultNavEntity),

      // 搜索表单配置选项
      searchForm: Helper.assign({}, Config.setup.searchForm),

      urlDialog: Helper.assign({}, defaultUrlDialog),
      urlEntity: Helper.assign({}, defaultUrlEntity)

    };
  },

  computed: {
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
    }
  },
  methods: {
    renderNavOperationColumn(h) {
      return (
        <div>
          <span>操作</span>
          <el-button
            style="margin-left: 12px;"
            type="success"
            size="small"
            icon="el-icon-plus"
            onClick={this.handleNavAdd}
          ></el-button>
        </div>
      );
    },

    /**
     * @description: page配置 && page顶部导航弹窗方法 navDialog.visible
     * @param {type}
     * @return:
     * @author: PoloHuang
     */

    handleNavAdd() {
      this.handleNavDialogOpen(null, navInfo => {
        this.page.navs.push(navInfo);
      });
    },

    handleNavDialogOpen(navEntity, save) {
      if (navEntity !== null) {
        this.navEntity = Helper.assign({}, defaultNavEntity, navEntity);
      }
      this.navDialog.save = save;
      this.navDialog.visible = true;
    },

    handleNavDialogClose() {
      this.navDialog.visible = false;
    },

    handleNavDialogSave() {
      const navInfo = Helper.assign({}, this.navEntity);
      this.navDialog.save(navInfo);
      this.handleNavDialogClose();
    },

    handleNavEdit(row, index) {
      this.handleNavDialogOpen(row, navInfo => {
        this.$set(this.page.navs, index, navInfo);
      });
    },

    handleNavDelete(index) {
      this.page.navs.splice(index, 1);
    },

    /**
     * @description: searchForm配置 && 请求接口配置操作弹窗方法 navDialog.visible
     * @param {type}
     * @return:
     * @author: PoloHuang
     */

    handleSearchFormUrlConfig(row, type = 'searchForm') {
      console.log(row)
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
      console.log(urlEntity)

      if (typeof urlEntity.params == 'object') {
        urlEntity.params = JSON.stringify(urlEntity.params)
      }
      this.urlEntity = urlEntity

      this.urlDialog.save = (urlInfo) => {
        if (type == 'searchForm') {
          this.searchForm.urls[row.type] = urlInfo
        } else if (type == 'dataTableSort') {

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

    handleClearUrlConfig(origin, urlInfo) {
      if (origin === 'searchForm') {
        this.$confirm('是否清空该url配置', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.searchForm.urls[urlInfo.type] = {}
        }).catch(() => {})
      }
    },

    handleSearchFormFieldAdd() {

    },

    handleSearchFormButtonAdd() {

    },

    /**
     * @description: handleSave
     * @param {type}
     * @return:
     * @author: PoloHuang
     */
    handleSave() {
      const pageConfig = JSON.stringify({
        page: this.page,
        searchForm: this.searchForm
      });
      const params = {
        type: Config.metaTypes.page,
        code: this.pageCode,
        value: pageConfig
      };
      let url = '/meta/save';
      if (this.id !== 0) {
        url = '/console/page/meta/update';
        params.id = this.id;
      }
      this.loading = true;
      this.$http({
        url,

        // baseURL: 'http://admanage.meizu.com',
        method: 'post',
        data: params
      }).then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '保存页面配置成功'
            });

            if (this.id === 0) {
              router.push(
                {
                  name: 'factory',
                  params: {
                    code: this.pageCode
                  }
                },
                () => {
                  this.loadData(this.pageCode);
                }
              );
            } else {
              this.$msgbox({
                type: 'error',
                message: res.message || '保存页面配置失败'
              });
            }
          }
        })
        .catch(e => {
          console.log(e);
          this.$msgbox({
            type: 'error',
            message: '请求保存页面配置接口失败'
          });
        });
    },

  /**
   * @description: init loadData
   * @param {type}
   * @return:
   * @author: PoloHuang
   */

    loadData(pageCode, isCopy = false) {
      if (!isCopy) {
        this.pageCode = pageCode
        this.disabledPageCode = true
      }

      const setPageConfig = (pageConfig) => {
        console.log(pageConfig);
        Object.keys(pageConfig).forEach(prop => {
          this.$set(this.$data, prop, pageConfig[prop]);
        })
      }

      const loadLocalConfig = () => {
        this.loading = true
        this.$http({
          url: '/meta/info',
          params: {
            code: pageCode
          }
        }).then(res => {
          this.loading = false
          const pageConfig = res.value
          if (pageConfig) {
            setPageConfig(JSON.parse(pageConfig));
          }
        })
      }

      loadLocalConfig()

    }

  },

  mounted() {
    if (this.$route.params.code) {
      this.loadData(this.$route.params.code);
    } else if (this.$route.query.from) {
      this.loadData(this.$route.query.from, true);
    }
  }
};
