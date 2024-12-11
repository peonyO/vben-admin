import type { TreeItem } from '../../../directory-tree';

import type { CommonApi } from '#/api';

export function filterTreeData(result: CommonApi.FileTreeResult[]): TreeItem[] {
  return result.map((item) => ({
    children: item.children ? filterTreeData(item.children) : [],
    key: item.filesTypeId,
    title: item.filesTypeName,
    selectable: !(item.children && item.children.length > 0),
  }));
}
