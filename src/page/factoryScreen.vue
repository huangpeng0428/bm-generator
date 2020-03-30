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
            <!-- <code-editor
              v-model="page.css"
              mode="css"/> -->
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
  .header{
    color: red;
  }
}
</style>
