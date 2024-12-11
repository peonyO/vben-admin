import type { ItemType } from 'ant-design-vue';
import type { DataNode } from 'ant-design-vue/es/tree';

export interface TreeItem extends DataNode {
  key: number;
  title: string;
  desc?: string;
  iconSrc?: string;
}

export interface TreeProps {
  treeData?: TreeItem[];
  contextmenu?: ItemType[];
}

export interface ClickMenuItem {
  treeItem: TreeItem;
  menuType: string;
}

export interface TreeEmits {
  (event: 'handleMenuItem', options: ClickMenuItem): void;
}
