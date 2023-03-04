export type Action =
	| {
			type: 'USER_ADD';
			payload: any;
	  }
	| {
			type: 'USER_RESET';
			payload: null;
	  };

export const USER_ADD = 'USER_ADD';
export const USER_RESET = 'USER_RESET';
