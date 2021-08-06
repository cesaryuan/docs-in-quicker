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
import _ from "lodash";
import localforage from "localforage";
import Fuse from "fuse.js";
var $quickerSync = window.$quickerSync;

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
      matched: [],
      itemsHighlightIndexes: null,
      searchWord: "",
      fuzzySearch: false,
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
    handleWord: function (searchWord) {
      return searchWord.replace("。", ".").toLowerCase();
    },
    getMatched2(searchWord, maxNum) {
      if (searchWord == "") return [this.allItems.slice(0, maxNum), undefined];
      else {
        var matched = [];
        let highlightIndexs = [];
        for (const key in this.allItems) {
          if (matched.length > maxNum) break;
          if (Object.hasOwnProperty.call(this.allItems, key)) {
            const element = this.allItems[key];
            let startIndexT = element.t.toLowerCase().indexOf(searchWord);
            let startIndexD = element.d.toLowerCase().indexOf(searchWord);
            if (startIndexT != -1 || startIndexD != -1) {
              matched.push(element);
              highlightIndexs.push({
                t: [[startIndexT, startIndexT + searchWord.length - 1]],
                d: [[startIndexD, startIndexD + searchWord.length - 1]],
              });
            }
          }
        }
        return [matched, highlightIndexs];
      }
    },
    getMatchedByFuse(searchWord, maxNum) {
      if (searchWord === "") return [this.allItems.slice(0, maxNum), undefined];
      var result = this.fuse.search(searchWord).slice(0, maxNum);
      return [
        result.map((x) => x.item),
        result.map((x) => {
          var o = {};
          for (let item of x.matches) {
            o[item.key] = item.indices;
          }
          return o;
        }),
      ];
    },
    debouceGetMatched: _.debounce(function () {
      let maxNum = this.maxNum;
      if (maxNum != 0) {
        let result = [];
        if (this.fuzzySearch)
          result = this.getMatchedByFuse(
            this.handleWord(this.searchWord),
            maxNum
          );
        else
          result = this.getMatched2(this.handleWord(this.searchWord), maxNum);
        this.matched = result[0];
        this.itemsHighlightIndexes = result[1];
      }
    }, 50),
  },
  watch: {
    searchWord() {
      this.maxNum = 50;
      this.debouceGetMatched();
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
        vue.matched = vue.allItems.slice(0, vue.maxNum);
        vue.itemsHighlightIndexes = undefined;
        vue.fuse = new Fuse(vue.allItems, {
          keys: ["t"],
          shouldSort: true,
          includeMatches: true,
          threshold: 0.4,
        });
        if (vue.allItems.length < 6000) vue.fuzzySearch = true;
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
