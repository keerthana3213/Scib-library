export interface IUICircleProgressBar {
	id?: string;
	styling?: {
		color?: string;
		strokeWidth?: number;
		trailColor?: string;
		trailWidth?: number;
	};
	part: {
		label: string;
		value: number;
	};
	total: {
		label: string;
		value: number;
	};
}
