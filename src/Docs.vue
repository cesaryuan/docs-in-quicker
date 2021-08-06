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
        class="doc-container"
        :docsBasePath="docsBasePath"
        :items="matched"
        :itemsHighlightIndexes="itemsHighlightIndexes"
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
import Fuse from "fuse.js";
var $quickerSync = window.$quickerSync;
// import indexes from "../public/docsets/HTML/indexes.json";
// var temp = JSON.stringify([]);

// import Darkmode from 'darkmode-js';


export default {
  name: "App",
  components: {
    DocSearchBar,
    DocContainer,
  },
  data() {
    var lang = $quickerSync ? $quickerSync.getVar("语言") : "HTML";
    var allItems = [];

    var docsBasePath = $quickerSync
      ? $quickerSync.getVar("BasePath")
      : "./docsets/" + lang + "/";
    if (!docsBasePath.endsWith("/")) docsBasePath = docsBasePath + "/";

    console.log(lang);
    console.log(allItems.length);

    return {
      lang,
      allItems,
      matched: allItems.slice(0, 50),
      itemsHighlightIndexes: null,
      searchWord: "",
      maxNum: 50,
      docsBasePath,
      fuse: new Fuse(allItems, {
        keys: ["t", "d"],
        shouldSort: true,
      }),
    };
  },
  methods: {
    init() {},
    debouceGetMatched(maxNum) {
      // this.matched = this.getMatched2(maxNum);
      if (maxNum != 0){
        let result = this.getMatchedByFuse(this.searchWord, maxNum);
        this.matched = result[0];
        this.itemsHighlightIndexes = result[1];
      }
    },
    handleWord: function (searchWord) {
      return searchWord.replace("。", ".").toLowerCase();
    },
    getMatched2(maxNum) {
      var matched = [];
      for (const key in this.allItems) {
        if (matched.length > maxNum) break;
        if (Object.hasOwnProperty.call(this.allItems, key)) {
          const element = this.allItems[key];
          if (
            (element.t + element.d)
              .toLowerCase()
              .includes(this.handleWord(this.searchWord))
          ) {
            matched.push(element);
          }
        }
      }
      return matched;
    },
    getMatchedByFuse(searchWord, maxNum) {
      if (searchWord === "") return [this.allItems.slice(0, maxNum), null];
      var result = this.fuse
        .search(this.handleWord(searchWord))
        .slice(0, maxNum);
      return [result.map((x) => x.item), result.map(x => {
        var o = {};
        for (let item of x.matches){
          o[item.key] = item.indices;
        }
        return o;
      })];
    },
  },
  watch: {
    searchWord() {
      this.maxNum = 50;
      this.debouceGetMatched(this.maxNum);
    },
  },
  beforeCreate() {
    var vue = this;
    localforage
      .getItem(vue.lang)
      .then(function (value) {
        if (value !== null) vue.allItems = value;
        else {
          vue.allItems = JSON.parse(
            ($quickerSync && $quickerSync.getVar("indexesJson")) ||
              window.localStorage.getItem(vue.lang)
          );
          localforage.setItem(vue.lang, vue.allItems);
        }
      })
      .catch(function (e) {
        console.log(e);
        vue.allItems = JSON.parse(
          ($quickerSync && $quickerSync.getVar("indexesJson")) ||
            window.localStorage.getItem(vue.lang)
        );
        localforage.setItem(vue.lang, vue.allItems);
      })
      .finally(function () {
        vue.matched = vue.allItems.slice(0, 50);
        vue.fuse = new Fuse(vue.allItems, {
          keys: ["t", "d"],
          shouldSort: true,
          includeMatches: true,
        });
      });
  },
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
