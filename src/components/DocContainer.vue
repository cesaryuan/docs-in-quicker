<template>
  <el-container>
    <el-aside style="width: 30%">
      <doc-menu
      class="doc-menu"
       v-model="selectedItemIndex"
        :items="items"
        :itemsHighlightIndexes="itemsHighlightIndexes"
       
        @scrolltobottom="$emit('scrolltobottom')"
        :highlightWord="searchWord"
      ></doc-menu>
    </el-aside>
    <el-main style="width: 70%">
      <doc-content :src="src"></doc-content>
    </el-main>
  </el-container>
</template>

<script>
import DocContent from "./DocContent.vue";
import DocMenu from "./DocMenu.vue";

export default {
  props: {
    items: Array,
    docsBasePath: String,
    searchWord: String,
    itemsHighlightIndexes: Array
  },
  data() {
    return {
      selectedItemIndex: 0,
    };
  },
  computed: {
    src() {
      if(this.items.length > this.selectedItemIndex)
        return this.docsBasePath + this.items[this.selectedItemIndex].p;
      else
        return null;
    },
  },
  watch: {
    searchWord(){
      this.selectedItemIndex = 0
    }
  },
  components: {
    DocMenu,
    DocContent,
  },
};
</script>

<style>
.doc-menu{
  height: 100%;
}
</style>