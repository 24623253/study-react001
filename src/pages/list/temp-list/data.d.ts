// export type TableListItem = {
//   url: string;
//   id: number;
//   number: number;
//   title: string;
//   labels?: {
//     name: string;
//     color: string;
//   }[];
//   state?: string;
//   comments?: number;
//   created_at?: string;
//   updated_at?: string;
//   closed_at?: string;
// };

export type TableListItem = {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};
