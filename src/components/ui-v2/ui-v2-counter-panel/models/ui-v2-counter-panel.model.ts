export interface CounterPanelData {
	label?: string;
	color?: string;
	status: string;
	counter: number;
	active?: boolean;
	center?: boolean;
	spacer?: boolean;
	limit?: number;
}

export type CounterPanels = CounterPanelData[];

export const defaultPanels = {
	issued: '#1BB3BC',
	pendingPaid: '#F2AB4E',
	advanced: '#9E3667',
	paid: '#3366FF',
	collected: '#63BA68',
	cancelled: '#444444'
};
