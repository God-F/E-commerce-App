import Vue from 'vue';
import Vuex from 'vuex';
import { getSidebar, getGoods } from '@/api';
import { getItem } from '@/utils';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  state: {
    page: 1,
    sidebar: [],
    goodsList: [],
    type: undefined,
    isLoading: false,
    refreshing: false,
    finished: false,
    shoppingTop: 0,
    shoppingLeft: 0,
    shoppingTotal: 0,
  },
  mutations: {
    getSidebar(state, payload) {
      state.sidebar = payload;
    },
    getGoods(state, payload) {
      state.goodsList = payload;
    },
    changeType(state, payload) {
      state.type = payload;
    },
    pushGoods(state, payload) {
      state.goodsList = state.goodsList.concat(payload);
    },
    changeIsLoading(state, payload) {
      state.isLoading = payload;
    },
    changeRefreshing(state, payload) {
      state.refreshing = payload;
    },
    changeFinished(state, payload) {
      state.finished = payload;
    },
    changePage(state, payload) {
      state.page = payload;
    },
    changeShoppingTop(state, payload) {
      state.shoppingTop = payload;
    },
    changeShoppingLeft(state, payload) {
      state.shoppingLeft = payload;
    },
    changeShoppingTotal(state, payload) {
      state.shoppingTotal = payload;
    },
  },
  actions: {
    async getGoods(context, payload) {
      context.commit('changePage', 1);
      context.commit('changeFinished', false);
      context.commit('getGoods', []);
      context.commit('changeIsLoading', true);
      const {
        refreshing, page = 1, size = 10, sort = 'all',
      } = payload;
      let { type } = payload;
      // 如果type为undefined 那么就读取以前的
      // 如果有  那么就更改以前的数据

      if (type) {
        context.commit('changeType', type);
      } else {
        type = context.state.type;
      }
      if (refreshing) {
        context.commit('changeRefreshing', true);
      }

      const data = await getGoods(type, page, size, sort);
      const storage = getItem();
      data.list.forEach((item) => {
        const i = item;
        if (storage[item.id]) {
          i.selectNumber = storage[item.id];
        }
      });
      context.commit('getGoods', data.list);
      if (context.state.goodsList.length === data.total || data.list.length === 0) {
        context.commit('changeFinished', true);
      }
      context.commit('changeIsLoading', false);
      context.commit('changeRefreshing', false);
      context.commit('changePage', context.state.page + 1);
    },
    async getSidebar(context, payload) {
      const data = await getSidebar(payload);
      context.commit('getSidebar', data);
    },
    async pushGoods(context, payload) {
      context.commit('changeIsLoading', true);
      const {
        type, page = 1, size = 10, sort = 'all',
      } = payload;

      const data = await getGoods(type, page, size, sort);
      const storage = getItem();
      data.list.forEach((item) => {
        const i = item;
        if (storage[item.id]) {
          i.selectNumber = storage[item.id];
        }
      });
      context.commit('pushGoods', data.list);
      if (context.state.goodsList.length === data.total || data.list.length === 0) {
        context.commit('changeFinished', true);
      }

      context.commit('changePage', context.state.page + 1);
      context.commit('changeIsLoading', false);
    },
  },
  modules: {
  },
});
