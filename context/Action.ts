export type Action =
  | {
      type: 'USER_ADD';
      payload: any;
    }
  | {
      type: 'USER_RESET';
      payload: null;
    }
  | {
      type: 'MODAL_SET';
      data: {
        open: boolean;
        type: 'login' | 'signup' | 'payment';
      };
    };

export const USER_ADD = 'USER_ADD';
export const USER_RESET = 'USER_RESET';
export const MODAL_SET = 'MODAL_SET';
