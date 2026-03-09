export interface ILiterals {
	[key: string]: any;
}

export interface IToolboxUserInfo {
	avatar: {
		src: string;
		alt: string;
	};
	isEmployee: boolean;
}

export interface IToolboxCoordinate {
	x: number;
	y: number;
}
