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
