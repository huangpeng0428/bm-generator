<template>
  <div
    v-loading="loading"
    class="factory-wrapper">
    <el-tabs
      v-model="activeTab"
      type="border-card">
      <el-tab-pane
        label="页面配置"
        name="page">
        <el-form
          :model="page"
          :rules="pageRules"
          label-width="120px">
          <el-form-item
            label="页面标题"
            prop="title">
            <el-input v-model="page.title"/>
          </el-form-item>
          <el-form-item
            label="页面路径"
            prop="url">
            <el-input v-model="page.url"/>
          </el-form-item>
          <el-form-item
            label="页面自定义样式"
            prop="css">
            <code-editor
              v-model="page.css"
              mode="css"/>
          </el-form-item>
          <el-form-item label="顶部导航">
            <el-table :data="page.navs">
              <el-table-column
                label="文本"
                prop="text"/>
              <el-table-column label="选中状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.active ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="路径"
                prop="path"/>
              <el-table-column :render-header="renderNavOperationColumn">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleNavEdit(scope.row, scope.$index)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleNavDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <footer class="factory-footer">
      <el-form :inline="true">
        <el-form-item label="页面代号">
          <el-input
            v-model="pageCode"
            :disabled="disabledPageCode"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="handleSave">
            保存配置
          </el-button>
          <a
            v-if="disabledPageCode"
            :href="'#/generator/' + pageCode"
            class="el-button el-button--info"
            target="_blank">
            预览
          </a>
          <router-link
            :to="{name: 'generator', params: {code: 'factories'}}"
            class="el-button el-button--warning">
            返回列表
          </router-link>
        </el-form-item>
      </el-form>
    </footer>

    <el-dialog
      :visible.sync="navDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="导航配置"
      class="dialog-nav"
      @close="handleNavDialogClose">
      <el-form label-width="130px">
        <el-form-item label="文本">
          <el-input
            v-model="navEntity.text"
            type="text"/>
        </el-form-item>
        <el-form-item label="是否处于选中状态">
          <el-switch
            v-model="navEntity.active"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <el-form-item label="路径">
          <el-input
            v-model="navEntity.path"
            type="text"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="default"
          @click="handleNavDialogClose">关闭</el-button>
        <el-button
          type="primary"
          @click="handleNavDialogSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import factoryScreen from './js/factoryScreen'

export default factoryScreen
</script>
<style lang="scss">
.factory-wrapper{
  width: 100%;
  padding-bottom: 60px;
  .factory-footer{
    margin-top: 22px;
    text-align: right;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 10px 20px;
    z-index: 90;
  }
}
</style>
