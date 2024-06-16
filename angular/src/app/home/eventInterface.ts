import { Event } from "../../shared/Models/Event";
export interface EventsResponse {
    result: Event[];
      targetUrl: string | null;
      success: boolean;
      error: string | null;
      unAuthorizedRequest: boolean;
      __abp: boolean;
}

