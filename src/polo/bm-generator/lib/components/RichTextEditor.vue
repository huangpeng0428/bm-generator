<template>
  <div class="rich-text-editor"/>
</template>

<script>
import Quill from "quill";
import Delta from "quill-delta";
import Config from "../config";

// import ImageResize from 'quill-image-resize-module'

// Quill.register('modules/imageResize', ImageResize)

export default {
  name: "RichTextEditor",

  props: {
    value: {
      type: String,
      required: true,
    },

    placeholder: {
      type: String,
      default: "",
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    options: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      editor: null,
      toolbar: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction
        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ["clean"], // remove formatting button
        ["link", { image: ["upload", "external"] }, "video"], // link and image, video
      ],
    };
  },

  watch: {
    value(val) {
      if (this.editor) {
        if (!val) {
          this.editor.setText("");
        } else if (val !== this.content) {
          this.editor.clipboard.dangerouslyPasteHTML(val);
        }
      }
    },

    disabled(val) {
      if (this.editor) {
        this.editor.enable(!val);
      }
    },
  },

  mounted() {
    this.editor = new Quill(this.$el, {
      modules: {
        toolbar: {
          container: this.toolbar,
          handlers: {
            image: (type) => {
              if (type === "upload") {
                let fileInput = this.editor.container.querySelector(
                  "input.ql-image[type=file]"
                );
                if (fileInput === null) {
                  fileInput = document.createElement("input");
                  fileInput.setAttribute("type", "file");
                  fileInput.setAttribute("accept", Config.upload.accept);
                  fileInput.classList.add("ql-image");
                  fileInput.addEventListener("change", () => {
                    if (fileInput.files != null && fileInput.files[0] != null) {
                      this.uploadImage(fileInput.files[0], () => {
                        fileInput.value = "";
                      });
                    }
                  });
                  this.editor.container.appendChild(fileInput);
                }
                fileInput.click();
              } else {
                this.editor.theme.tooltip.edit("image");
              }
            },
          },
        },

        // imageResize: {
        //   toolbarButtonStyles: {
        //     display: 'none'
        //   }
        // }
      },
      placeholder: this.placeholder || "输入内容...",
      theme: "snow",
    });

    this.appendImageIcon();

    this.editor.on("text-change", () => {
      let content = this.editor.root.innerHTML;
      if (content === "<p><br></p>") content = "";
      this.handleValueChange(this.editor.root.innerHTML);
    });

    this.content = this.value;
    if (this.content) {
      this.editor.clipboard.dangerouslyPasteHTML(this.content);
    }
    const oldSave = this.editor.theme.tooltip.save.bind(
      this.editor.theme.tooltip
    );
    const instance = this;
    this.editor.theme.tooltip.save = function quillTooltipSave() {
      const url = this.textbox.value;
      if (this.root.getAttribute("data-mode") === "image") {
        if (url) {
          instance.appendImage(url);
        }
        this.textbox.value = "";
        this.hide();
      } else {
        oldSave();
      }
    }.bind(this.editor.theme.tooltip);
    this.editor.enable(!this.disabled);
  },

  methods: {
    handleValueChange(val) {
      this.content = val;
      this.$emit("input", val);
    },

    appendImage(url) {
      const range = this.editor.getSelection(true);
      this.editor.updateContents(
        new Delta()
          .retain(range.index)
          .delete(range.length)
          .insert({ image: url }),
        "user"
      );
    },

    uploadImage(file, cb = function uploadImageCallback() {}) {
      const data = new FormData();
      let uploadUrl = Config.upload.action;
      if (this.options.hasOwnProperty("action") && this.options.action) {
        uploadUrl = this.options.action;
      }
      data.append(Config.upload.name, file);
      this.$request({
        url: uploadUrl,
        method: "POST",
        data,
      }).then((res) => {
        if (res.code === 200) {
          const url = res.value[0].url;
          this.appendImage(Config.upload.getImageSrc(url));
        }
        cb(res);
      });
    },

    appendImageIcon() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewbox", "0 0 18 18");
      svg.setAttribute("id", "ql-image-svg");
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("height", "10");
      rect.setAttribute("width", "12");
      rect.setAttribute("x", "3");
      rect.setAttribute("y", "4");
      rect.classList.add("ql-stroke");
      svg.appendChild(rect);
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "6");
      circle.setAttribute("cy", "7");
      circle.setAttribute("r", "1");
      circle.classList.add("ql-fill");
      svg.appendChild(circle);
      const polyline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );
      polyline.setAttribute(
        "points",
        "5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"
      );
      polyline.classList.add("ql-even");
      polyline.classList.add("ql-fill");
      svg.appendChild(polyline);
      const parentNode = document.querySelector(
        ".ql-toolbar .ql-image .ql-picker-label"
      );
      parentNode.insertBefore(svg, parentNode.firstChild);
    },
  },
};
</script>

<style lang="stylus">
.rich-text-editor {
  width: 100%;
  height: 400px !important;
}

.ql-snow {
  &.ql-toolbar {
    line-height: 1;

    .ql-image {
      width: 46px;

      #ql-image-svg {
        position: static;
        margin-top: 2px;
        height: 18px;
      }

      .ql-picker-item[data-value='upload']::before {
        content: '上传图片';
      }

      .ql-picker-item[data-value='external']::before {
        content: '外链图片';
      }
    }
  }

  .ql-tooltip[data-mode='image']::before {
    content: '图片路径';
  }

  input.ql-image[type='file'] {
    display: none;
  }
}
</style>
