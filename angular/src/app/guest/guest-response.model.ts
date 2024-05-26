import { Guest } from "../../shared/Models/guest";


export interface GuestResponse {
    result: {
      items: Guest[];
      totalCount: number;
    };
    targetUrl: string | null;
    success: boolean;
    error: string | null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
  }
  