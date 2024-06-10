import { Event } from "../../shared/Models/Event";
export interface EventsResponse {
    result: {
        items: Event[];
        totalCount: number;
      };
      targetUrl: string | null;
      success: boolean;
      error: string | null;
      unAuthorizedRequest: boolean;
      __abp: boolean;
}
