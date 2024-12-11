import type { Key } from 'ant-design-vue/es/vc-tree-select/interface';

import type { TreeItem } from '../directory-tree';

import { defineStore } from 'pinia';

import { getFileTreeApi } from '#/api';

import { filterTreeData } from './helper';

interface LibState {
  selectKey: Key | undefined;
  expandedKeys: Key[];
  treeData: TreeItem[];
}

export const useLibStore = defineStore('lib-file', {
  actions: {
    async initTree() {
      if (this.treeData.length === 0) {
        const result = await getFileTreeApi();
        this.treeData = filterTreeData(result);
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
