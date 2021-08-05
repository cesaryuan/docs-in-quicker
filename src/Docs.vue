<template>
  <div id="app">
    <el-container class="docs">
      <el-header
        ><doc-search-bar
          class="search-bar"
          v-model="searchWord"
        ></doc-search-bar
      ></el-header>
      <doc-container
        :docsBasePath="docsBasePath"
        class="doc-container"
        :items="matched"
        @scrolltobottom="debouceGetMatched((maxNum += 20))"
        :searchWord="searchWord"
      ></doc-container>
    </el-container>
  </div>
</template>

<script>
import DocContainer from "./components/DocContainer.vue";
import DocSearchBar from "./components/DocSearchBar.vue";
import localforage from "localforage";
var $quickerSync = window.$quickerSync;
// import indexes from "../public/docsets/HTML/indexes.json";
// var temp = JSON.stringify([]);

// import Darkmode from 'darkmode-js';

// var FlexSearch = require("flexsearch");
// var findex = new FlexSearch("balance");
// for (let index = 0; index < indexes.length; index++) {
//   const element = indexes[index];
//   findex.add(index, element.t);
// }

export default {
  name: "App",
  components: {
    DocSearchBar,
    DocContainer,
  },
  data() {
    var lang = $quickerSync ? $quickerSync.getVar("语言") : "HTML";
    var allItems = JSON.parse(($quickerSync ? $quickerSync.getVar("indexesJson") : (window.localStorage.getItem(lang) || '[]')));
    var docsBasePath = $quickerSync ? $quickerSync.getVar("BasePath") : "./docsets/" + lang + "/";
    if(!docsBasePath.endsWith('/'))
      docsBasePath = docsBasePath + '/';
    console.log(lang);
    console.log(allItems.length);
    window.localStorage.getItem(lang) || window.localStorage.setItem(lang, JSON.stringify(allItems));
    return {
      lang,
      allItems,
      matched: allItems.slice(0, 50),
      searchWord: "",
      maxNum: 50, 
      docsBasePath,
    };
  },
  methods: {
    init() {},
    debouceGetMatched(maxNum) {
      // eslint-disable-next-line no-debugger
      // debugger;
      this.matched = this.getMatched2(maxNum);
    },
    // getMatched() {
    //   var allIndexes = findex.search(this.searchWord, 20);
    //   if (allIndexes.length > 0) return allIndexes.map((i) => this.allItems[i]);
    //   else return [];
    // },
    handleWord: function(searchWord){
      return searchWord.replace("。", ".").toLowerCase();
    },
    getMatched2(maxNum) {
      var matched = [];
      for (const key in this.allItems) {
        if (matched.length > maxNum) break;
        if (Object.hasOwnProperty.call(this.allItems, key)) {
          const element = this.allItems[key];
          if ((element.t + element.d).toLowerCase().includes(this.handleWord(this.searchWord))) {
            matched.push(element);
          }
        }
      }
      return matched;
    },
  },
  watch: {
    searchWord() {
      this.maxNum = 50;
      this.debouceGetMatched(this.maxNum);
    },
  },
  mounted(){
    // new Darkmode().showWidget();
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.search-bar {
  height: 50px;
  margin-top: 10px;
}
.docs {
  height: 100%;
}

.doc-container {
  height: calc(100% - 60px);
}
#app {
  height: 100%;
}
</style>
