export interface HttpResponse<T = any> {
  /**
   * 200 表示成功 其他表示失败
   */
  code: number;
  result: T;
  message: string;
}

export interface ServiceRecordResult<T> {
  current: number;
  pages: number;
  records: T[];
  size: number;
  total: number;
}

export interface ServiceRecordParams {
  pageNo: number;
  pageSize: number;
  isAsc?: 'asc' | 'desc';
  orderByColumn?: string;
}
