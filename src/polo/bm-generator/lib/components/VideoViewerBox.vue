<template>
  <div :class="{
      'image-viewer-box': true,
      'is-full-screen': isFullScreen,
    }">
    <span class="close" v-if="!isFullScreen" @click="close"></span>
    <video class="img" :src="src" autoplay controls></video>
    <!-- <img class="enter" v-if="!isFullScreen" @click="isFullScreen = true"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTVDRDgxOTM0QzczMTFFNEE1ODBEN0VENTU4QTFBQjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTVDRDgxOTQ0QzczMTFFNEE1ODBEN0VENTU4QTFBQjgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNUNEODE5MTRDNzMxMUU0QTU4MEQ3RUQ1NThBMUFCOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNUNEODE5MjRDNzMxMUU0QTU4MEQ3RUQ1NThBMUFCOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnEA7z4AAAIuSURBVHja7Jpda8IwFIajV/sB259zd+IciPWrDj87bDt1X+oYshvvZOwvDraLLgUDnbSuOTk5KSOB9zLpeUxMznkTFuG3NhcDqocdDEMe71kBTuilqIAeApzQrGiAmHBCXlEAJxrghCamAaca4YSmpgA9AjihW2rAOiGc0DUk0DKDtW9G375AvRSWqEs4ezemNpkRAdzE9DHhFXFzwT7oBxrghhQH/RVXJedYQwNwlUOMIMBkwA7hcs2bojmJPiNZwLT0q53zwysFuBUA7uRmxCRnoa85fcuTlrkys88AwXU1Zzj1E+N3ZX+kJOBYIoi0/2QVcZOp5lyWWRofA64V7YWahmOiJjlzx4qZolIcKM/Y1sD88J7rk8vXlH/OuM64hsD+bgzI/nMrs3/eLKAFtIAW0AJaQAtoAS2gBTQJ2FPoH5dZO43x7RRKubj1RcH7CigoB4mCdKOh4N0o+q5vx5bFTKKzm2IpPCLCPSnehQRZplMgOXOYluEvq0HBQQ/+sg1DRcd5rwC3V3TQw7zGrw/0ROO2VAB8yPmNfkpfX9a69wH3cx2EJdoBQAbQy5dmhkcZKfqWEN81yvBimxTXZ46GY8LBCAwDsB3puwDtmAZsEVxht0wBNggfITSgQZYimLV9yfVBnDfH33ynqiYuDBQG59TvZBaES3RpapOZE8AtTB8ToUa4u6K8kwmLCIcJiL1c51hBYT9K3yLAbTEDwgaMDnf3UDgXO5gfAQYA/kaa5uk6WEcAAAAASUVORK5CYII="> -->
    <img class="exit" v-if="isFullScreen" @click="isFullScreen = false"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkFDRjUwRjI0QzczMTFFNEJEMURCQTlDMEQ1NjUwMjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkFDRjUwRjM0QzczMTFFNEJEMURCQTlDMEQ1NjUwMjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGQUNGNTBGMDRDNzMxMUU0QkQxREJBOUMwRDU2NTAyMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGQUNGNTBGMTRDNzMxMUU0QkQxREJBOUMwRDU2NTAyMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmMmKIIAAALISURBVHja7JvfTxNBEMevBF/Q8mAMf4D27/EPMD6REKI1tKVHCm3PYH9BVCoawpP2Sf4t/gNNND4R4zhL9sKx3u7Obgfbvdwk34QcM7vzgb2dZTtEABApGqHe5zynKkY99oh7gtqdY16R80R9rjrtwI31PSY5l7EbHrEbMvaTR2wvk3dDB/gC/rV9h0kGmbg1jyTXMvGHjitGtboK2AC99RzhhFU9AKvKGANCTMeQdysFHILdTMs1L54DEOTYOv8DQt4j4TgGmu3lTPJG48sFCHIOyrLMs6M0YNcDcmDw4wRUIfeIucbqJtMgBm6iXll8uAFBzrlJzLGlKxNN4LG7AARXuDxAoXbAgLGt0OcV/FAAW3njmiZ8GRBgXTfuaqS3c9QP1Ndoue056kL3zRVL8KNo+c2co2HJHAW0RCe6cXWTTQLcZMZUwFHAZWJoAxwxFdtFFvqhDnAMfLZIwFvLNR38DHht3QNwnTmHs7QOtlF15q37z3+KMZlguqyIyx784jvqN+Pgv0QFcoypoB4w5iB+eQ8r1+u0wLYSFdxKwBKwBCwBS8ASsAQsAcM1cSCtob4V8LB9Txy2BeBT1AnzD64qIV3sPuoncx5NsUSnqI9LsPS5X5eTa67MX9SHBbqySHSXTkkBABPbtWEvYMAe9eK3HyBg3/XTpdcBASauV/eptgMA3DaNa9uarwI4rFz51h5xXzoLAHAmc3X6+KwT4CbTob6D3YDLRNcGGDMV20UW+lgHSO0geobaWgDglpzbqSPLdVnuEJvhuAH3PTqyDlLAU2JA0+FYxwmY185J7ciaCucvnp2GpgM6F2Bi8Ke8Up9T52ODE6WPun8HgJSWalOX5LG6yUws75xN2fd43pbmrkNcg/IRdqp3Gae2R5JTGTtPU/rUIzbbQPjWVuhnqA/g394vJqt5xNVgvn8rOJW533r+V4ABANsFyxkv8SUEAAAAAElFTkSuQmCC" />
  </div>
