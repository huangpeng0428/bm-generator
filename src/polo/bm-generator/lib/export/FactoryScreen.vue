<template>
  <div class="factory-wrapper" v-loading="loading">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="页面配置" name="page">
        <el-form :model="page" :rules="pageRules" label-width="120px">
          <el-form-item label="页面标题" prop="title">
            <el-input v-model="page.title"></el-input>
          </el-form-item>
          <el-form-item label="页面路径" prop="url">
            <el-input v-model="page.url"></el-input>
          </el-form-item>
          <el-form-item label="页面自定义样式" prop="css">
            <code-editor v-model="page.css" mode="css">
            </code-editor>
          </el-form-item>
          <el-form-item label="顶部导航">
            <el-table :data="page.navs">
              <el-table-column label="文本" prop="text"></el-table-column>
              <el-table-column label="选中状态">
                <template slot-scope="scope">
                  <span>{{scope.row.active ? '是' : '否'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="路径" prop="path"></el-table-column>
              <el-table-column :render-header="renderNavOperationColumn">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleNavEdit(scope.row, scope.$index)">
                    编辑
                  </el-button>
                  <el-button type="text" @click="handleNavDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="搜索表单" name="searchForm">
        <h3>基本配置</h3>
        <el-form :model="searchForm" :rules="searchFormRules" label-width="160px">
          <el-form-item label="搜索表单标题" prop="title">
            <el-input v-model="searchForm.title"></el-input>
          </el-form-item>
          <el-form-item label="表单标签宽度">
            <el-input v-model="searchForm.labelWidth"></el-input>
          </el-form-item>
          <el-form-item label="页面是否立即加载列表" prop="url">
            <el-switch v-model="searchForm.immediate" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
        </el-form>
        <hr>
        <h3>请求接口</h3>
        <el-table :data="searchFormUrls">
          <el-table-column label="类型"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type | searchFormUrlTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否已配置"
            align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.config ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="路径"
            prop="url">
          </el-table-column>
          <el-table-column label="方式"
            align="center"
            prop="method">
          </el-table-column>
          <el-table-column label="参数值"
            align="center"
            prop="params">
          </el-table-column>
          <el-table-column label="操作"
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
            @click="handleSearchFormFieldAdd">
          </el-button>
        </h3>
        <el-table :data="searchForm.fields">
          <el-table-column label="标题"
            prop="title">
          </el-table-column>
          <el-table-column label="key值"
            prop="key">
            <template slot-scope="scope">
              {{ scope.row.key | fieldFormatArrayFilter }}
            </template>
          </el-table-column>
          <el-table-column label="类型"
            prop="type">
            <template slot-scope="scope">
              {{ scope.row.type | fieldTypeFilter }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i
                :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                @click="handleTableRowUp('searchForm-fields', scope.$index)">
              </i>
              <i
                :class="['el-icon-arrow-down', scope.$index == searchForm.fields.length - 1 ? 'disabled' : '']"
                @click="handleTableRowDown('searchForm-fields', scope.$index)">
              </i>
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
            @click="handleSearchFormButtonAdd">
          </el-button>
        </h3>
        <el-table :data="searchForm.buttons">
          <el-table-column label="按钮文本" prop="text">
          </el-table-column>
          <el-table-column label="按钮样式">
            <template slot-scope="scope">
              <el-button :type="scope.row.klass" size="small">
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
                @click="handleTableRowUp('searchForm-buttons', scope.$index)">
              </i>
              <i
                :class="['el-icon-arrow-down', scope.$index == searchForm.buttons.length - 1 ? 'disabled' : '']"
                @click="handleTableRowDown('searchForm-buttons', scope.$index)">
              </i>
              <el-button type="text" @click="handleSearchFormButtonEdit(scope.row, scope.$index)">
                编辑
              </el-button>
              <el-button type="text" @click="handleSearchFormButtonDelete(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="数据列表" name="dataTable">
        <h3>基础配置</h3>
        <el-form label-width="120px">
          <el-form-item label="列表标题">
            <el-input type="text" v-model="dataTable.title">
            </el-input>
          </el-form-item>
        </el-form>

        <hr>
        <h3>分页配置</h3>
        <el-form label-width="120px">
          <el-form-item label="是否显示分页">
            <el-switch
              v-model="dataTable.pagination.show"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          <template v-if="dataTable.pagination.show">
            <el-form-item label="每页数量配置">
              <el-checkbox-group v-model="dataTable.pagination.sizes">
                <el-checkbox
                  v-for="item in paginationSizes"
                  :key="item"
                  :label="item">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="默认每页数量">
              <el-select v-model="dataTable.pagination.pageSize">
                <el-option
                  v-for="item in dataTable.pagination.sizes"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分页显示配置">
              <el-checkbox-group v-model="dataTable.pagination.layout">
                <el-checkbox
                  v-for="item in paginationLayout"
                  :key="item.value"
                  :label="item.value">
                  {{item.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="当前页映射">
              <p>请映射到搜索表单的相关字段（推荐用<code>hidden</code>类型）</p>
              <el-input
                type="text"
                v-model="dataTable.pagination.maps.page.key">
              </el-input>
              <p>
                如果是采用类似（开始行数+每页数量）这种查询条件的话，可以使用过滤器<br>
                默认会传入<code>page({ curr: '当前页', size: '每页数量' })</code>和<code>form(搜索表单实体对象)</code>，必须返回一个数字，作为映射值<br>
                如不需要请留空
              </p>
              <code-editor v-model="dataTable.pagination.maps.page.filter">
              </code-editor>
            </el-form-item>
            <el-form-item label="每页数量映射">
              <p>请映射到搜索表单的相关字段（推荐用<code>hidden</code>类型）</p>
              <el-input
                type="text"
                v-model="dataTable.pagination.maps.size.key">
              </el-input>
            </el-form-item>
          </template>
        </el-form>

        <hr>
        <h3>
          列表配置
          <el-button
            size="small"
            type="success"
            icon="el-icon-plus"
            @click="handleDataTableColumnAdd">
          </el-button>
        </h3>
        <el-form label-width="120px">
          <el-form-item label="支持默认排序">
            <el-switch
              v-model="dataTable.supportSort"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          <el-form-item label="默认排序" v-if="dataTable.supportSort">
            <el-select v-model="dataTable.defaultSort.prop">
              <el-option
                v-for="item in dataTableSortKeyOptions"
                :key="item.prop"
                :label="item.label"
                :value="item.prop">
              </el-option>
            </el-select>
            <el-radio-group v-model="dataTable.defaultSort.order">
              <el-radio label="ascending">升序</el-radio>
              <el-radio label="descending">降序</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-table :data="dataTable.columns">
          <el-table-column label="标题" prop="title">
              <template slot-scope="scope">
                <el-input v-model="scope.row.title"></el-input>
              </template>
          </el-table-column>
          <el-table-column label="映射字段" prop="field">
              <template slot-scope="scope">
                <el-input v-model="scope.row.field"></el-input>
              </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{ scope.row.type | columnTypeFilter }}
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sortable">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.sortable"></el-checkbox>
              </template>
          </el-table-column>
          <el-table-column label="可隐藏" prop="sortable">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.canHidden"></el-checkbox>
              </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i
                :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                @click="handleTableRowUp('dataTable-columns', scope.$index)">
              </i>
              <i
                :class="['el-icon-arrow-down', scope.$index == dataTable.columns.length - 1 ? 'disabled' : '']"
                @click="handleTableRowDown('dataTable-columns', scope.$index)">
              </i>
              <el-button
                type="text"
                @click="handleDataTableColumnEdit(scope.row, scope.$index)">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="handleDataTableColumnDelete(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form label-width="120px">
          <el-form-item label="数据列">
            <p>
              某些情况下，需要根据请求返回的值修改<code>columns</code><br>
              如果设置了数据列，参数<code>data</code>，需返回<code>columns</code>
            </p>
            <code-editor v-model="dataTable.columnsFilter">
            </code-editor>
          </el-form-item>
        </el-form>

        <hr>
        <h3>操作栏配置</h3>
        <el-form label-width="120px">
          <el-form-item label="是否显示操作栏">
            <el-switch
              v-model="dataTable.operations.show"
              active-text="显示"
              inactive-text="不显示"
              :width="72">
            </el-switch>
          </el-form-item>
          <el-form-item label="操作栏标题">
            <el-input v-model="dataTable.operations.title">
            </el-input>
          </el-form-item>
          <el-form-item label="操作栏宽度">
            <p>请提供<code>120px</code>这样的值，默认是自动宽度</p>
            <el-input v-model="dataTable.operations.width">
            </el-input>
          </el-form-item>
          <el-form-item label="对齐方式">
            <el-select v-model="dataTable.operations.align">
              <el-option
                v-for="item in alignTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作栏按钮">
            <el-table :data="dataTable.operations.buttons">
              <el-table-column label="按钮文本" prop="text">
              </el-table-column>
              <el-table-column label="按钮样式">
                <template slot-scope="scope">
                  <el-button :type="scope.row.klass" size="small">
                    {{ scope.row.text }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="按钮类型">
                <template slot-scope="scope">
                  {{ scope.row.type | buttonTypeFilter }}
                </template>
              </el-table-column>
              <el-table-column :render-header="renderDataTableOperationHeader">
                <template slot-scope="scope">
                  <i
                    :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                    @click="handleTableRowUp('dataTable-buttons', scope.$index)">
                  </i>
                  <i
                    :class="['el-icon-arrow-down', scope.$index == dataTable.operations.buttons.length - 1 ? 'disabled' : '']"
                    @click="handleTableRowDown('dataTable-buttons', scope.$index)">
                  </i>
                  <el-button
                    type="text"
                    @click="handleDataTableOperationsButtonEdit(scope.row, scope.$index)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleDataTableOperationsButtonDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>

        <hr>
        <h3>批量操作配置</h3>
        <el-form label-width="120px">
          <el-form-item label="显示批量操作">
            <el-switch
              v-model="dataTable.batch.show"
              active-text="显示"
              inactive-text="不显示"
              :width="72">
            </el-switch>
          </el-form-item>
          <el-form-item label="批量参数值">
            <p v-html='`
                  简便参数提交支持三种类型，<code>{"type": 1}</code>或者<code>[{"name": "poster_id", "raw": "1"}]</code>固定参数，<code>["id", "type"]</code>附加当前环境的动态参数，<code>[{"name": "poster_id", "value": "id"}]</code>需要起别名的动态参数。<br>
                  <code>name</code>是你需要替换后的名称，<code>value</code>是你当前执行环境的值的名称
                `'></p>
            <el-input
              type="textarea"
              v-model="dataTable.batch.params">
            </el-input>
          </el-form-item>
          <el-form-item label="列可选函数">
            <p>
              批量操作的列可选函数，返回boolean来控制，参数<code>row</code>,<code>index</code>
            </p>
            <code-editor v-model="dataTable.batch.selectable">
            </code-editor>
          </el-form-item>
          <el-form-item label="操作栏按钮">
            <el-table :data="dataTable.batch.buttons">
              <el-table-column label="按钮文本" prop="text">
              </el-table-column>
              <el-table-column label="按钮样式">
                <template slot-scope="scope">
                  <el-button :type="scope.row.klass" size="small">
                    {{ scope.row.text }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="按钮类型">
                <template slot-scope="scope">
                  {{ scope.row.type | buttonTypeFilter }}
                </template>
              </el-table-column>
              <el-table-column :render-header="renderDataTableOperationHeader">
                <template slot-scope="scope">
                  <i
                    :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                    @click="handleTableRowUp('dataTable-buttons', scope.$index)">
                  </i>
                  <i
                    :class="['el-icon-arrow-down', scope.$index == dataTable.batch.buttons.length - 1 ? 'disabled' : '']"
                    @click="handleTableRowDown('dataTable-buttons', scope.$index)">
                  </i>
                  <el-button
                    type="text"
                    @click="handleDataTableBatchButtonEdit(scope.row, scope.$index)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleDataTableBatchButtonDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>

        <hr />
        <h3>高级配置</h3>
        <el-form label-width="120px">
          <el-form-item label="是否本地分页">
            <el-switch
              v-model="dataTable.useLocalPagination"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          <el-form-item label="是否本地排序">
            <el-switch
              v-model="dataTable.useLocalSort"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          <el-form-item label="总计的位置">
            <el-radio-group v-model="dataTable.summaryPosition">
              <el-radio label="first">第一行</el-radio>
              <el-radio label="last">最后一行</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序url配置">
            <el-table :data="dataTableSortUrls">
              <el-table-column label="类型"
                align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.type | dataTableSortUrlTypeFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否已配置"
                align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.config ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="路径"
                prop="url">
              </el-table-column>
              <el-table-column label="方式"
                align="center"
                prop="method">
              </el-table-column>
              <el-table-column label="参数值"
                align="center"
                prop="params">
              </el-table-column>
              <el-table-column label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleClearUrlConfig('dataTableSort', scope.row)">
                    清空
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleSearchFormUrlConfig(scope.row, 'dataTableSort')">
                    {{ scope.row.config ? '编辑' : '配置' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="图表" name="chart">
        <h3>基础配置</h3>
        <el-form label-width="120px">
          <el-form-item label="图表标题">
            <el-input type="text" v-model="chart.title">
            </el-input>
          </el-form-item>
          <el-form-item label="y坐标格式">
            <el-input type="text" v-model="chart.yAxisFormatter">
            </el-input>
          </el-form-item>
          <el-form-item label="x坐标键值">
            <el-select v-model="chart.xAxisKey.key" clearable placeholder="x坐标键值">
              <el-option
                v-for="item in chartxAxisKeyOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="x坐标其他配置">
            <p>参考<a href="http://echarts.baidu.com/option.html#xAxis.axisLabel.rotate" target="_blank">EChart</a>,为一段JSON</p>
            <code-editor v-model="chart.xAxisKey.options" mode="json"></code-editor>
          </el-form-item>
          <el-form-item label="图表系列">
            <el-table :data="chart.seriesKeys">
              <el-table-column label="名称" prop="name"></el-table-column>
              <el-table-column label="键值" prop="key"></el-table-column>
              <el-table-column label="类型">
                <template slot-scope="scope">
                  <span>{{scope.row.type=='line' ? '线性图' : '柱状图'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="默认显示" prop="defaultShow">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.defaultShow"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column :render-header="renderChartSeriesOperationColumn">
                <template slot-scope="scope">
                  <i
                    :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                    @click="handleTableRowUp('chart-series', scope.$index)">
                  </i>
                  <i
                    :class="['el-icon-arrow-down', scope.$index == chart.seriesKeys.length - 1 ? 'disabled' : '']"
                    @click="handleTableRowDown('chart-series', scope.$index)">
                  </i>
                  <el-button type="text" @click="handleChartSeriesEdit(scope.row, scope.$index)">
                    编辑
                  </el-button>
                  <el-button type="text" @click="handleChartSeriesDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="对话框" name="dialogs">
        <h3>
          对话框列表
          <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
            @click="handleDialogsItemAdd">
          </el-button>
        </h3>
        <el-table :data="dialogList">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="是否已配置表单" prop="isConfigFields" align="center"></el-table-column>
          <el-table-column label="是否已配置请求接口" prop="isConfigUrls" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleDialogsItemEdit(scope.row.raw, false, scope.$index)">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="handleDialogsItemEdit(scope.row.raw, true, scope.$index)">
                复制新增
              </el-button>
              <el-button
                type="text"
                @click="handleDialogsItemDelete(scope.row.raw, scope.$index)">
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
          <el-input v-model="pageCode" :disabled="disabledPageCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleSave">
            保存配置
          </el-button>
          <a
            :href="'#/generator/' + pageCode"
            class="el-button el-button--info"
            target="_blank"
            v-if="disabledPageCode">
            预览
          </a>
          <router-link :to="{name: 'generator', params: {code: 'factories'}}"
            class="el-button el-button--warning">
            返回列表
          </router-link>
        </el-form-item>
      </el-form>
    </footer>

    <el-dialog title="URL配置"
      class="dialog-url"
      :visible.sync="urlDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleUrlDialogClose">
      <el-form label-width="130px">
        <el-form-item label="接口路径" prop="url">
          <el-input v-model="urlEntity.url" placeholder="接口请求路径"></el-input>
        </el-form-item>
        <el-form-item label="接口请求方式">
          <el-select v-model="urlEntity.method" placeholder="选择请求方式">
            <el-option
              v-for="method in requestMethods"
              :key="method"
              :value="method"
              :label="method">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数值" v-if="urlDialog.supportParams">
          <p v-html='
              urlDialog.supportDynamicParams ? `
                简便参数提交支持三种类型，<code>{"type": 1}</code>或者<code>[{"name": "poster_id", "raw": "1"}]</code>固定参数，<code>["id", "type"]</code>附加当前环境的动态参数，<code>[{"name": "poster_id", "value": "id"}]</code>需要起别名的动态参数。<br>
                <code>name</code>是你需要替换后的名称，<code>value</code>是你当前执行环境的值的名称
              ` : `
                该url不支持动态参数，只能输入 <code>{ "type": 1 }</code> 这样可以被转换的固定参数值
            `
          '></p>
          <p v-if="urlDialog.paramsMessage.length > 0" v-html="urlDialog.paramsMessage"></p>
          <el-input
            type="textarea"
            v-model="urlEntity.params">
          </el-input>
        </el-form-item>
        <el-form-item label="请求前参数过滤器" v-if="urlDialog.supportBeforeFilter">
          <p v-html="urlDialog.beforeFilterMessage"></p>
          <code-editor v-model="urlEntity.beforeFilter"></code-editor>
        </el-form-item>
        <el-form-item label="请求返回值过滤器" v-if="urlDialog.supportFilter">
          <p v-html="urlDialog.filterMessage"></p>
          <code-editor v-model="urlEntity.filter"></code-editor>
        </el-form-item>
        <el-form-item label="动态url过滤器" v-if="urlDialog.supportUrlFilter">
          <p>
            某些情况下，需要根据<code>searchForm</code>的值来动态决定请求的url路径<br>
            如果设置了动态url过滤器，则接口路径则不会生效，统一使用过滤器返回，请确保过滤器有url路径返回。
          </p>
          <code-editor v-model="urlEntity.urlFilter">
          </code-editor>
        </el-form-item>
        <el-form-item label="消息设置" v-if="urlDialog.supportMessages">
          <p>成功时提示文案（不需要请留空）：</p>
          <el-input type="text" v-model="urlEntity.successMessage">
          </el-input>
          <p>失败时提示文案（留空会显示默认报错信息）：</p>
          <el-input type="text" v-model="urlEntity.errorMessage">
          </el-input>
        </el-form-item>
        <el-form-item label="是否要二次弹框">
          <el-radio-group v-model="urlEntity.isSecondSure">
            <el-radio v-model="urlEntity.isSecondSure" label="1">是</el-radio>
            <el-radio v-model="urlEntity.isSecondSure" label="2">否</el-radio>
          </el-radio-group>
          <div v-if="urlEntity.isSecondSure == 1">
            <p>二次确认文案：</p>
            <el-input type="text" v-model="urlEntity.secondSureText">
            </el-input>
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

    <el-dialog title="表单控件配置"
      class="dialog-field"
      :visible.sync="fieldDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleFieldDialogClose">
      <el-form label-width="130px">
        <!--all-->
        <el-form-item label="控件类型">
          <el-select v-model="fieldEntity.type">
            <el-option
              v-for="type in fieldTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--all-->
        <el-form-item label="标题">
          <el-input type="text" v-model="fieldEntity.title"></el-input>
        </el-form-item>
        <!--all-->
        <el-form-item label="key值">
          <template v-if="fieldEntity.type == 'daterange' || fieldEntity.type == 'datetimerange'">
            <p>开始时间key值</p>
            <el-input
              type="text"
              v-model="fieldEntity.key[0]">
            </el-input>
            <p>结束时间key值</p>
            <el-input
              type="text"
              v-model="fieldEntity.key[1]">
            </el-input>
          </template>
          <el-input
            v-else
            type="text"
            v-model="fieldEntity.key">
          </el-input>
        </el-form-item>
        <el-form-item label="组件名" v-if="['other-component'].indexOf(fieldEntity.type) != -1">
          <el-input type="text" v-model="fieldEntity.componentName"></el-input>
        </el-form-item>
        <!--all-->
        <el-form-item label="提示文本" v-if="['other-component'].indexOf(fieldEntity.type) == -1">
          <el-input type="text" v-model="fieldEntity.placeholder"></el-input>
        </el-form-item>
        <el-form-item label="默认值" v-if="['other-component'].indexOf(fieldEntity.type) == -1">
          <el-input
            v-if="['text', 'textarea', 'hidden'].indexOf(fieldEntity.type) != -1"
            :type="fieldEntity.type == 'hidden' ? 'text' : fieldEntity.type"
            v-model="fieldEntity.defaultValue">
          </el-input>
          <el-select
            v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync"
            v-model="fieldEntity.defaultValue">
            <el-option
              v-for="item in fieldEntity.options.data"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <span v-if="fieldEntity.type == 'dropdown' && fieldEntity.isAsync">
            异步下拉列表暂不支持设置默认值
          </span>
          <span v-if="fieldOnlySupportAsync.indexOf(fieldEntity.type) != -1 || fieldUnsupportDefaultValue.indexOf(fieldEntity.type) != -1">
            <code>{{config.fieldTypes[fieldEntity.type]}}</code>暂不支持设置默认值
          </span>
          <el-select
            v-if="fieldEntity.type == 'date'"
            v-model="fieldEntity.defaultValue">
            <el-option
              v-for="item in dateDefaultValues"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-if="fieldEntity.type == 'daterange'"
            v-model="fieldEntity.defaultValue">
            <el-option
              v-for="item in daterangeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-switch
            v-if="fieldEntity.type == 'switch'"
            v-model="fieldEntity.defaultValue"
            :width="102"
            active-text="默认选中"
            inactive-text="默认不选中">
          </el-switch>
          <el-form-item label="最多选择数量:" label-width="100px" v-if="fieldEntity.type == 'table-column-hidden'">
            <el-input-number v-model="fieldEntity.options.limit" :min="0"></el-input-number>
          </el-form-item>
          <el-checkbox-group
            v-if="fieldEntity.type == 'table-column-hidden'"
            v-model="fieldEntity.defaultValue">
            <el-form-item :label="key + ':'"
              :key="key"
              label-width="100px"
              v-for="(value, key) in fieldTableColumnHiddenGroupData">
              <el-checkbox v-for="column in value"
                :disabled="fieldEntity.defaultValue.length >= fieldEntity.options.limit && fieldEntity.defaultValue.indexOf(column.field) == -1"
                :label="column.field"
                :key="column.field">
                  {{column.title}}
              </el-checkbox>
            </el-form-item>
          </el-checkbox-group>
        </el-form-item>
        <!--all-->
        <el-form-item label="数据类型" v-if="['other-component'].indexOf(fieldEntity.type) == -1">
          <el-select v-model="fieldEntity.dataType">
            <el-option
              v-for="item in dataTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--all-->
        <el-form-item label="验证配置">
          <el-table :data="fieldEntity.rules">
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span>{{config.ruleTypes[scope.row.type]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="提示信息" prop="message">
            </el-table-column>
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
        <el-form-item label="同步修改"
          v-if="['cascader', 'search-input', 'autocomplete'].indexOf(fieldEntity.type) != -1">
          <p>当本控件值发生改变时，同步修改引用的控件的值，多用于<code>级联菜单、搜索输入、输入建议</code>控件</p>
          <el-input v-model="fieldEntity.options.ref"></el-input>
        </el-form-item>
        <!--输入建议-->
        <el-form-item label="同步修改属性"
          v-if="fieldEntity.type == 'autocomplete'">
          <p>同步修改的属性，多用于<code>输入建议</code>控件</p>
          <el-input v-model="fieldEntity.options.refProp"></el-input>
        </el-form-item>
        <!--搜索输入、输入建议-->
        <el-form-item label="查询参数名"
          v-if="fieldEntity.type == 'search-input' || fieldEntity.type == 'autocomplete'">
          <el-input v-model="fieldEntity.options.param"></el-input>
        </el-form-item>
        <!--级联菜单-->
        <el-form-item label="是否显示全部路径"
          v-if="fieldEntity.type == 'cascader'">
          <el-switch
            v-model="fieldEntity.options.showFullPath"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <!--级联菜单-->
        <el-form-item label="是否允许选择任意路径"
          v-if="fieldEntity.type == 'cascader'">
          <el-switch
            v-model="fieldEntity.options.selectAnyLevel"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <!--all-->
        <el-form-item label="是否是异步"
          v-if="fieldSupportAsync.indexOf(fieldEntity.type) != -1">
          <el-switch
            v-model="fieldEntity.isAsync"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <!--下拉菜单-->
        <el-form-item label="是否调转"
          v-if="fieldEntity.type == 'dropdown'">
          <p>调转的意思是指，传入的值是下拉菜单的显示值，而非选中值。</p>
          <el-switch
            v-model="fieldEntity.options.reverse"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="值改变触发搜索"
          v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync">
          <el-switch
            v-model="fieldEntity.options.immediate"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否本地搜索"
          v-if="fieldEntity.type == 'search-input' && fieldEntity.isAsync">
          <el-switch
            v-model="fieldEntity.options.remote"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="控件数据"
          v-if="fieldSupportAsync.indexOf(fieldEntity.type) != -1">
          <template v-if="fieldEntity.isAsync">
            <el-button
              type="info"
              size="small"
              @click="handleFieldAsyncConfigOpen">
              配置数据请求
            </el-button>
            <el-table
              class="table-field-async-config"
              :data="[fieldEntity.options]"
              key="dropdownAsyncConfigTable">
              <el-table-column label="接口路径">
                <template slot-scope="scope">
                  <span :class="[scope.row.url ? '' : 'red']">
                    {{ scope.row.url ? scope.row.url : '未设置' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="请求方式"
                prop="method"
                align="center"
                width="120px">
              </el-table-column>
              <el-table-column label="过滤器"
                align="center"
                width="120px">
                <template slot-scope="scope" align="center">
                  <span :class="[scope.row.filter ? '' : 'red']">
                    {{ scope.row.filter ? '已设置' : '未设置' }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-table
            v-if="fieldSupportStaticData.indexOf(fieldEntity.type) != -1 && !fieldEntity.isAsync"
            :data="fieldEntity.options.data"
            key="fieldStaticDataTable">
            <el-table-column
              label="显示值"
              prop="name"
              align="center">
            </el-table-column>
            <el-table-column
              label="选中值"
              prop="value"
              align="center">
            </el-table-column>
            <el-table-column
              v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync && fieldEntity.options.immediate"
              label="显示列"
              prop="columnFields"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.columnFields | columnFieldToTitleFilter(dataTable.columns) | fieldFormatArrayFilter}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :render-header="renderFieldStaticDataOperationColumn">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleFieldStaticDataEdit(scope.row, scope.$index, fieldEntity)">
                  编辑
                </el-button>
                <el-button
                  type="text"
                  v-if="fieldEntity.type == 'dropdown' && !fieldEntity.isAsync && fieldEntity.options.immediate"
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
        <el-form-item label="是否包含全部" v-if="fieldEntity.type == 'dropdown'">
          <el-switch
            v-model="fieldEntity.options.hasAll"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="配置数据" v-if="fieldEntity.type == 'cascader' && !fieldEntity.isAsync">
          <p>
            json对象<code>{}</code>
          </p>
          <code-editor
            v-model="fieldEntity.options.data">
          </code-editor>
        </el-form-item>
        <!--文本框-->
        <el-form-item label="blur回调"
          v-if="fieldEntity.type == 'text'">
          <code-editor v-model="fieldEntity.options.blur">
          </code-editor>
        </el-form-item>
        <!--日期-->
        <el-form-item label="日期类型"
          v-if="fieldEntity.type == 'date'">
          <el-select v-model="fieldEntity.options.type">
            <el-option
              v-for="item in dateTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--日期、日期时间、日期时间区间、日期区间-->
        <el-form-item label="数据格式化"
          v-if="['date', 'datetime', 'datetimerange', 'daterange'].indexOf(fieldEntity.type) != -1">
          <p>年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss</p>
          <el-input
            v-model="fieldEntity.options.format">
          </el-input>
        </el-form-item>
        <!--日期-->
        <el-form-item label="禁用时间"
          v-if="['daterange', 'date', 'datetimerange'].indexOf(fieldEntity.type) != -1">
          <el-select v-model="fieldEntity.options.disabledDate">
            <el-option
              v-for="item in dateDisabledDateTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <template v-if="fieldEntity.options.disabledDate == 'custom'">
            <p>会传入<code>time</code>作为参数（Date类型），必须返回一个<code>Boolean</code>，以确认是否禁用该日期</p>
            <code-editor v-model="fieldEntity.options.disabledDateFilter">
            </code-editor>
          </template>
        </el-form-item>
        <!--日期区间、日期时间区间-->
        <el-form-item label="快捷选择"
          v-if="fieldEntity.type == 'daterange' || fieldEntity.type == 'datetimerange'">
          <el-checkbox-group v-model="fieldEntity.options.shortcuts">
            <el-checkbox
              v-for="item in daterangeShortcuts"
              :key="item.value"
              :label="item.value">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
          <p>如果最近几天不能包含今天，请勾选下面的选项</p>
          <el-checkbox
            v-model="fieldEntity.options.notIncludeToday">
            不包含今天
          </el-checkbox>
        </el-form-item>
        <!--开关-->
        <el-form-item label="数据值"
          v-if="fieldEntity.type == 'switch'">
          <el-row>
            <el-col :span="5" class="form-label">选中显示值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.on.text">
              </el-input>
            </el-col>
            <el-col :span="5" class="form-label">选中值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.on.value">
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5" class="form-label">未选中显示值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.off.text">
              </el-input>
            </el-col>
            <el-col :span="5" class="form-label">未选中值</el-col>
            <el-col :span="7">
              <el-input v-model="fieldEntity.options.off.value">
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <!--级联菜单-->
        <el-form-item label="异步选择项"
          v-if="fieldEntity.type == 'cascader'">
          <el-button
            type="info"
            size="small"
            @click="handleCascaderItemAsyncConfigOpen">
            配置选项选择的数据请求
          </el-button>
          <el-table
            class="table-field-async-config"
            :data="[fieldEntity.options.item]"
            key="dropdownAsyncConfigTable">
            <el-table-column label="接口路径">
              <template slot-scope="scope">
                <span :class="[scope.row.url ? '' : 'red']">
                  {{ scope.row.url ? scope.row.url : '未设置' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="请求方式"
              prop="method"
              align="center"
              width="120px">
            </el-table-column>
            <el-table-column label="过滤器"
              align="center"
              width="120px">
              <template slot-scope="scope" align="center">
                <span :class="[scope.row.filter ? '' : 'red']">
                  {{ scope.row.filter ? '已设置' : '未设置' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!--枚举-->
        <el-form-item label="枚举映射值"
          v-if="fieldEntity.type == 'enum'">
          <cf-object-table
            :data="fieldEntity.options.maps"
            :render-header="renderFieldEnumsMapsOperationColumn">
            <template slot-scope="scope">
              <el-button type="text" @click="handleFieldEnumsMapsEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="text" @click="handleFieldEnumsMapsDelete(scope.row)">
                删除
              </el-button>
            </template>
          </cf-object-table>
        </el-form-item>
        <!--上传文件-->
        <el-form-item label="文件类型"
          v-if="fieldEntity.type == 'upload' || fieldEntity.type == 'rich-text'">
          <el-select v-model="fieldEntity.options.fileType">
            <el-option
              v-for="item in fileTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传配置"
          v-if="fieldEntity.type == 'upload' || fieldEntity.type == 'rich-text'">
          <el-button type="success" @click="handleFieldUploadConfig">
            配置
          </el-button>
          <p>
            上传控件的配置，会默认读取<code>config.js</code>里面的公共配置，如非特殊情况建议做统一处理。
          </p>
          <div class="prop-desc-list">
            <dl>
              <dt>上传请求路径</dt>
              <dd>{{fieldEntity.options.action}}</dd>
            </dl>
            <dl>
              <dt>上传请求参数名</dt>
              <dd>{{fieldEntity.options.name}}</dd>
            </dl>
            <dl>
              <dt>是否携带Cookie</dt>
              <dd>{{fieldEntity.options.withCredentials ? '是' : '否'}}</dd>
            </dl>
            <dl>
              <dt>上传前处理</dt>
              <dd>{{fieldEntity.options.beforeUpload ? '已配置' : '未配置'}}</dd>
            </dl>
            <dl>
              <dt>上传成功后处理</dt>
              <dd>{{fieldEntity.options.uploadSuccess ? '已配置' : '未配置'}}</dd>
            </dl>
          </div>
        </el-form-item>
        <!--自定义-->
        <el-form-item label="控件"
          v-if="fieldEntity.type == 'custom'">
          <p>
            自定义控件，请直接写vue的<code>component</code>代码。必须返回一个对象用于控件的构造函数。<br>
            其中必须要实现<code>props: ['uuid', 'extend']</code>和提供<code>this.$bus.$emit('custom-component:value', this.uuid, val)</code>事件触发<br>
          </p>
          <code-editor v-model="fieldEntity.options.config"></code-editor>
        </el-form-item>
        <el-form-item label="是否显示">
          <p>
            是否显示表单控件，默认为显示<br>
            函数会传入一个<code>{{ dialogEntity.name ? 'model, extend' : 'searchForm' }}</code>对象，是当前的搜索条件内容。
          </p>
          <code-editor v-model="fieldEntity.showFilter">
          </code-editor>
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

    <el-dialog title="验证配置"
      class="dialog-rule"
      :visible.sync="ruleDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleRuleDialogClose">
      <el-form label-width="120px">
        <el-form-item label="验证类型">
          <el-select v-model="ruleEntity.type">
            <el-option
              v-for="item in ruleTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-switch
            v-model="ruleEntity.required"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="长度限制" v-if="ruleEntity.type == 'string'">
          <el-input type="text" v-model.number="ruleEntity.len"></el-input>
        </el-form-item>
        <el-form-item label="最大长度" v-if="ruleEntity.type == 'string'">
          <el-input type="text" v-model.number="ruleEntity.max"></el-input>
        </el-form-item>
        <el-form-item label="最小长度" v-if="ruleEntity.type == 'string'">
          <el-input type="text" v-model.number="ruleEntity.min"></el-input>
        </el-form-item>
        <el-form-item label="提示信息">
          <el-input type="text" v-model="ruleEntity.message"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="defualt"
          @click="handleRuleDialogClose">
          关闭
        </el-button>
        <el-button
          type="primary"
          @click="handleRuleDialogSave">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="键值配置"
      class="dialog-value"
      size="tiny"
      :visible.sync="valueDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleButtonDialogClose">
      <el-form label-width="80px" label-position="top">
        <el-form-item :label="valueDialog.nameLabel">
          <el-input v-model="valueEntity.name"></el-input>
        </el-form-item>
        <el-form-item :label="valueDialog.valueLabel">
          <el-input v-model="valueEntity.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleValueDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleValueDialogSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="显示列"
      class="dialog-column-show"
      size="tiny"
      :visible.sync="columnShowDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleButtonDialogClose">
      <el-form label-width="80px" label-position="top">
        <el-checkbox-group v-model="columnShowDialog.columnFields">
          <el-checkbox :label="item.field" :key="item.field" v-for="item of fieldTableColumnHiddenData">{{ item.title }}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleColumnShowDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleColumnShowDialogSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="按钮配置"
      class="dialog-button"
      :visible.sync="buttonDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleButtonDialogClose">
      <el-form label-width="120px">
        <el-form-item label="按钮类型">
          <el-select v-model="buttonEntity.type">
            <el-option
              v-for="item in supportButtonTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="按钮文本">
          <el-input v-model="buttonEntity.text" type="text">
          </el-input>
        </el-form-item>
        <el-form-item label="按钮样式">
          <el-radio
            v-for="type in ['default', 'info', 'primary', 'success', 'warning', 'danger', 'text']"
            v-model="buttonEntity.klass"
            :key="type"
            :label="type">
            <el-button :type="type" size="small" @click="handleButtonChoiceKlass(type)">
              按钮
            </el-button>
          </el-radio>
        </el-form-item>
        <el-form-item label="链接地址" v-if="buttonEntity.type == 'link' || buttonEntity.type == 'router'">
          <p v-if="buttonEntity.type == 'link'">
            可以使用<code><%= props.prop %></code>来注入变量到链接
          </p>
          <el-input type="text" v-model="buttonEntity.options.path"></el-input>
        </el-form-item>
        <el-form-item label="链接打开方式" v-if="buttonEntity.type == 'link'">
          <el-select v-model="buttonEntity.options.target">
            <el-option
              v-for="item in buttonTargetTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路由名称" v-if="buttonEntity.type == 'router'">
          <el-select v-model="buttonEntity.options.name">
            <el-option
              v-for="item in namedRouter"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="buttonEntity.type == 'router'">
          <!-- params与query方式可能需要同时都支持 -->
          <el-form-item
            :label="item+'链接参数'"
            v-for="item in routerParamsTypes"
            :key="item">
            <p>
              简便参数提交支持三种类型，<code>{"type": 1}</code>固定参数，<code>["id", "type"]</code>附加当前环境的动态参数，<code>[{"name": "poster_id", "value": "id"}]</code>需要起别名的动态参数。
            </p>
            <el-input type="text" v-model="buttonEntity.options[item+'Params']">
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="对话框框" v-if="buttonEntity.type == 'dialog'">
          <p v-if="Object.keys(dialogs).length == 0" class="red">
            请先添加对话框
          </p>
          <el-select v-model="buttonEntity.options.name">
            <el-option
              v-for="(dialog, name) in dialogs"
              :key="name"
              :label="name"
              :value="name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对话框状态" v-if="buttonEntity.type == 'dialog'">
          <el-select v-model="buttonEntity.options.status">
            <el-option
              v-for="item in dialogStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否是异步" v-if="buttonEntity.type == 'dialog' && buttonEntity.options.type != 'add'">
          <p>如果是异步请求数据，请配置接口请求。如果是非异步数据，则采用数据列表的当前行作为数据源填充</p>
          <el-switch
            v-model="buttonEntity.isAsync"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="请求接口配置" v-if="buttonEntity.isAsync">
          <el-button
            type="info"
            size="small"
            @click="handleButtonAsyncConfigOpen">
            配置数据请求
          </el-button>
          <el-table
            class="table-button-async-config"
            :data="[buttonEntity.options]">
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
              align="center">
            </el-table-column>
            <el-table-column label="过滤器">
              <template slot-scope="scope" align="center">
                <span :class="[scope.row.filter ? '' : 'red']">
                  {{ scope.row.filter ? '已设置' : '未设置' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="确认框消息提示" v-if="buttonEntity.type == 'confirm'">
          <el-input v-model="buttonEntity.options.confirmMessage">
          </el-input>
        </el-form-item>
        <el-form-item label="标题" v-if="buttonEntity.type == 'iframe'">
          <p>
            可以使用字符串替换，默认会传入<code>data</code>和<code>searchForm</code>作为参数。<br>
            <code>data</code>为当前环境的数据，例如在数据列表中则为当前行数据，<code>searchForm</code>是搜索表单的值<br>
            请使用<code><%= data.id %></code>这样的字符串来做值替换
          </p>
          <el-input type="text" v-model="buttonEntity.options.title">
          </el-input>
        </el-form-item>
        <el-form-item label="地址" v-if="buttonEntity.type == 'iframe'">
          <p>
            可以使用字符串替换，默认会传入<code>data</code>和<code>searchForm</code>作为参数。<br>
            <code>data</code>为当前环境的数据，例如在数据列表中则为当前行数据，<code>searchForm</code>是搜索表单的值<br>
            请使用<code><%= data.id %></code>这样的字符串来做值替换<br>
            如果是用于内部链接的打开可以增加<code>__fullscreen=true</code>来实现模块全屏（隐藏了侧边栏和顶栏）
          </p>
          <el-input
            type="textarea"
            v-model="buttonEntity.options.src"
            :rows="4">
          </el-input>
        </el-form-item>
        <el-form-item label="窗口大小" v-if="buttonEntity.type == 'iframe'">
          <el-select v-model="buttonEntity.options.size">
            <el-option
              v-for="item in dialogSizeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示过滤器" v-if="['confirm', 'dialog', 'request', 'link', 'router', 'iframe'].indexOf(buttonEntity.type) != -1">
          <p v-html="buttonDialog.showFilterMessage"></p>
          <code-editor v-model="buttonEntity.options.showFilter">
          </code-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleButtonDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleButtonDialogSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="列配置"
      class="dialog-column"
      :visible.sync="columnDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleColumnDialogClose">
      <el-form label-width="120px">
        <el-form-item label="列显示类型">
          <el-select v-model="columnEntity.type">
            <el-option
              v-for="item in columnTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列标题">
          <el-input type="text" v-model="columnEntity.title">
          </el-input>
        </el-form-item>
        <el-form-item label="映射字段">
          <el-input type="text" v-model="columnEntity.field">
          </el-input>
        </el-form-item>
        <el-form-item label="链接样式" v-if="columnEntity.type == 'router'">
          <el-radio
            v-for="type in ['default', 'info', 'primary', 'success', 'warning', 'danger', 'text']"
            v-model="columnEntity.klass"
            :key="type"
            :label="type">
            <el-button :type="type" size="small" @click="handleButtonChoiceKlass(type)">
              按钮
            </el-button>
          </el-radio>
        </el-form-item>
        <el-form-item label="可排序">
          <el-switch
            v-model="columnEntity.sortable"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="可隐藏">
          <el-switch
            v-model="columnEntity.canHidden"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="所属组" v-if="columnEntity.canHidden">
          <el-input type="text" v-model="columnEntity.group">
          </el-input>
        </el-form-item>
        <el-form-item label="时间格式" v-if="columnEntity.type == 'time'">
          <p>年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss</p>
          <el-input type="text" v-model="columnEntity.format">
          </el-input>
        </el-form-item>
        <el-form-item label="对齐方式">
          <el-select v-model="columnEntity.align">
            <el-option
              v-for="item in alignTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宽度">
          <p>默认是自动宽度，请输入<code>120px</code>这样的像素值</p>
          <el-input type="text" v-model="columnEntity.width">
          </el-input>
        </el-form-item>
        <el-form-item label="固定文本" v-if="['plain', 'link', 'router'].indexOf(columnEntity.type) != -1">
          <el-input type="text" v-model="columnEntity.text">
          </el-input>
        </el-form-item>
        <el-form-item label="枚举映射值" v-if="columnEntity.type == 'enum'">
          <cf-object-table
            :data="columnEntity.maps"
            :render-header="renderColumnMapsOperationColumn">
            <template slot-scope="scope">
              <el-button type="text" @click="handleColumnMapsEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="text" @click="handleColumnMapsDelete(scope.row)">
                删除
              </el-button>
            </template>
          </cf-object-table>
        </el-form-item>
        <el-form-item label="链接地址" v-if="columnEntity.type == 'link' || columnEntity.type == 'router'">
          <p v-if="columnEntity.type == 'link'">
            可以使用<code><%= props.prop %></code>来注入变量到链接
          </p>
          <el-input type="text" v-model="columnEntity.options.path"></el-input>
        </el-form-item>
        <el-form-item label="链接打开方式" v-if="columnEntity.type == 'link'">
          <el-select v-model="columnEntity.options.target">
            <el-option
              v-for="item in buttonTargetTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路由名称" v-if="columnEntity.type == 'router'">
          <el-select v-model="columnEntity.options.name">
            <el-option
              v-for="item in namedRouter"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="columnEntity.type == 'router'">
          <!-- params与query方式可能需要同时都支持 -->
          <el-form-item
            :label="item+'链接参数'"
            v-for="item in routerParamsTypes"
            :key="item">
            <p>
              简便参数提交支持三种类型，<code>{"type": 1}</code>固定参数，<code>["id", "type"]</code>附加当前环境的动态参数，<code>[{"name": "poster_id", "value": "id"}]</code>需要起别名的动态参数。
            </p>
            <el-input type="text" v-model="columnEntity.options[item+'Params']">
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="组件名" v-if="columnEntity.type == 'other-component'">
          <el-input type="text" v-model="columnEntity.componentName">
          </el-input>
        </el-form-item>
        <el-form-item label="回调函数" v-if="columnEntity.type == 'inner'">
          <p>
            该回调函数已经动态绑定了<code>this</code>对象为当前<code>Generator</code>页面对象，请谨慎修改使用。<br>
            默认会传入一个<code>data</code>对象，这个对象的值是当前行的数据。
          </p>
          <code-editor v-model="columnEntity.options.callback">
          </code-editor>
        </el-form-item>
        <el-form-item label="是否显示">
          <p>
            是否显示该列，默认为显示<br>
            函数会传入一个<code>searchForm</code>对象，是当前的搜索条件内容。
          </p>
          <code-editor v-model="columnEntity.showFilter">
          </code-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleColumnDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleColumnDialogSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="对话框配置"
      class="dialog-dialogitem"
      :visible.sync="dialogItemDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleDialogItemDialogClose">
      <el-form label-width="120px">
        <el-form-item label="对话框类型">
          <el-select v-model="dialogEntity.type">
            <el-option
              v-for="item in dialogTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="dialogEntity.name" placeholder="只能输入英文"></el-input>
        </el-form-item>
        <el-form-item label="标签宽度" v-if="dialogEntity.type != 'template'">
          <el-input v-model="dialogEntity.labelWidth"></el-input>
        </el-form-item>
        <el-form-item label="对话框大小">
          <el-select v-model="dialogEntity.size">
            <el-option
              v-for="item in dialogSizeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否统一标题">
          <el-switch
            v-model="dialogItemDialog.isSameTitle"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="统一标题" v-if="dialogItemDialog.isSameTitle">
          <el-input v-model="dialogEntity.title">
          </el-input>
        </el-form-item>
        <el-form-item label="各类型标题" v-if="!dialogItemDialog.isSameTitle">
          <p>新增类型的标题</p>
          <el-input v-model="dialogEntity.titles.add"></el-input>
          <p>编辑类型的标题</p>
          <el-input v-model="dialogEntity.titles.edit"></el-input>
          <p>查看类型的标题</p>
          <el-input v-model="dialogEntity.titles.view"></el-input>
        </el-form-item>
        <template v-if="dialogEntity.type == 'template'">
          <el-form-item label="模板">
            <p>
              请直接写vue的template的代码，默认会注入<code>data</code>（对话框的请求返回值实体）<br>
              <code>dynamic</code>设置自定义属性
            </p>
            <code-editor v-model="dialogEntity.template" mode="html"></code-editor>
          </el-form-item>
          <el-form-item label="自定义属性">
            <el-table :data="dialogEntity.props" key="dialog-props-table">
              <el-table-column label="属性名" prop="name" align="center">
              </el-table-column>
              <el-table-column label="属性值" prop="value" align="center">
              </el-table-column>
              <el-table-column align="center" :render-header="renderDialogPropsOperationColumn">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleDialogPropEdit(scope.row, scope.$index)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleDialogPropDelete(scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="样式">
            <p>
              样式会在对话框创建的时候生成，在整个页面销毁的时候去除，只针对当前页面有效。
            </p>
            <code-editor v-model="dialogEntity.css" mode="css"></code-editor>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="表单控件">
            <el-table
              :data="dialogEntity.fields">
              <el-table-column
                label="标题"
                prop="title">
              </el-table-column>
              <el-table-column
                label="key值"
                prop="key">
              </el-table-column>
              <el-table-column
                label="类型"
                prop="type">
                <template slot-scope="scope">
                  {{ scope.row.type | fieldTypeFilter }}
                </template>
              </el-table-column>
              <el-table-column
                :render-header="renderDialogFieldOperationHeader">
                <template slot-scope="scope">
                  <i
                    :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                    @click="handleTableRowUp('dialog-fields', scope.$index)">
                  </i>
                  <i
                    :class="['el-icon-arrow-down', scope.$index == dialogEntity.fields.length - 1 ? 'disabled' : '']"
                    @click="handleTableRowDown('dialog-fields', scope.$index)">
                  </i>
                  <el-button
                    type="text"
                    @click="handleDialogFieldEdit(scope.row, scope.$index)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleDialogFieldDelete(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="编辑状态时不可修改">
            <el-checkbox-group v-model="dialogEntity.options.edit.disabled">
              <el-checkbox
                v-for="item in dialogEntity.fields"
                :key="item.key"
                :label="item.key">
                {{item.title}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="是否自定义按钮">
            <el-switch
              v-model="dialogItemDialog.isDynamicButton"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
          <el-form-item label="保存接口配置" v-if="!dialogItemDialog.isDynamicButton">
            <el-table
              :data="dialogUrls">
              <el-table-column
                label="类型"
                align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.type | dialogUrlTypeFilter }}</span>
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
                prop="url">
              </el-table-column>
              <el-table-column
                label="方式"
                align="center"
                prop="method">
              </el-table-column>
              <el-table-column
                label="参数值"
                align="center"
                prop="params">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleDialogUrlConfig(scope.row)">
                    {{ scope.row.config ? '编辑' : '配置' }}
                  </el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.config"
                    @click="handleDialogUrlClear(scope.row)">
                    清空配置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
        <el-form-item label="按钮配置" v-if="dialogItemDialog.isDynamicButton || dialogEntity.type == 'template'">
          <el-table :data="dialogEntity.buttons" key="dialog-buttons-table">
            <el-table-column label="按钮文本" prop="text">
            </el-table-column>
            <el-table-column label="按钮样式">
              <template slot-scope="scope">
                <el-button :type="scope.row.klass" size="small">
                  {{ scope.row.text }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="按钮类型">
              <template slot-scope="scope">
                {{ scope.row.type | buttonTypeFilter }}
              </template>
            </el-table-column>
            <el-table-column :render-header="renderDialogButtonOperationHeader">
              <template slot-scope="scope">
                <i
                  :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                  @click="handleTableRowUp('dialog-buttons', scope.$index)">
                </i>
                <i
                  :class="['el-icon-arrow-down', scope.$index == dialogEntity.buttons.length - 1 ? 'disabled' : '']"
                  @click="handleTableRowDown('dialog-buttons', scope.$index)">
                </i>
                <el-button type="text" @click="handleDialogButtonEdit(scope.row, scope.$index)">
                  编辑
                </el-button>
                <el-button type="text" @click="handleDialogButtonDelete(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleDialogItemDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleDialogItemDialogSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导航配置"
      class="dialog-nav"
      :visible.sync="navDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleNavDialogClose">
      <el-form label-width="130px">
        <el-form-item label="文本">
          <el-input type="text" v-model="navEntity.text"></el-input>
        </el-form-item>
        <el-form-item label="是否处于选中状态">
          <el-switch
            v-model="navEntity.active"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="路径">
          <el-input type="text" v-model="navEntity.path"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleNavDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleNavDialogSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图表项配置"
      class="dialog-nav"
      :visible.sync="chartSeriesDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleChartSeriesDialogClose">
      <el-form label-width="130px">
        <el-form-item label="图表项">
          <el-select v-model="chartSeriesEntity.key" placeholder="图表项">
            <el-option
              v-for="item in chartSeriesKeyOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图表类型">
          <el-select v-model="chartSeriesEntity.type" placeholder="图表项">
            <el-option
              v-for="item in ['line', 'bar']"
              :key="item"
              :value="item"
              :label="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleChartSeriesDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleChartSeriesDialogSave">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="上传配置"
      class="dialog-upload"
      :visible.sync="uploadDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleUploadDialogClose">
      <el-form label-width="120px">
        <el-form-item label="上传请求路径">
          <el-input type="text" v-model="uploadEntity.action">
          </el-input>
        </el-form-item>
        <el-form-item label="上传请求参数名">
          <el-input type="text" v-model="uploadEntity.name">
          </el-input>
        </el-form-item>
        <el-form-item label="是否携带Cookie">
          <el-switch
            v-model="uploadEntity.withCredentials"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="上传前处理">
          <p>函数会传入一个 file 对象，是当前的上传文件对象，参考 el-upload 组件 before-upload 钩子。</P>
          <code-editor v-model="uploadEntity.beforeUpload">
          </code-editor>
        </el-form-item>
        <el-form-item label="上传成功后处理">
          <code-editor v-model="uploadEntity.uploadSuccess">
          </code-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" @click="handleUploadDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleUploadDialogSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import factoryScreen from './js/factoryScreen'

  export default factoryScreen
</script>

<style lang="stylus">
  .factory-wrapper
    width 100%
    padding-bottom 60px
    .top-generator-page
      margin-bottom 15px
    .factory-footer
      margin-top 22px
      text-align right
      position fixed
      bottom 0
      left 0
      right 0
      background-color #fff
      padding 10px 20px
      z-index 90
    .el-card
      width 100%
    hr
      margin-top 22px
      border-color rgba(170, 170, 170, 0.36)
    .dialog-url, .dialog-field, .dialog-button
      .el-row
        margin-bottom 20px
        &:last-child
          margin-bottom: 0;
      .form-label
        text-align right
        padding-right 12px
    .table-field-async-config, .table-button-async-config
      margin-top 12px
    .el-form-item__content
      p:first-child
        margin-top 0
    .el-icon-arrow-up, .el-icon-arrow-down
      color #20a0ff
      cursor pointer
      margin-right 10px
      &.disabled
        color #ccc
        cursor not-allowed
    .prop-desc-list
      margin-top 12px
      dl
        border 1px solid #ccc
        border-bottom none
        margin 0
        overflow hidden
        &:first-of-type
          border-radius 5px 5px 0 0
        &:last-of-type
          border-bottom 1px solid #ccc
          border-radius 0 0 5px 5px
      dt
        float left
        width 130px
        padding-left 12px
        background #f3f3f3
      dd
        margin-left 130px
        padding-left 12px
</style>
