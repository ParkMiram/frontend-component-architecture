export interface UpdateWorkDetailBody {
  work_no: string;
  tag_name: string;
  customer: string;
  device_name: string;
  order_no: string;
  pji_uid: string;
  mcn_uid: string;
  snr_uid: string;
  target_size: number;
  completed_size: number;
  failed_size: number;
  check_size: number;
  due_date: string;
  description: string;
  is_lock: string;
  status: string;
  param: string;
  param_ext: string;
  detail_msg: string;
  result: string;
  work_start_time: string;
  comment: string;
}
