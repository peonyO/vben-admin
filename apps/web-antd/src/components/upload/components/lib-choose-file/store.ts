import type { Key } from 'ant-design-vue/es/vc-tree-select/interface';

import type { TreeItem } from '../../../directory-tree';

import { defineStore } from 'pinia';

interface LibState {
  selectKey: Key | undefined;
  expandedKeys: Key[];
  treeData: TreeItem[];
}

export const useLibStore = defineStore('lib-file', {
  actions: {
    async initTree() {
      if (this.treeData.length === 0) {
        // TODO 获取左侧 Tree 列表
      }
    },
  },
  getters: {},
  state: (): LibState => ({
    selectKey: undefined,
    expandedKeys: [],
    treeData: [],
  }),
});
