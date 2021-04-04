<template>
  <el-input
    class="search-bar"
    v-model="vv"
    placeholder="在此输入搜索词..."
    size="normal"
    clearable
    autofocus
    onblur="this.focus()"
    spellcheck="false"
  ></el-input>
</template>

<script>
export default {
  model: {
    prop: "vv",
    event: "input",
  },
  props: {
    value: String,
  },
  data() {
    return {
      vv: "",
    };
  },
  watch: {
    vv() {
      this.$emit("input", this.vv);
    },
  }
};
</script>

<style>
.search-bar input {
  font-family: consolas, "pingfang sc";
  text-decoration: none;
}
</style>