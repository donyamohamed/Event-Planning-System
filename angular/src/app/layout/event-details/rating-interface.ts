export interface ApiResponse {
    result: RatingResult;
    targetUrl: string | null;
    success: boolean;
    error: any | null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
  }
  
  interface RatingResult {
    averageRating: number;
    numberOfRaters: number;
  }
  