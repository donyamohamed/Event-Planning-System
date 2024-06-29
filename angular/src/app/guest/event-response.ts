import { Event } from "../../shared/Models/Event";

export interface EventResponse {
    error: string | null;
    result:Event;
    success: boolean;
    targetUrl: string | null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
  }
  