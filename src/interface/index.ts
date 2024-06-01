export interface ApiResponse {
  [key: string]: {
    loading: boolean;
    success: boolean;
    message: string | null;
  };
}

export interface ApisProps {
  apis: string[];
  apisResponse: {
    [key: string]: {
      loading: boolean;
      success: boolean;
      message: string | null;
    };
  };
  setApis: Function;
}
