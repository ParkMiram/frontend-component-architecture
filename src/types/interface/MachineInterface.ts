export interface CreateMachineBody {
  name: string;
  etc: string;
  comment: string;
}

export interface UpdateMachineBody {
  name: string;
  mcn_uid: string;
  ip: string;
  rom_ver: string;
  comment: string;
}
