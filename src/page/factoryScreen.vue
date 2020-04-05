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

      <el-tab-pane
        label="搜索表单"
        name="searchForm">
        <h3>基本配置</h3>
        <el-form
          :model="searchForm"
          :rules="searchFormRules"
          label-width="160px">
          <el-form-item
            label="搜索表单标题"
            prop="title">
            <el-input v-model="searchForm.title"/>
          </el-form-item>
          <el-form-item label="表单标签宽度">
            <el-input v-model="searchForm.labelWidth"/>
          </el-form-item>
          <el-form-item
            label="页面是否立即加载列表"
            prop="url">
            <el-switch
              v-model="searchForm.immediate"
              active-text="是"
              inactive-text="否"/>
          </el-form-item>
        </el-form>
        <hr>
        <h3>请求接口</h3>
        <el-table :data="searchFormUrls">
          <el-table-column
            label="类型"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type | searchFormUrlTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否已配置"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.config ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="路径"
            prop="url"/>
          <el-table-column
            label="方式"
            align="center"
            prop="method"/>
          <el-table-column
            label="参数值"
            align="center"
            prop="params"/>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleClearUrlConfig('searchForm', scope.row)">
                清空
              </el-button>
              <el-button
                type="text"
                @click="handleSearchFormUrlConfig(scope.row)">
                {{ scope.row.config ? '编辑' : '配置' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <hr>
        <h3>
          表单配置
          <el-button
            size="small"
            type="success"
            icon="el-icon-plus"
            @click="handleSearchFormFieldAdd"/>
        </h3>
        <el-table :data="searchForm.fields">
          <el-table-column
            label="标题"
            prop="title"/>
          <el-table-column
            label="key值"
            prop="key">
            <template slot-scope="scope">
              {{ scope.row.key | fieldFormatArrayFilter }}
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            prop="type">
            <template slot-scope="scope">
              {{ scope.row.type | fieldTypeFilter }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i
                :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                @click="handleTableRowUp('searchForm-fields', scope.$index)"/>
              <i
                :class="['el-icon-arrow-down', scope.$index == searchForm.fields.length - 1 ? 'disabled' : '']"
                @click="handleTableRowDown('searchForm-fields', scope.$index)"/>
              <el-button
                type="text"
                @click="handleSearchFormFieldEdit(scope.row, scope.$index)">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="handleSearchFormFieldDelete(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <hr>
        <h3>
          按钮配置
          <el-button
            size="small"
            type="success"
            icon="el-icon-plus"
            @click="handleSearchFormButtonAdd"/>
        </h3>
        <el-table :data="searchForm.buttons">
          <el-table-column
            label="按钮文本"
            prop="text"/>
          <el-table-column label="按钮样式">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.klass"
                size="small">
                {{ scope.row.text }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="按钮类型">
            <template slot-scope="scope">
              {{ scope.row.type | buttonTypeFilter }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i
                :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                @click="handleTableRowUp('searchForm-buttons', scope.$index)"/>
              <i
                :class="['el-icon-arrow-down', scope.$index == searchForm.buttons.length - 1 ? 'disabled' : '']"
                @click="handleTableRowDown('searchForm-buttons', scope.$index)"/>
              <el-button
                type="text"
                @click="handleSearchFormButtonEdit(scope.row, scope.$index)">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="handleSearchFormButtonDelete(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
      :visible.sync="urlDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="URL配置"
      class="dialog-url"
      @close="handleUrlDialogClose">
      <el-form label-width="130px">
        <el-form-item
          label="接口路径"
          prop="url">
          <el-input
            v-model="urlEntity.url"
            placeholder="接口请求路径"/>
        </el-form-item>
        <el-form-item label="接口请求方式">
          <el-select
            v-model="urlEntity.method"
            placeholder="选择请求方式">
            <el-option
              v-for="method in requestMethods"
              :key="method"
              :value="method"
              :label="method"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="urlDialog.supportParams"
          label="参数值">
          <p
            v-html="
              urlDialog.supportDynamicParams ? `
                简便参数提交支持三种类型，<code>{&quot;type&quot;: 1}</code>或者<code>[{&quot;name&quot;: &quot;poster_id&quot;, &quot;raw&quot;: &quot;1&quot;}]</code>固定参数，<code>[&quot;id&quot;, &quot;type&quot;]</code>附加当前环境的动态参数，<code>[{&quot;name&quot;: &quot;poster_id&quot;, &quot;value&quot;: &quot;id&quot;}]</code>需要起别名的动态参数。<br>
                <code>name</code>是你需要替换后的名称，<code>value</code>是你当前执行环境的值的名称
              ` : `
                该url不支持动态参数，只能输入 <code>{ &quot;type&quot;: 1 }</code> 这样可以被转换的固定参数值
            `
            "/>
          <p
            v-if="urlDialog.paramsMessage.length > 0"
            v-html="urlDialog.paramsMessage"/>
          <el-input
            v-model="urlEntity.params"
            type="textarea"/>
        </el-form-item>
        <el-form-item
          v-if="urlDialog.supportBeforeFilter"
          label="请求前参数过滤器">
          <p v-html="urlDialog.beforeFilterMessage"/>
          <code-editor v-model="urlEntity.beforeFilter"/>
        </el-form-item>
        <el-form-item
          v-if="urlDialog.supportFilter"
          label="请求返回值过滤器">
          <p v-html="urlDialog.filterMessage"/>
          <code-editor v-model="urlEntity.filter"/>
        </el-form-item>
        <el-form-item
          v-if="urlDialog.supportUrlFilter"
          label="动态url过滤器">
          <p>
            某些情况下，需要根据<code>searchForm</code>的值来动态决定请求的url路径<br>
            如果设置了动态url过滤器，则接口路径则不会生效，统一使用过滤器返回，请确保过滤器有url路径返回。
          </p>
          <code-editor v-model="urlEntity.urlFilter"/>
        </el-form-item>
        <el-form-item
          v-if="urlDialog.supportMessages"
          label="消息设置">
          <p>成功时提示文案（不需要请留空）：</p>
          <el-input
            v-model="urlEntity.successMessage"
            type="text"/>
          <p>失败时提示文案（留空会显示默认报错信息）：</p>
          <el-input
            v-model="urlEntity.errorMessage"
            type="text"/>
        </el-form-item>
        <el-form-item label="是否要二次弹框">
          <el-radio-group v-model="urlEntity.isSecondSure">
            <el-radio
              v-model="urlEntity.isSecondSure"
              label="1">是</el-radio>
            <el-radio
              v-model="urlEntity.isSecondSure"
              label="2">否</el-radio>
          </el-radio-group>
          <div v-if="urlEntity.isSecondSure == 1">
            <p>二次确认文案：</p>
            <el-input
              v-model="urlEntity.secondSureText"
              type="text"/>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="defualt"
          @click="handleUrlDialogClose">
          关闭
        </el-button>
        <el-button
          type="primary"
          @click="handleUrlDialogSave">
          保存
        </el-button>
      </div>
    </el-dialog>

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
