import { Guest } from "../../shared/Models/guest";
export interface GuestGetResponse {
  result: Guest;
  success: boolean;
  targetUrl: null;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}
