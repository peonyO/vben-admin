import type { AxiosProgressEvent } from '@vben/request';

import type { ServiceRecordParams, ServiceRecordResult } from '#/types';

import { requestClient } from '#/api/request';

export namespace CommonApi {
  export interface UploadFileResult {
    previewUrl: string;
  }
  export interface FileListParams extends ServiceRecordParams {
    filesType?: string;
    filesTypeId?: string;
    origName?: string;
  }
  export interface FileTreeResult {
    filesTypeId: number;
    filesTypeName: string;
    parentId: number;
    title: string;
    videoImageLast: boolean;
    children: FileTreeResult[];
  }

  export interface FileListResult {
    backupUrl: null | string;
    createTime: string;
    deleteFlag: boolean;
    downloadUrl: string;
    fileFlag: boolean;
    fileImageUrl: string;
    fileName: null | string;
    fileSize: number;
    filesId: number;
    filesType: string;
    filesTypeId: number;
    filesTypePath: string;
    localPath: string;
    md5Value: null | string;
    origName: string;
    pictureSize: null | number;
    previewUrl: string;
    suffix: string;
    uploader: string;
    uploaderId: null | number;
    videoDuration: null | number;
  }
}

/**
 * 上传文件
 */
export async function uploadFileApi(
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return requestClient.upload('/common/upload', { file }, { onUploadProgress });
}

/**
 * 获取文件分类
 */
export async function getFileTreeApi() {
  return requestClient.get<CommonApi.FileTreeResult[]>(
    '/file/fifilestype/tree',
  );
}

/**
 * 获取文件列表
 */
export async function getFileListApi(params: CommonApi.FileListParams) {
  return requestClient.get<ServiceRecordResult<CommonApi.FileListResult>>(
    '/file/fifiles/page',
    { params },
  );
}
