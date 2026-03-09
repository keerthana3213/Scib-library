export interface ILiterals {
	[key: string]: any;
}

export const stateConfig = {
	complete: {
		background: '#A2D6A5',
		color: '#008437',
		icon: 'check',
	},
	incomplete: {
		background: '#dcdcdc',
		color: '',
		icon: '',
	},
	cancel: {
		background: '#FEE5E5',
		color: '#CC0000',
		icon: 'close',
	},
	draw: {
		background: '#FFE699',
		color: '#946F00',
		icon: 'warning',
	},
	default: {
		background: '#cedee7',
		color: '#257fa4',
		icon: 'subtract',
	},
};
