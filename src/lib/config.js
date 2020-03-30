import expose from './expose';
 export default {
   host: expose.HOST,

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
