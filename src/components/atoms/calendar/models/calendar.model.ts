export interface DayInfo {
	title: string;
	currency: string;
	total: string | number;
	amount: string | number;
	selected?: boolean;
}

export type CalendarDates = Record<string, DayInfo>;

export interface Config {
	dayNames: string[];
	dayData: CalendarDates;
	action?: {
		icon: string;
	};
}

export const defaultConfig = {
	dayNames: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
};

export interface DisabledDatesConfig {
	weekends: boolean;
	dates: string[];
}

export interface DateInfo {
	day: string;
	month: string;
	year: string;
	isoDate: string;
	isPastDate: boolean;
	isWeekend: boolean;
}
