import type { UPLOAD_FILE_TYPE, UPLOAD_TYPE } from './helper';

/**
 * 上传属性接口
 * 用于定义上传组件或功能所需的属性类型。
 */
export interface UploadProps {
  /**
   * 上传文件的数量
   * 可选属性，表示要上传的文件数量。
   * 如果未指定，默认为无限制数量。
   */
  number?: number;

  /**
   * 上传类型
   * 可选属性，指定上传的来源类型。
   * 使用 UPLOAD_TYPE 枚举来定义不同的上传来源，如图片、视频等。
   */
  type?: UPLOAD_TYPE;

  /**
   * 文件类型
   * 可选属性，指定上传文件的类型，使用 UPLOAD_FILE_TYPE 枚举。
   */
  fileType: UPLOAD_FILE_TYPE;

  /**
   * 最大文件大小
   * 可选属性，指定允许上传的文件的最大大小（以kb为单位）。
   * 如果未指定，可能会使用默认的最大文件大小限制。
   */
  maxSize?: number;

  /**
   * 纵横比
   * 可选属性，指定上传文件的宽高比。
   * 例如，1.5 表示宽度是高度的 1.5 倍。
   * 此属性可用于限制用户上传特定比例的图像文件。
   */
  aspectRatio?: number;
}
/**
 * 上传文件状态枚举
 * 该枚举定义了文件上传的不同状态
 */
export enum UPLOAD_FILE_STATUS {
  FAIL = 'fail', // 上传失败
  SUCCESS = 'success', // 上传成功
  UPLOADING = 'uploading', // 正在上传
}

/**
 * 文件项接口
 * 该接口定义了文件项的结构
 */
export interface FileItem {
  file: File | string; // 文件对象或文件的字符串表示
  id: string; // 文件的唯一标识符
}
