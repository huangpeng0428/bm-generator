/*
 * @Date: 2020-03-30 17:09:40
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-03-31 17:38:20
 */
import Config from '../../lib/config';
import Helper from '../../lib/helper';
import CodeEditor from '../../components/CodeEditor'
import router from '../../router'

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

export default {
  name: 'FactoryScreen',
  components: {
    CodeEditor
  },
  data() {
    return {
      loading: false,

      activeTab: 'page',

      id: 0,

      pageCode: '',

      disabledPageCode: false,

      // 页面配置项目按的验证配置
      pageRules: {
        title: [{ required: true, message: '请输入页面标题', trigger: 'blur' }],
        url: [{ required: true, message: '请输入页面url', trigger: 'blur' }]
      },

      // 页面配置选项
      page: Helper.assign({}, Config.setup.page),

      navDialog: Helper.assign({}, defaultNavDialog),
      navEntity: Helper.assign({}, defaultNavEntity)
    };
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
     * @description: page dialog function navDialog.visible
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
     * @description: handleSave
     * @param {type}
     * @return:
     * @author: PoloHuang
     */
    handleSave() {
      const pageConfig = JSON.stringify({
        page: this.page
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
      })
        .then(res => {
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
