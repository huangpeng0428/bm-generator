import Config from '../../lib/config';
import Helper from '../../lib/helper';
export default {
  name: 'FactoryScreen',
  data() {
    return {
      loading: false,
      activeTab: 'page',

      // 页面配置项目按的验证配置
      pageRules: {
        title: [{ required: true, message: '请输入页面标题', trigger: 'blur' }],
        url: [{ required: true, message: '请输入页面url', trigger: 'blur' }]
      },

      // 页面配置选项
      page: Helper.assign({}, Config.setup.page)
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

            // onClick={this.handleNavAdd}
          ></el-button>
        </div>
      );
    },

    handleNavEdit(row, index) {

    //   this.handleNavDialogOpen(row, navInfo => {
    //     this.$set(this.page.navs, index, navInfo);
    //   });
    },

    handleNavDelete(index) {

    //   this.page.navs.splice(index, 1);
    }
  }
};
