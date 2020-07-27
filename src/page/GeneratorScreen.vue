/* eslint-disable */
<template>
  <div
    v-loading="pageLoading"
    class="generator-wrapper">
    <!-- 顶部导航2 -->
    <cf-navs :navs="page.navs"/>

    <!-- 面包屑导航 -->
    <el-breadcrumb
      v-if="breadcrumb.length > 0"
      separator="/"
      class="breadcrumb-wrap">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="item in breadcrumb"
        :to="item.url ? { path: item.url }: null"
        :key="item.title + item.url">{{ item.title | textRouteParse($route.query) }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 页面标题 -->
    <h2
      v-if="breadcrumb.length == 0"
      class="page-title">{{ page.title | textRouteParse($route.query) }}</h2>

    <!-- 搜索表单 -->
    <el-card
      v-if="!hideSearchForm"
      class="box-card">
      <div slot="header">
        <span>{{ searchForm.title }}</span>
      </div>
      <el-form
        :label-width="searchForm.labelWidth"
        :model="searchFormInfo"
        class="search-form">
        <el-row>
          <template v-for="entry in searchFormFields">
            <input
              v-if="entry.type == 'hidden'"
              v-model="entry.value"
              type="hidden" >
            <component
              v-else-if="entry.type == 'other-component'"
              :is="entry.componentName"
              :field="entry"
              :key="pageCode + 'other-component-' + entry.componentName"/>
            <el-col
              v-else
              v-show="entry.show"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item
                :label="entry.title"
                :prop="Array.isArray(entry.key) ? entry.key[0] : entry.key"
                :rules="entry.rules || []"
                :key="pageCode + (Array.isArray(entry.key) ? entry.key[0] : entry.key)">
                <form-item
                  v-model="entry.value"
                  :field="entry"
                  :extend="searchFormInfo"
                  origin="searchForm"
                  @syncRefValueChange="syncRefValueChange"
                  @fieldChangeDoSearch="fieldChangeDoSearch"/>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <el-row>
          <el-col
            :span="24"
            class="search-buttons">
            <template v-for="btn in searchForm.buttons">
              <template v-if="btn.componentName">
                <component :is="btn.componentName"/>
              </template>
              <template v-else>
                <cf-button
                  v-if="handleButtonVisible('searchForm', btn, searchFormInfo)"
                  :btn="btn"
                  :data="searchFormInfo"
                  @click="handleButtonClick('searchForm', btn, searchFormInfo)"/>
              </template>
            </template>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 图表 -->
    <el-card
      v-if="chart && (searchForm.urls.chart.url || searchForm.urls.chart.urlFilter) && chart.xAxisKey && chart.xAxisKey.key"
      class="box-card">
      <div slot="header">
        <span>{{ chart.title }}</span>
        <!-- <el-checkbox-group class="chart-toggle-title"
          v-if="chart.options.legend"
          v-model="chart.options.legend.data"
          size="small" @change="renderChartView()">
          <el-checkbox
            v-for="item in chart.seriesKeys"
            :label="item.name"
            :key="item.key">
              {{item.name}}
          </el-checkbox>
        </el-checkbox-group> -->
      </div>
      <figure class="chart-wrap">
        <chart
          ref="chart"
          :options="chart.options"
          auto-resize
          @legendselectchanged="chartLengendSelectedChanged"/>
      </figure>
      <el-checkbox-group
        v-show="isChartCompareDay"
        v-model="chart.compare.day"
        class="chart-compare-day"
        @change="changeChartCompareDay">
        <el-checkbox
          v-for="item in chartCompareDay"
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </el-card>

    <!-- 数据列表 -->
    <el-card class="box-card">
      <div slot="header">
        <span>{{ dataTable.title }}</span>
      </div>
      <el-table
        v-loading="dataTable.loading"
        :data="dataTable.data"
        :row-class-name="dataTableRowClassName"
        :default-sort="dataTable.supportSort ? dataTable.defaultSort : {}"
        class="data-table"
        @sort-change="handleDataTableSort"
        @selection-change="handleDataTableSelectionChange">
        <el-table-column
          v-if="dataTable.batch.show"
          :selectable="rowSelectable"
          type="selection"
          width="55"/>
        <!-- 添加 filters 为了控制不要点标题排序（用样式隐藏） -->
        <el-table-column
          v-for="(column, columnIndex) in dataTable.columns"
          v-if="handleColumnVisible(column)"
          :key="column.field"
          :prop="column.field"
          :width="dataTable.columns.length > 13 ? (column.width || '100px') : column.width"
          :align="column.align"
          :label="column.title"
          :filters="column.sortable ? [] : null"
          :sortable="column.sortable ? 'custom' : false">
          <template slot-scope="scope">
            <cf-button
              v-if="['router', 'link'].indexOf(column.type) != -1"
              :btn="column"
              :data="mixinSearchFormData(scope.row)">
              {{ getColumnValue(column, scope.row, scope.$index, 'list') }}
            </cf-button>
            <el-button
              v-else-if="column.type == 'inner'"
              :type="column.klass"
              @click="handleColumnInnerClick(column, scope.row)">
              {{ getColumnValue(column, scope.row, scope.$index, 'list') }}
            </el-button>
            <div
              v-else-if="column.type == 'sort'"
              class="datatable-column-sort">
              <i
                :class="['el-icon-arrow-up', scope.$index == 0 ? 'disabled' : '']"
                @click="handleColumnSortClick(column, scope.row, scope.$index, 'up')"/>
              <i
                :class="['el-icon-arrow-down', scope.$index == dataTable.columns.length - 1 ? 'disabled' : '']"
                @click="handleColumnSortClick(column, scope.row, scope.$index, 'down')"/>
              <el-popover
                v-if="dataTable.sortUrls.jump.url"
                popper-class="popper-column-sort"
                placement="top"
                width="200"
                trigger="click">
                <el-input
                  v-model="jumpOrder"
                  placeholder="排序编号，越小越前"/>
                <div class="action">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleSortJump(column, scope.row, scope.$index, 'jump')">确定</el-button>
                </div>
                <i

                  slot="reference"
                  :class="['el-icon-sort']"
                  @click="handleColumnSortClick(column, scope.row, scope.$index, 'jump')"/>
              </el-popover>
            </div>
            <img
              v-else-if="column.type == 'image'"
              :src="getColumnValue(column, scope.row, scope.$index, 'list')"
              class="cell-content-img">
            <div
              v-else-if="column.type == 'color'"
              class="cell-content-color">
              <span :style="{backgroundColor: getColumnValue(column, scope.row, scope.$index, 'list')}"/>
              <i>{{ getColumnValue(column, scope.row, scope.$index, 'list') }}</i>
            </div>
            <component
              v-else-if="column.type == 'other-component'"
              :is="column.componentName"
              :field="scope.row"
              :key="pageCode + 'other-component-' + column.componentName + Date.now()"/>
            <span
              v-else
              :a="column.type"
              :title="getColumnValue(column, scope.row, scope.$index, 'list-title')"
              class="cell-content-wrap">
              {{ getColumnValue(column, scope.row, scope.$index, 'list') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="dataTable.operations.show"
          key="operations"
          :label="dataTable.operations.title"
          :width="dataTable.operations.width"
          :align="dataTable.operations.align">
          <template slot-scope="scope">
            <template v-for="btn in dataTable.operations.buttons">
              <component
                v-if="btn.type == 'other-component'"
                :is="btn.componentName"
                :btn="btn"
                :field="scope.row"
                :key="pageCode + 'other-component-' + btn.componentName + Date.now()"/>
              <template v-else>
                <cf-button
                  v-if="!scope.row.isSummary && handleButtonVisible('dataTable', btn, scope.row)"
                  :btn="btn"
                  :data="mixinSearchFormData(scope.row)"
                  @click="handleButtonClick('dataTable', btn, scope.row)"/>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 直接加在上面一个 table 的数据里 -->
      <!-- <el-table :data="[dataTable.summary]"
        v-if="Object.keys(dataTable.summary).length > 0"
        class="data-table data-table-summary"
        :show-header="false">
        <el-table-column
          v-for="(column, columnIndex) in dataTable.columns"
          v-if="handleColumnVisible(column)"
          :key="columnIndex"
          :width="column.width"
          :align="column.align"
          :label="column.title">
          <template slot-scope="scope">
            <span>
              {{getColumnValue(column, scope.row, scope.$index, 'summary')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataTable.operations.show"
          :label="dataTable.operations.title"
          :width="dataTable.operations.width"
          :align="dataTable.operations.align">
        </el-table-column>
      </el-table> -->
      <el-pagination
        v-if="dataTable.pagination.show"
        :current-page="dataTable.pagination.currentPage"
        :page-sizes="dataTable.pagination.sizes"
        :page-size="dataTable.pagination.pageSize"
        :layout="dataTable.pagination.layout.join(', ')"
        :total="dataTable.total"
        class="data-table-pagination"
        @size-change="handleDataTableSizeChange"
        @current-change="handleDataTablePageChange"/>
      <div
        v-if="dataTable.batch.show"
        class="batch-action-wrap">
        <template v-for="btn in dataTable.batch.buttons">
          <template v-if="btn.componentName">
            <component
              :is="btn.componentName"
              :key="btn.options.name"/>
          </template>
          <template v-else>
            <el-button
              :key="btn.options.name"
              @click="handleButtonClick('dataTableBatch', btn, dataTable.batch)">
              {{ btn.text }}
            </el-button>
          </template>
        </template>
      </div>
    </el-card>

    <!-- 对话框 -->
    <el-dialog
      v-for="(dialog, dialogName) in dialogs"
      :key="dialogName"
      :title="dialog.title || dialog.titles[dialog.status]"
      :size="dialog.size"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      @close="handleDialogClose(dialogName, dialog)">
      <div v-loading="dialog.loading">
        <div v-if="dialog.type == 'template'">
          <tmpl-component
            :ref="'dialog-' + dialogName + '-dynamic'"
            :template="dialog.template"
            :css="dialog.css"
            :data="dialog.data"
            :props="dialog.props"/>
        </div>
        <template v-else>
          <el-form
            v-if="dialog.status == 'view'"
            :label-width="dialog.labelWidth">
            <template v-for="entry in dialog.fields">
              <component
                v-if="entry.type == 'other-component'"
                v-show="handleFieldVisible(entry, dialogEntities[dialogName], dialog)"
                v-model="entry.value"
                :is="entry.componentName"
                :field="entry"
                :key="pageCode + 'other-component-' + entry.componentName"/>
              <el-form-item
                v-else-if="entry.type != 'hidden'"
                :label="entry.title">
                <img
                  v-if="entry.type == 'image'"
                  :src="entry.value"
                  class="img-item">
                <div
                  v-else-if="entry.type == 'rich-text'"
                  v-html="entry.value"/>
                <span v-else>{{ entry.value | dialogViewFieldValue(entry) }}</span>
              </el-form-item>
            </template>
          </el-form>
          <el-form
            v-else
            :label-width="dialog.labelWidth"
            :ref="'form-' + dialogName"
            :model="dialogEntities[dialogName]">
            <template v-for="entry in dialog.fields">
              <input
                v-if="entry.type == 'hidden'"
                v-model="entry.value"
                type="hidden" >
              <component
                v-else-if="entry.type == 'other-component'"
                v-show="handleFieldVisible(entry, dialogEntities[dialogName], dialog)"
                v-model="entry.value"
                :is="entry.componentName"
                :ref="`otherComponent${entry.componentName}`"
                :field="entry"
                :form-data="dialogEntities[dialogName]"
                :key="pageCode + 'other-component-' + entry.componentName"/>
              <el-form-item
                v-else
                v-show="handleFieldVisible(entry, dialogEntities[dialogName], dialog)"
                :label="entry.title"
                :prop="Array.isArray(entry.key) ? entry.key[0] : entry.key"
                :rules="entry.rules || []">
                <form-item
                  v-model="entry.value"
                  :field="entry"
                  :extend="{
                    name: dialogName,
                    dialog: dialog,
                    model: dialogEntities[dialogName],
                  }"
                  origin="dialog"
                  @syncRefValueChange="syncRefValueChange"/>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </div>
      <div
        slot="footer"
        class="dialog-footer">
        <template v-if="dialog.buttons && dialog.buttons.length">
          <template v-for="btn in dialog.buttons">
            <cf-button
              v-if="handleButtonVisible('dialog', btn, dialog)"
              :btn="btn"
              :data="dialog.data"
              @click="handleButtonClick('dialog', btn, dialog)"/>
          </template>
        </template>
        <template v-else>
          <el-button
            @click="handleDialogButtonClick('cancel', dialogName, dialog)">
            关闭
          </el-button>
          <el-button
            v-if="handleDialogSaveButtonVisible(dialogName, dialog)"
            type="primary"
            @click="handleDialogButtonClick('accept', dialogName, dialog)">
            确认
          </el-button>
        </template>
      </div>
    </el-dialog>

    <el-dialog
      v-model="iframe.show"
      :size="iframe.size"
      :title="iframe.title"
      class="iframe-dialog">
      <iframe
        :src="iframe.src"
        frameborder="0"/>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="default"
          @click="iframe.show = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 导出报表 -->
    <div
      v-if="exports.show"
      class="export-wrapper">
      <div class="export-title">{{ exports.text }}</div>
      <i
        class="export-close el-icon-close"
        @click="exports.show = false"/>
      <el-progress
        :percentage="exports.percent"
        :status="exports.status"
        class="export-progress"/>
    </div>
  </div>
</template>

<script>
  import generatorScreen from './js/generatorScreen'

  export default generatorScreen
</script>

<style lang="stylus" scoped>
  .generator-wrapper
    width 100%
  .breadcrumb-wrap
    margin-bottom 2rem
  .page-title
    margin 0 0 2rem
  .box-card
    margin-bottom 2rem
  .search-form
    width 100%
    .el-date-editor
      width 100%
      min-width 245px
  .search-buttons
    text-align right
  .data-table
    width 100%
    img.cell-content-img
      max-height 100px
    .cell-content-color
      span
        width 80px
        height 20px
        display block
        margin 0 auto
      i
        font-style normal
    .datatable-column-sort
      .el-icon-arrow-up, .el-icon-arrow-down, .el-icon-sort
        color #20a0ff
        cursor pointer
        margin 0 10px
        &.disable
          color #eee
  .export-wrapper
    position absolute
    right 20px
    bottom 20px
    width 200px
    background #fff
    padding 8px 12px
    z-index 20
    border-radius 5px
    box-shadow 0 0 5px #9a9a9a
    .export-title
      text-align center
      margin-bottom 4px
    .export-close
      position absolute
      right 9px
      top 7px
      font-size 8px
      cursor pointer
  .text-list
    margin 0
    list-type none
  .iframe-dialog
    .el-dialog__body
      padding 8px
    iframe
      width 100%
      height 60vh
  .chart-wrap
    margin 0
    .echarts
      width 100%
  .chart-toggle-title
    display inline-block
    margin-left 30px
  .img-item
    width 200px
  .popper-column-sort
    .el-input
      margin-bottom 5px
    .action
      text-align right
  .search-buttons{
    margin-right: 200px;
  }
  .batch-action-wrap button{
      color: #fff;
      background-color: #409EFF;
      border-color: #409EFF;
  }
</style>
<style lang="stylus">
  // 隐藏 filter 的标签（sortable的时候不让点击头部可以排序）
  .data-table
    .el-table__column-filter-trigger
      display none
  .el-date-editor
    .el-input__icon
      width 20px
  .chart-compare-day
    text-align center
</style>
