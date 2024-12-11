import type { UploadProps } from './types';

import { h } from 'vue';

import { MdiCloudUpload, MdiFolderUpload } from '@vben/icons';

import { message } from 'ant-design-vue';

import { z } from '#/adapter/form';

/**
 * 上传类型枚举
 * 定义了不同的上传来源类型，用于区分上传方式。
 */
export enum UPLOAD_TYPE {
  /** 所有类型的上传 */
  'ALL' = 'all',

  /** 库中的文件上传 */
  'LIB' = 'lib',

  /** 本地文件上传 */
  'LOCAL' = 'local',
}

/**
 * 上传文件类型枚举
 * 定义了支持的文件类型，用于上传文件时的类型标识。
 */
export enum UPLOAD_FILE_TYPE {
  /** 音频文件 */
  'AUDIO' = 'audio',

  /** 图片文件 */
  'PICTURE' = 'picture',

  /** 视频文件 */
  'VIDEO' = 'video',
}

// 定义上下文菜单列表，用于文件上传选项
export const contextmenuList = [
  {
    label: '文件库上传', // 菜单项的标签
    key: UPLOAD_TYPE.LIB, // 关联的上传类型
    icon: h(MdiFolderUpload, { style: { fontSize: '18px' } }), // 菜单项的图标
  },
  {
    label: '本地上传', // 菜单项的标签
    key: UPLOAD_TYPE.LOCAL, // 关联的上传类型
    icon: h(MdiCloudUpload, { style: { fontSize: '18px' } }), // 菜单项的图标
  },
];

/**
 * 获取图像文件的宽度和高度信息
 * @param file - 要获取信息的图像文件
 * @returns Promise - 包含图像的宽度和高度的对象
 */
export function getFileImageInfo(file: File) {
  return new Promise<{ height: number; width: number }>((resolve, reject) => {
    try {
      const fileReader = new FileReader(); // 创建文件读取器
      fileReader.readAsDataURL(file); // 以数据 URL 的形式读取文件
      fileReader.addEventListener('load', ($event) => {
        if ($event.target?.result) {
          const imageContext = new Image(); // 创建图像对象
          imageContext.src = $event.target.result as string; // 设置图像源为读取的结果
          imageContext.addEventListener('load', () => {
            // 图像加载完成后，获取宽度和高度
            resolve({
              width: imageContext.width,
              height: imageContext.height,
            });
          });
        } else {
          throw new Error('图片信息获取失败！'); // 如果读取结果为空，抛出错误
        }
      });
    } catch (error) {
      reject(error); // 捕获错误并拒绝 Promise
    }
  });
}

/**
 * 检查本地文件的有效性
 * @param files - 要检查的文件列表
 * @param options - 包含最大文件大小和纵横比的选项
 * @param options.maxSize - 最大文件大小
 * @param options.aspectRatio - 纵横比
 * @returns Promise - 返回符合条件的文件数组
 */
export async function checkLocalFiles(
  files: File[],
  { maxSize, aspectRatio }: Pick<UploadProps, 'aspectRatio' | 'maxSize'>,
): Promise<File[]> {
  const checkSucFiles: File[] = []; // 存储符合条件的文件
  for (const file of files) {
    let isCheck = true; // 标记文件是否符合条件
    if (file) {
      // 检查文件大小
      if (maxSize && file.size > maxSize * 1024) {
        isCheck = false; // 文件超出最大大小
      }
      // 检查文件的纵横比
      if (aspectRatio) {
        try {
          const { width, height } = await getFileImageInfo(file); // 获取图像信息
          // 判断图像的实际纵横比是否符合要求
          if (Math.abs(width / height - aspectRatio) > 0.01) {
            isCheck = false; // 纵横比不符合
          }
        } catch {}
      }
      // 如果文件符合所有条件，则添加到结果数组中
      if (isCheck) {
        checkSucFiles.push(file);
      } else {
        message.error(`${file.name}文件大小或比例不正确，请重新上传！`);
      }
    }
  }
  return checkSucFiles; // 返回符合条件的文件数组
}

// 获取当前时间戳
const now = Date.now();
let index = 0; // 用于生成唯一 ID 的索引

/**
 * 获取唯一的上传 ID
 * @returns 返回格式为 "upload-{时间戳}-{索引}" 的唯一 ID
 */
export function getUid() {
  return `upload-${now}-${++index}`; // 返回唯一 ID
}

/** upload form rules 当 value 中包含 file 代表正在上传或者上传失败 */
export function fileUploadRule() {
  return z
    .string()
    .min(1, '请上传文件')
    .refine((value) => !value.includes('file'), {
      message: '请检查文件是否上传成功！',
    });
}
