import type { UploadProps } from '../../types';

export interface LibChooseFileProps extends Pick<UploadProps, 'fileType'> {
  canNumber: number;
}
