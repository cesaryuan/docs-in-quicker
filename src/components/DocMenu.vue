<template>
  <div v-infinite-scroll="load" v-loading="items.length == 0" class="doc-menu" ref="menu">
    <div
      v-for="(item, index) in items"
      :class="{
        'doc-item': true,
        'doc-item-selected': index == currentIndex,
      }"
      :key="index"
      ref="items"
      @click="currentIndex = index"
    >
      <div class="doc-item-t" v-html="highlightV2(item.t, itemsHighlightIndexes && itemsHighlightIndexes[index]['t'])"></div>
      <div class="doc-item-d" v-html="highlightV2(item.d, itemsHighlightIndexes && itemsHighlightIndexes[index]['d'])"></div>
    </div>
    <!-- <div v-if="items.length == 0">没有找到~</div> -->
  </div>
</template>

<script>

export default {
  model: {
    prop: "selectedItemIndex",
    event: "selected",
  },
  props: {
    items: Array,
    itemsIndexes: Array,
    selectedItemIndex: Number,
    highlightWord: String,
    itemsHighlightIndexes: Array
  },
  data() {
    return {
      currentIndex: this.selectedItemIndex,
    };
  },
  methods: {
    itemSelect(index) {
      this.$emit("selected", index);
    },
    load(){
      this.$emit('scrolltobottom');
    },
    checkScroll(el) {
      if (
        el.srcElement.offsetHeight + el.srcElement.scrollTop + 40 >=
        el.srcElement.scrollHeight
      ) {
        this.hasScrolledToBottom = true;
        this.$emit("scrolltobottom");
      }
    },
    highlight(text) {
      let htmlEncode = this.htmlEncode;
      var index = text.toLowerCase().indexOf(this.highlightWord.toLowerCase());
      if (index >= 0) {
        text =
          htmlEncode(text.substring(0, index)) +
          "<span class='mark'>" +
          htmlEncode(text.substring(index, index + this.highlightWord.length)) +
          "</span>" +
          htmlEncode(text.substring(index + this.highlightWord.length));
      } else text = htmlEncode(text);
      return text;
    },
    highlightV2(text, indexes) {
      let htmlEncode = this.htmlEncode;  
      let result = '';  
      if (indexes && indexes.length > 0) {    
        var last = [0, -1];
        for (var i = 0; i < indexes.length; last=indexes[i++]) {
          var now = indexes[i];
          result +=
            htmlEncode(text.substring(last[1] + 1, now[0])) +
            "<span class='mark'>" +
            htmlEncode(text.substring(now[0], now[1] + 1)) +
            "</span>" +
            (i === indexes.length - 1 ? htmlEncode(text.substring(now[1] + 1, text.length)) : "");
        }
      } 
      else 
        result = htmlEncode(text);
      return result;
    },
    htmlEncode: function (value) {
      return !value
        ? value
        : String(value)
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;");
    },

    keepInSight: function keepInSight(child, parent) {
      if (
        child.offsetTop - parent.offsetTop + child.clientHeight >
        parent.scrollTop + parent.clientHeight
      ) {
        parent.scrollTo(
          0,
          child.offsetTop -
            parent.offsetTop +
            child.clientHeight -
            parent.clientHeight
        );
      } else if (child.offsetTop - parent.offsetTop - 3 < parent.scrollTop) {
        parent.scrollTo(0, child.offsetTop - parent.offsetTop);
      }
    },
  },
  watch: {
    currentIndex() {
      // eslint-disable-next-line no-debugger
      // debugger;
      this.$emit("selected", this.currentIndex);
      var menu = this.$refs.menu;
      var el = this.$refs.items[this.currentIndex];
      this.keepInSight(el, menu);
    },
    highlightWord() {
      this.currentIndex = 0;
      this.$refs.menu.scrollTo(0, 0);
    },
    selectedItemIndex() {
      this.currentIndex = this.selectedItemIndex;
    },
  },
  mounted() {
    window.addEventListener("keydown", (ev) => {
      if (ev.key == "ArrowDown") {
        if (this.currentIndex + 1 < this.items.length) {
          ev.preventDefault();
          this.currentIndex += 1;
          this.$emit("selected", this.currentIndex);
        }
      } else if (ev.key == "ArrowUp") {
        if (this.currentIndex + 1 > 0) {
          ev.preventDefault();
          this.currentIndex -= 1;
          this.$emit("selected", this.currentIndex);
        }
      } else if (ev.key == "Escape") {
        window.close();
      }
    });
    // document.addEventListener('scroll', this.checkScroll);
  },
};
</script>

<style>
.doc-menu {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  font-family: "PingFang SC", sans-serif;
}
.doc-item {
  height: 48px;
  padding: 0 5px 0 10px;
  box-sizing: border-box;
  cursor: pointer;
}

.doc-item-t {
  color: #212121;
  padding-top: 3px;
  line-height: 24px;
  font-size: 15px;
  font-weight: bolder;
}
.doc-item-d {
  color: rgba(0, 0, 0, 0.5);
  line-height: 16px;
  font-size: 13px;
  font-weight: 600;
}

.doc-item-selected {
  background-color: #dee2e6;
}

.doc-menu .doc-item .mark {
  color: #f18325;
}

.doc-menu .doc-item > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>


