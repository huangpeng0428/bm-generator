/*
 * @Date: 2020-03-30 17:47:59
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-03-31 17:06:40
 */
import expose from './expose';
 export default {
   host: expose.HOST,

   metaTypes: {
     page: 0
   },

   fieldTypes: {
    text: '输入框',
    hidden: '隐藏值',
    textarea: '多行文本',
    dropdown: '下拉菜单',
    date: '日期',
    datetime: '日期时间',
    daterange: '日期区间',
    datetimerange: '日期时间区间',
    cascader: '级联菜单',
    color: '颜色',
    switch: '开关',
    'search-input': '搜索输入',
    autocomplete: '输入建议',
    'checkbox-group': '多选框组',
    'radio-group': '单选框组',
    upload: '上传文件',
    'rich-text': '富文本',
    custom: '自定义',
    password: '密码',
    raw: '文本显示',
    image: '图片',
    enum: '枚举',
    'text-list': '文本列表',
    'table-column-hidden': '数据列表列隐藏控制',
    'other-component': '外部组件'
  },

   setup: {
     page: {
       title: '',
       url: '',
       css: '',
       navs: []
     },
     searchForm: {
       title: '搜索',
       labelWidth: '120px',
       immediate: true,
       urls: {
         list: {},
         chart: {},
         total: {},
         summary: {}
       },
       fields: [],
       buttons: []
     }
   }
 };
