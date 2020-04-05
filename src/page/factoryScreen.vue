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

    <el-dialog
      :visible.sync="fieldDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="表单控件配置"
      class="dialog-field"
      @close="handleFieldDialogClose">
      <el-form label-width="130px">
        <!--all-->
        <el-form-item label="控件类型">
          <el-select v-model="fieldEntity.type">
            <el-option
              v-for="type in fieldTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"/>
          </el-select>
        </el-form-item>
        <!--all-->
        <el-form-item label="标题">
          <el-input
            v-model="fieldEntity.title"
            type="text"/>
        </el-form-item>
        <!--all-->
        <el-form-item label="key值">
          <template v-if="fieldEntity.type == 'daterange' || fieldEntity.type == 'datetimerange'">
            <p>开始时间key值</p>
            <el-input
              v-model="fieldEntity.key[0]"
              type="text"/>
            <p>结束时间key值</p>
            <el-input
              v-model="fieldEntity.key[1]"
              type="text"/>
          </template>
          <el-input
            v-else
            v-model="fieldEntity.key"
            type="text"/>
        </el-form-item>
        <el-form-item
          v-if="['other-component'].indexOf(fieldEntity.type) != -1"
          label="组件名">
          <el-input
            v-model="fieldEntity.componentName"
            type="text"/>
        </el-form-item>
        <!--all-->
        <el-form-item
          v-if="['other-component'].indexOf(fieldEntity.type) == -1"
          label="提示文本">
          <el-input
            v-model="fieldEntity.placeholder"
            type="text"/>
        </el-form-item>
        <el-form-item
          v-if="['other-component'].indexOf(fieldEntity.type) == -1"
          label="默认值">
          <el-input
            v-if="['text', 'textarea', 'hidden'].indexOf(fieldEntity.type) != -1"
            :type="fieldEntity.type == 'hidden' ? 'text' : fieldEntity.type"
            v-model="fieldEntity.defaultValue"/>
          <el-select
            v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync"
            v-model="fieldEntity.defaultValue">
            <el-option
              v-for="item in fieldEntity.options.data"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
          <span v-if="fieldEntity.type == 'dropdown' && fieldEntity.isAsync">
            异步下拉列表暂不支持设置默认值
          </span>
          <span v-if="fieldOnlySupportAsync.indexOf(fieldEntity.type) != -1 || fieldUnsupportDefaultValue.indexOf(fieldEntity.type) != -1">
            <code>{{ config.fieldTypes[fieldEntity.type] }}</code>暂不支持设置默认值
          </span>
          <el-select
            v-if="fieldEntity.type == 'date'"
            v-model="fieldEntity.defaultValue">
            <el-option
              v-for="item in dateDefaultValues"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select
            v-if="fieldEntity.type == 'daterange'"
            v-model="fieldEntity.defaultValue">
            <el-option
              v-for="item in daterangeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-switch
            v-if="fieldEntity.type == 'switch'"
            v-model="fieldEntity.defaultValue"
            :width="102"
            active-text="默认选中"
            inactive-text="默认不选中"/>
          <el-form-item
            v-if="fieldEntity.type == 'table-column-hidden'"
            label="最多选择数量:"
            label-width="100px">
            <el-input-number
              v-model="fieldEntity.options.limit"
              :min="0"/>
          </el-form-item>
          <el-checkbox-group
            v-if="fieldEntity.type == 'table-column-hidden'"
            v-model="fieldEntity.defaultValue">
            <el-form-item
              v-for="(value, key) in fieldTableColumnHiddenGroupData"
              :label="key + ':'"
              :key="key"
              label-width="100px">
              <el-checkbox
                v-for="column in value"
                :disabled="fieldEntity.defaultValue.length >= fieldEntity.options.limit && fieldEntity.defaultValue.indexOf(column.field) == -1"
                :label="column.field"
                :key="column.field">
                {{ column.title }}
              </el-checkbox>
            </el-form-item>
          </el-checkbox-group>
        </el-form-item>
        <!--all-->
        <el-form-item
          v-if="['other-component'].indexOf(fieldEntity.type) == -1"
          label="数据类型">
          <el-select v-model="fieldEntity.dataType">
            <el-option
              v-for="item in dataTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!--all-->
        <el-form-item label="验证配置">
          <el-table :data="fieldEntity.rules">
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span>{{ config.ruleTypes[scope.row.type] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="提示信息"
              prop="message"/>
            <el-table-column :render-header="renderFieldRulesOperationColumn">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleFieldRuleEdit(scope.row, scope.$index)">
                  编辑
                </el-button>
                <el-button
                  type="text"
                  @click="handleFieldRuleDelete(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!--级联菜单、搜索输入、输入建议-->
        <el-form-item
          v-if="['cascader', 'search-input', 'autocomplete'].indexOf(fieldEntity.type) != -1"
          label="同步修改">
          <p>当本控件值发生改变时，同步修改引用的控件的值，多用于<code>级联菜单、搜索输入、输入建议</code>控件</p>
          <el-input v-model="fieldEntity.options.ref"/>
        </el-form-item>
        <!--输入建议-->
        <el-form-item
          v-if="fieldEntity.type == 'autocomplete'"
          label="同步修改属性">
          <p>同步修改的属性，多用于<code>输入建议</code>控件</p>
          <el-input v-model="fieldEntity.options.refProp"/>
        </el-form-item>
        <!--搜索输入、输入建议-->
        <el-form-item
          v-if="fieldEntity.type == 'search-input' || fieldEntity.type == 'autocomplete'"
          label="查询参数名">
          <el-input v-model="fieldEntity.options.param"/>
        </el-form-item>
        <!--级联菜单-->
        <el-form-item
          v-if="fieldEntity.type == 'cascader'"
          label="是否显示全部路径">
          <el-switch
            v-model="fieldEntity.options.showFullPath"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <!--级联菜单-->
        <el-form-item
          v-if="fieldEntity.type == 'cascader'"
          label="是否允许选择任意路径">
          <el-switch
            v-model="fieldEntity.options.selectAnyLevel"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <!--all-->
        <el-form-item
          v-if="fieldSupportAsync.indexOf(fieldEntity.type) != -1"
          label="是否是异步">
          <el-switch
            v-model="fieldEntity.isAsync"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <!--下拉菜单-->
        <el-form-item
          v-if="fieldEntity.type == 'dropdown'"
          label="是否调转">
          <p>调转的意思是指，传入的值是下拉菜单的显示值，而非选中值。</p>
          <el-switch
            v-model="fieldEntity.options.reverse"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <el-form-item
          v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync"
          label="值改变触发搜索">
          <el-switch
            v-model="fieldEntity.options.immediate"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <el-form-item
          v-if="fieldEntity.type == 'search-input' && fieldEntity.isAsync"
          label="是否本地搜索">
          <el-switch
            v-model="fieldEntity.options.remote"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <el-form-item
          v-if="fieldSupportAsync.indexOf(fieldEntity.type) != -1"
          label="控件数据">
          <template v-if="fieldEntity.isAsync">
            <el-button
              type="info"
              size="small"
              @click="handleFieldAsyncConfigOpen">
              配置数据请求
            </el-button>
            <el-table
              key="dropdownAsyncConfigTable"
              :data="[fieldEntity.options]"
              class="table-field-async-config">
              <el-table-column label="接口路径">
                <template slot-scope="scope">
                  <span :class="[scope.row.url ? '' : 'red']">
                    {{ scope.row.url ? scope.row.url : '未设置' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="请求方式"
                prop="method"
                align="center"
                width="120px"/>
              <el-table-column
                label="过滤器"
                align="center"
                width="120px">
                <template
                  slot-scope="scope"
                  align="center">
                  <span :class="[scope.row.filter ? '' : 'red']">
                    {{ scope.row.filter ? '已设置' : '未设置' }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-table
            v-if="fieldSupportStaticData.indexOf(fieldEntity.type) != -1 && !fieldEntity.isAsync"
            key="fieldStaticDataTable"
            :data="fieldEntity.options.data">
            <el-table-column
              label="显示值"
              prop="name"
              align="center"/>
            <el-table-column
              label="选中值"
              prop="value"
              align="center"/>
            <el-table-column
              v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync && fieldEntity.options.immediate"
              label="显示列"
              prop="columnFields"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.columnFields | columnFieldToTitleFilter(dataTable.columns) | fieldFormatArrayFilter }}
              </template>
            </el-table-column>
            <el-table-column
              :render-header="renderFieldStaticDataOperationColumn"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleFieldStaticDataEdit(scope.row, scope.$index, fieldEntity)">
                  编辑
                </el-button>
                <el-button
                  v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync && fieldEntity.options.immediate"
                  type="text"
                  @click="handleFieldDataTableColumnShowEdit(scope.row, scope.$index, fieldEntity)">
                  配置列
                </el-button>
                <el-button
                  type="text"
                  @click="handleFieldStaticDataDelete(scope.$index, scope.row, fieldEntity)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <span v-if="fieldOnlySupportAsync.indexOf(fieldEntity.type) != -1 && !fieldEntity.isAsync">
            {{config.fieldTypes[fieldEntity.type]}}暂时只能支持异步数据
          </span> -->
        </el-form-item>
        <el-form-item
          v-if="fieldEntity.type == 'dropdown'"
          label="是否包含全部">
          <el-switch
            v-model="fieldEntity.options.hasAll"
            active-text="是"
            inactive-text="否"/>
        </el-form-item>
        <el-form-item
          v-if="fieldEntity.type == 'cascader' && !fieldEntity.isAsync"
          label="配置数据">
          <p>
            json对象<code>{}</code>
          </p>
          <code-editor
            v-model="fieldEntity.options.data"/>
        </el-form-item>
        <!--文本框-->
        <el-form-item
          v-if="fieldEntity.type == 'text'"
          label="blur回调">
          <code-editor v-model="fieldEntity.options.blur"/>
        </el-form-item>
        <!--日期-->
        <el-form-item
          v-if="fieldEntity.type == 'date'"
          label="日期类型">
          <el-select v-model="fieldEntity.options.type">
            <el-option
              v-for="item in dateTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!--日期、日期时间、日期时间区间、日期区间-->
        <el-form-item
          v-if="['date', 'datetime', 'datetimerange', 'daterange'].indexOf(fieldEntity.type) != -1"
          label="数据格式化">
          <p>年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss</p>
          <el-input
            v-model="fieldEntity.options.format"/>
        </el-form-item>
        <!--日期-->
        <el-form-item
          v-if="['daterange', 'date', 'datetimerange'].indexOf(fieldEntity.type) != -1"
          label="禁用时间">
          <el-select v-model="fieldEntity.options.disabledDate">
            <el-option
              v-for="item in dateDisabledDateTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <template v-if="fieldEntity.options.disabledDate == 'custom'">
            <p>会传入<code>time</code>作为参数（Date类型），必须返回一个<code>Boolean</code>，以确认是否禁用该日期</p>
            <code-editor v-model="fieldEntity.options.disabledDateFilter"/>
          </template>
        </el-form-item>
        <!--日期区间、日期时间区间-->
        <el-form-item
          v-if="fieldEntity.type == 'daterange' || fieldEntity.type == 'datetimerange'"
          label="快捷选择">
          <el-checkbox-group v-model="fieldEntity.options.shortcuts">
            <el-checkbox
              v-for="item in daterangeShortcuts"
              :key="item.value"
              :label="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
          <p>如果最近几天不能包含今天，请勾选下面的选项</p>
          <el-checkbox
            v-model="fieldEntity.options.notIncludeToday">
            不包含今天
          </el-checkbox>
        </el-form-item>
        <!--开关-->
        <el-form-item
          v-if="fieldEntity.type == 'switch'"
          label="数据值">
          <el-row>
            <el-col
              :span="5"
              class="form-label">选中显示值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.on.text"/>
            </el-col>
            <el-col
              :span="5"
              class="form-label">选中值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.on.value"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="5"
              class="form-label">未选中显示值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.off.text"/>
            </el-col>
            <el-col
              :span="5"
              class="form-label">未选中值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.off.value"/>
            </el-col>
          </el-row>
        </el-form-item>
        <!--级联菜单-->
        <el-form-item
          v-if="fieldEntity.type == 'cascader'"
          label="异步选择项">
          <el-button
            type="info"
            size="small"
            @click="handleCascaderItemAsyncConfigOpen">
            配置选项选择的数据请求
          </el-button>
          <el-table
            key="dropdownAsyncConfigTable"
            :data="[fieldEntity.options.item]"
            class="table-field-async-config">
            <el-table-column label="接口路径">
              <template slot-scope="scope">
                <span :class="[scope.row.url ? '' : 'red']">
                  {{ scope.row.url ? scope.row.url : '未设置' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="请求方式"
              prop="method"
              align="center"
              width="120px"/>
            <el-table-column
              label="过滤器"
              align="center"
              width="120px">
              <template
                slot-scope="scope"
                align="center">
                <span :class="[scope.row.filter ? '' : 'red']">
                  {{ scope.row.filter ? '已设置' : '未设置' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!--枚举-->
        <el-form-item
          v-if="fieldEntity.type == 'enum'"
          label="枚举映射值">
          <cf-object-table
            :data="fieldEntity.options.maps"
            :render-header="renderFieldEnumsMapsOperationColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleFieldEnumsMapsEdit(scope.row)">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="handleFieldEnumsMapsDelete(scope.row)">
                删除
              </el-button>
            </template>
          </cf-object-table>
        </el-form-item>
        <!--上传文件-->
        <el-form-item
          v-if="fieldEntity.type == 'upload' || fieldEntity.type == 'rich-text'"
          label="文件类型">
          <el-select v-model="fieldEntity.options.fileType">
            <el-option
              v-for="item in fileTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="fieldEntity.type == 'upload' || fieldEntity.type == 'rich-text'"
          label="上传配置">
          <el-button
            type="success"
            @click="handleFieldUploadConfig">
            配置
          </el-button>
          <p>
            上传控件的配置，会默认读取<code>config.js</code>里面的公共配置，如非特殊情况建议做统一处理。
          </p>
          <div class="prop-desc-list">
            <dl>
              <dt>上传请求路径</dt>
              <dd>{{ fieldEntity.options.action }}</dd>
            </dl>
            <dl>
              <dt>上传请求参数名</dt>
              <dd>{{ fieldEntity.options.name }}</dd>
            </dl>
            <dl>
              <dt>是否携带Cookie</dt>
              <dd>{{ fieldEntity.options.withCredentials ? '是' : '否' }}</dd>
            </dl>
            <dl>
              <dt>上传前处理</dt>
              <dd>{{ fieldEntity.options.beforeUpload ? '已配置' : '未配置' }}</dd>
            </dl>
            <dl>
              <dt>上传成功后处理</dt>
              <dd>{{ fieldEntity.options.uploadSuccess ? '已配置' : '未配置' }}</dd>
            </dl>
          </div>
        </el-form-item>
        <!--自定义-->
        <el-form-item
          v-if="fieldEntity.type == 'custom'"
          label="控件">
          <p>
            自定义控件，请直接写vue的<code>component</code>代码。必须返回一个对象用于控件的构造函数。<br>
            其中必须要实现<code>props: ['uuid', 'extend']</code>和提供<code>this.$bus.$emit('custom-component:value', this.uuid, val)</code>事件触发<br>
          </p>
          <code-editor v-model="fieldEntity.options.config"/>
        </el-form-item>
        <el-form-item label="是否显示">
          <p>
            是否显示表单控件，默认为显示<br>
            函数会传入一个<code>{{ dialogEntity.name ? 'model, extend' : 'searchForm' }}</code>对象，是当前的搜索条件内容。
          </p>
          <code-editor v-model="fieldEntity.showFilter"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="defualt"
          @click="handleFieldDialogClose">
          关闭
        </el-button>
        <el-button
          type="primary"
          @click="handleFieldDialogSave">
          保存
        </el-button>
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
