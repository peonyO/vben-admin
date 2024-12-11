import { UPLOAD_FILE_TYPE } from '../../helper';

export const ACCEPT_MAP = {
  [UPLOAD_FILE_TYPE.PICTURE]: [
    'image/ico', // ICO 格式
    'image/png', // PNG 格式
    'image/gif', // GIF 格式
    'image/webp', // WEBP 格式
  ].join(','), // 使用 join 连接为字符串
  [UPLOAD_FILE_TYPE.AUDIO]: 'audio/*', // 所有音频文件
  [UPLOAD_FILE_TYPE.VIDEO]: 'video/*', // 所有视频文件
};
