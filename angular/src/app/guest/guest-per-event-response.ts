import { Guest } from "../../shared/Models/guest";


export interface GuestPerEventResponse {
    result: Guest[];
    targetUrl: string | null;
    success: boolean;
    error: any; // Replace 'any' with a more specific type if you know the structure of the error object
    unAuthorizedRequest: boolean;
    __abp: boolean;
  }