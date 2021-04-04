<template>
  <div class="doc-content">
    <iframe
      :src="src"
      frameborder="0"
      class="doc-content"
      name="doc"
      @load="changeAnchor"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
  },
  watch: {
    src() {
      // setTimeout(this.changeAnchor, 100);
    },
  },
  methods: {
    changeAnchor() {
      var iframe = window.document.querySelector("iframe");
      var url = new URL(document.location);
      for (const a of iframe.contentDocument.querySelectorAll("a")) {
        try {
          var aURL = new URL(a.href);
        } catch (e) {
          break;
        }
        if (url.origin != aURL.origin) a.target = "_blank";
        // console.log(a.target);
      }
    },
  },
};
</script>

<style scoped>
.doc-content {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
</style>