</template>

<script>
export default {
  name: 'ImageViewerBox',

  props: {
    src: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isFullScreen: false,
      mask: null,
    }
  },

  methods: {
    close() {
      this.$emit('close')
    },
  },

  mounted() {
    this.mask = document.createElement('div')
    this.mask.classList.add('image-viewer-box-mask')
    document.querySelector('body').appendChild(this.mask)
  },

  beforeDestroy() {
    document.querySelector('body').removeChild(this.mask)
  },
}
</script>

<style lang="stylus">
  .image-viewer-box-mask
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background rgba(0, 0, 0, 0.6)
    z-index 9998

  .image-viewer-box
    position fixed
    height: 50%;
    top 50%
    left 50%
    transform translate(-50%, -50%)
    background #fff
    padding 12px
    z-index 9999

    &.is-full-screen
      top: 50%;
      left: 50%;
      height: 80%;
      padding: 0;
      margin-left: 0;
      background: #000;

      .img
        display block
        width auto
        height 100%
        margin 0 auto

    .img
      height 100%

    > span.close
      position absolute
      width 28px
      height 28px
      right -33px
      top 0
      background url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAMAAAC6CgRnAAAAPFBMVEX///8AAAD9/f2CgoKAgIAAAAAAAAAAAABLS0sAAAAAAACqqqqqqqq6urpKSkpISEgAAAC7u7u5ubn////zbsMcAAAAE3RSTlMASv6rqwAWS5YMC7/AyZWVFcrJCYaKfAAAAHhJREFUeF590kkOgCAQRFEaFVGc+/53FYmbz6JqBbyQMFSYuoQuV+iTflnstI7ssLXRvMWRaEMs84e2uVckuZe6knL0hiSPObXhj6ChzoEkIolIIpKIO4joICAIeDd7QGIfCCjOKe9HEk8mnxpIAup/F31RPZP9fAG3IAyBSJe0igAAAABJRU5ErkJggg==')
      cursor pointer
      opacity .5
      transition opacity .5s
      &:hover
        opacity 1
    .enter, .exit
      position absolute
      width 28px
      height 28px
      right 8px
      bottom 8px
      opacity .5
      cursor pointer
      transition opacity .5s
      &:hover
        opacity 1
    .enter
      right 28px
      bottom 28px
</style>
