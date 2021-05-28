/*
 * @Date: 2020-07-28 14:39:36
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-28 16:02:04
 */
import Vue from 'vue';
import Helper from './helper';
import request from './request';
import bus from './bus';
import RichTextEditor from './components/RichTextEditor';
import ImageViewer from './components/ImageViewer';
import CfCheckboxGroup from './components/CfCheckboxGroup';
import CfNavs from './components/CfNavs';
import CfButton from './components/CfButton';
import CfSelect from './components/CfSelect';
import CfCascader from './components/CfCascader';
import CfSearchInput from './components/CfSearchInput';
import CfAutocomplete from './components/CfAutocomplete';
import CfAutocompleteItem from './components/CfAutocompleteItem';
import CfSimpTree from './components/CfSimpTree';
import CfUpload from './components/CfUpload';
import TmplComponent from './components/TmplComponent';
import CustomComponent from './components/CustomComponent';
import CfPopoverTableColumnHidden from './components/CfPopoverTableColumnHidden';
import CfRadioGroup from './components/CfRadioGroup';
import CfColorPicker from './components/CfColorPicker';
import VideoViewer from './components/VideoViewer';

export default {
  installComponents() {
    Vue.component('ImageViewer', ImageViewer);
    Vue.component('RichTextEditor', RichTextEditor);
    Vue.component('CfNavs', CfNavs);
    Vue.component('CfButton', CfButton);
    Vue.component('CfSelect', CfSelect);
    Vue.component('CfCheckboxGroup', CfCheckboxGroup);
    Vue.component('CfCascader', CfCascader);
    Vue.component('CfSearchInput', CfSearchInput);
    Vue.component('CfAutocomplete', CfAutocomplete);
    Vue.component('CfAutocompleteItem', CfAutocompleteItem);
    Vue.component('CfUpload', CfUpload);
    Vue.component('CfSimpTree', CfSimpTree);
    Vue.component('TmplComponent', TmplComponent);
    Vue.component('CustomComponent', CustomComponent);
    Vue.component('CfPopoverTableColumnHidden', CfPopoverTableColumnHidden);
    Vue.component('CfRadioGroup', CfRadioGroup);
    Vue.component('CfColorPicker', CfColorPicker);
    Vue.component('VideoViewer', VideoViewer);
  },

  /* eslint-disable no-shadow */
  /* eslint-disable no-param-reassign */
  installPlugins() {
    return {
      install(Vue) {
        Vue.prototype.$util = Helper;
        Vue.prototype.$request = request;
        Vue.prototype.$bus = bus;
      },
    };
  },
  /* eslint-enable no-shadow */
  /* eslint-enable no-param-reassign */
};
