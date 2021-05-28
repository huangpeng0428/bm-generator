<script>
import Helper from "../helper";
import Config from "../config";

export default {
  name: "FormItem",

  inject: ["screen"],

  provide() {
    return {
      screen: this.screen,
    };
  },

  props: {
    value: {
      type: String,
      required: true,
    },
    field: {
      type: Object,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    extend: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  /* eslint-disable no-unused-vars */
  methods: {
    getRawValue(field) {
      if (typeof field.value == "string" && field.value != "") {
        return field.value;
      }
      return field.placeholder;
    },
    handleValueChange(val) {
      if (Helper.isUndef(val)) return;
      if (val === null) val = "";

      let v = val;
      if (this.field.type === "date") {
        v = Helper.formatDate(val, this.field.options.format);
      }
      if (
        this.field.type === "daterange" ||
        this.field.type === "datetimerange"
      ) {
        if (v[0] && v[1]) {
          v = [
            Helper.formatDate(
              v[0],
              this.field.options.format,
              this.field.dataType
            ),
            Helper.formatDate(
              v[1],
              this.field.options.format,
              this.field.dataType
            ),
          ];
        }
        this.field.options.value = val;
      }

      if (!Array.isArray(v)) {
        switch (this.field.dataType) {
          case "number":
            if (Object.prototype.toString.call(v) === "[object Date]") {
              v = v.getTime();
            } else if (v) {
              v = Number(v);
            }
            if (isNaN(v)) {
              console.error("表单值转换number类型失败", val, this.field);
            }
            break;
          case "boolean":
            v = v === "true" || v === "True" || v === true;
            break;
          case "string":
            if (Object.prototype.toString.call(v) === "[object Date]") {
              v = Helper.formatDate(v, this.field.options.format);
            }
            break;
          default:
            break;
        }
      }

      this.$emit("input", v);

      // 有引用字段
      if (this.field.options.ref) {
        // 设置了引用属性后，由控件自主触发引用变更
        if (!this.field.options.refProp) {
          this.emitRefValueChange(this.field.options.ref, v);
        }
      }

      // 是否立即执行 搜索
      if (this.field.options.immediate) {
        if (this.field.type == "dropdown") {
          this.$emit(
            "fieldChangeDoSearch",
            this.field.options.data.filter((p) => p.value == v)[0]
          );
        }
      } else if (this.field.type == "table-column-hidden") {
        // 针对 popover 控制列，单独处理
        this.$emit(
          "fieldChangeDoSearch",
          {
            columnFields: val,
          },
          false
        );
      }
    },

    emitRefValueChange(ref, val) {
      this.$emit("syncRefValueChange", ref, val, this.origin, this.extend);
    },

    handleRefValueChange(val) {
      if (this.field.options.ref) {
        this.emitRefValueChange(this.field.options.ref, val);
      }
    },

    handleInputBlur(evt) {
      if (this.field.options.blur) {
        /* eslint-disable no-new-func */
        const fn = new Function("value", "field", this.field.options.blur).bind(
          this
        );
        fn(this.field.value, this.field);
        /* eslint-enable no-new-func */
      }
    },

    handleSwitchValueChange(isChecked) {
      this.handleValueChange(
        isChecked ? this.field.options.on.value : this.field.options.off.value
      );
      this.field.options.value = isChecked;
    },

    renderDropdown(h) {
      return (
        <cf-select
          value={this.field.value}
          onInput={this.handleValueChange}
          entry={this.field}
          extend={this.extend}
          placeholder={this.field.placeholder || "全部"}
        ></cf-select>
      );
    },

    renderCascader(h) {
      return (
        <cf-cascader
          value={this.field.value}
          onInput={this.handleValueChange}
          entry={this.field}
        ></cf-cascader>
      );
    },

    getDatePickerDisableDate(opt, filter) {
      let disabledDate;
      if (opt === "beforeToday") {
        return (time) => time.getTime() < Date.now();
      }
      if (opt == "afterToday") {
        return (time) => time.getTime() >= Date.now();
      }
      if (opt == "custom" && filter) {
        /* eslint-disable no-new-func */
        return new Function("time", filter);
        /* eslint-enable no-new-func */
      }
    },

    renderDate(h) {
      const pickerOptions = {};

      if (
        this.field.options &&
        this.field.options["disabledDate"] &&
        typeof this.field.options["disabledDate"] == "string"
      ) {
        pickerOptions.disabledDate = this.getDatePickerDisableDate(
          this.field.options["disabledDate"],
          this.field.options["disabledDateFilter"]
        );
        if (!pickerOptions.disabledDate) {
          delete pickerOptions.disabledDate;
        }
      }

      return (
        <el-date-picker
          value={this.field.value}
          onInput={this.handleValueChange}
          type={this.field.options.type}
          placeholder={this.field.placeholder || "选择日期"}
          pickerOptions={pickerOptions}
          format={this.field.options.format}
          disabled={this.field.disabled}
        ></el-date-picker>
      );
    },

    renderDateRange(h) {
      const pickerOptions = {};

      if (
        this.field.options &&
        this.field.options["disabledDate"] &&
        typeof this.field.options["disabledDate"] == "string"
      ) {
        pickerOptions.disabledDate = this.getDatePickerDisableDate(
          this.field.options["disabledDate"],
          this.field.options["disabledDateFilter"]
        );
        if (!pickerOptions.disabledDate) {
          delete pickerOptions.disabledDate;
        }
      }

      if (this.field.options && this.field.options.shortcuts) {
        if (!Array.isArray(pickerOptions.shortcuts)) {
          pickerOptions.shortcuts = [];
        }
        const notIncludeToday = this.field.options.notIncludeToday ? 1 : 0;
        pickerOptions.shortcuts = this.field.options.shortcuts.map(
          (shortcut) => ({
            text: Config.daterangeShortcuts[shortcut] || "",
            onClick(picker) {
              picker.$emit(
                "pick",
                Helper.getDateRange(shortcut, notIncludeToday)
              );
            },
          })
        );
      }

      return (
        <el-date-picker
          value={this.field.options.value}
          onInput={this.handleValueChange}
          type={this.field.type}
          placeholder={this.field.placeholder || "选择日期范围"}
          pickerOptions={pickerOptions}
          format={this.field.options.format}
          disabled={this.field.disabled}
        ></el-date-picker>
      );
    },
  },

  render(h) {
    let ele = null;
    switch (this.field.type) {
      case "raw":
        ele = <span>{this.getRawValue(this.field)}</span>;
        break;
      case "enum":
        ele = <span>{this.field.options.maps[this.field.value]}</span>;
        break;
      case "image":
        ele = <image-viewer src={this.field.value}></image-viewer>;
        break;
      case "text-list":
        ele = (
          <ul class="text-list">
            {(this.field.value || []).map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        );
        break;
      case "text":
      case "password":
        ele = (
          <el-input
            type={this.field.type}
            value={this.field.value}
            onInput={this.handleValueChange}
            onBlur={this.handleInputBlur}
            disabled={this.field.disabled}
            placeholder={this.field.placeholder}
          ></el-input>
        );
        break;
      case "textarea":
        ele = (
          <el-input
            type="textarea"
            value={this.field.value}
            onInput={this.handleValueChange}
            rows={4}
            disabled={this.disabled}
            placeholder={this.field.placeholder}
          ></el-input>
        );
        break;
      case "dropdown":
        ele = this.renderDropdown(h);
        break;
      case "switch":
        ele = h("el-switch", {
          props: {
            value: this.field.options.value,
            onText: this.field.options.on.text,
            offText: this.field.options.off.text,
            disabled: this.field.disabled,
          },
          on: {
            input: this.handleSwitchValueChange,
          },
        });
        break;
      case "date":
        ele = this.renderDate(h);
        break;
      case "datetime":
        ele = (
          <el-date-picker
            value={this.field.value}
            onInput={this.handleValueChange}
            type={this.field.type}
            placeholder={this.field.placeholder || "选择日期"}
            format={this.field.options.format}
            disabled={this.field.disabled}
          ></el-date-picker>
        );
        break;
      case "time":
        ele = (
          <el-time-select
            value={this.field.value}
            onInput={this.handleValueChange}
            type={this.field.type}
            picker-options={{
              start: "00:10",
              step: "00:10",
              end: "24:00",
            }}
            placeholder="选择时间"
          ></el-time-select>
        );
        break;
      case "daterange":
      case "datetimerange":
        ele = this.renderDateRange(h);
        break;
      case "cascader":
        ele = this.renderCascader(h);
        break;
      case "search-input":
        ele = (
          <cf-search-input
            value={this.field.value}
            onInput={this.handleValueChange}
            entry={this.field}
            placeholder={this.field.placeholder || "全部"}
          ></cf-search-input>
        );
        break;
      case "autocomplete":
        ele = (
          <cf-autocomplete
            value={this.field.value}
            onInput={this.handleValueChange}
            entry={this.field}
            onRefValueChange={this.handleRefValueChange}
          ></cf-autocomplete>
        );
        break;
      case "checkbox-group":
        ele = (
          <cf-checkbox-group
            value={this.field.value}
            onInput={this.handleValueChange}
            entry={this.field}
            extend={this.extend}
            origin={this.origin}
          ></cf-checkbox-group>
        );
        break;
      case "rich-text":
        ele = (
          <rich-text-editor
            value={this.field.value}
            onInput={this.handleValueChange}
            placeholder={this.field.placeholder}
            options={this.field.options}
            disabled={this.field.disabled}
          ></rich-text-editor>
        );
        break;
      case "custom":
        ele = (
          <custom-component
            value={this.field.value}
            onInput={this.handleValueChange}
            config={this.field.options.config}
            extend={this.extend}
            disabled={this.field.disabled}
          ></custom-component>
        );
        break;
      case "upload":
        ele = (
          <cf-upload
            value={this.field.value}
            onInput={this.handleValueChange}
            disabled={this.field.disabled}
            entry={this.field}
          ></cf-upload>
        );
        break;
      case "table-column-hidden":
        ele = (
          <cf-popover-table-column-hidden
            value={this.field.value}
            onInput={this.handleValueChange}
            extend={this.extend}
            entry={this.field}
          ></cf-popover-table-column-hidden>
        );
        break;
      case "radio-group":
        ele = (
          <cf-radio-group
            value={this.field.value}
            onInput={this.handleValueChange}
            extend={this.extend}
            entry={this.field}
          ></cf-radio-group>
        );
        break;
      // case 'other-component':
      //   ele = (<component
      //       is={this.field.componentName}
      //       field={this.field}
      //       ></component>)
      //   break
      case "color":
        ele = (
          <cf-color-picker
            value={this.field.value}
            onInput={this.handleValueChange}
            extend={this.extend}
            entry={this.field}
          ></cf-color-picker>
        );
        break;
      default:
        console.error("找不到该种类型的控件", this.field.type);
        break;
    }
    return ele;
  },
  /* eslint-enable no-unused-vars */
};
</script>
