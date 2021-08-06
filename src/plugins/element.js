import Vue from 'vue'
import { Button, Input, Header, Container, Aside, Main, InfiniteScroll, Loading } from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.directive('infinite-scroll', InfiniteScroll)
Vue.directive('loading', Loading)
