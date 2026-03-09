import { get, isEqual, isUndefined } from 'lodash';
import { DateTime, StringUnitLength } from 'luxon';
import { HelperLevel, SizeTypes, UiKitLocaleCodes } from '../../../../shared/models';
import { ButtonVariants } from '../../../atoms/button/models/button.model';
import { DayInfo, CalendarDates } from '../../../atoms/calendar/models/calendar.model';

export type CalendarNavigationDirection = 'previous' | 'next';
export type EventsCalendarInputEvent = DayInfo & { date: string; isPastDate?: boolean };

export interface EventsCalendarLiteralsNavigation {
	previousMonth: string;
	nextMonth: string;
}

export interface EventsCalendarLiterals {
	navigation: EventsCalendarLiteralsNavigation;
}

export interface EventsCalendarDayClickEvent {
	dateTime: DateTime;
	date: string;
	dayInfo: DayInfo | undefined;
}

export interface EventsCalendarNavigationEvent {
	direction: CalendarNavigationDirection;
	previousDateTime: DateTime;
	currentDateTime: DateTime;
	previousDate: string;
	currentDate: string;
}

export interface EventsCalendarState {
	/**
	 * If the header title is displayed in the calendar
	 */
	displayNavigation: boolean;

	/**
	 * If the header title is displayed in the calendar
	 */
	displayTitle: boolean;

	/**
	 * If the header is displayed in the calendar
	 */
	displayHeader: boolean;

	/**
	 * Previous Luxon instance for the given date
	 */
	previousDateTime: DateTime | null;

	/**
	 * Luxon instance for the given date
	 * This date is always fixed to the first day of a month
	 */
	currentDateTime: DateTime | null;

	/**
	 * Localized title
	 */
	language: UiKitLocaleCodes;

	/**
	 * Calendar theme
	 */
	calendarColor: HelperLevel;

	/**
	 * Buttons theme
	 */
	buttonsColor: HelperLevel;

	/**
	 * Buttons variant
	 */
	buttonsVariant: ButtonVariants;

	/**
	 * Title format
	 */
	formatTitle: string;

	/**
	 * Calendar size
	 */
	size: SizeTypes;

	/**
	 * Calendar days format
	 */
	formatDays: StringUnitLength;

	/**
	 * Labels
	 */
	literals: EventsCalendarLiterals;

	/**
	 * Calendar dates
	 */
	events: CalendarDates;

	/**
	 * If component is loading
	 */
	loading: boolean;
}

export function dayInfoFactory(from?: Partial<DayInfo>): DayInfo {
	return {
		title: undefined,
		currency: undefined,
		total: undefined,
		amount: undefined,
		selected: false,
		...from
	};
}

export function stateChange<T = any, K = string>(state: T, property: string, change: K) {
	try {
		const stateProperty = get(state, property, undefined);

		if (isUndefined(stateProperty)) {
			throw new ReferenceError(`${property} not found in ${state}.`);
		}

		const value = state[property] as K;
		const changed = !isEqual(value, change);

		if (!changed) {
			return state;
		}

		const newState: T = Object.assign(
			{},
			{
				...state,
				[property]: change
			}
		);

		return newState;
	} catch (error) {
		console.error(`ui:kit:MoleculesEventsCalendar -> state NOT updated ->`, error);
	}

	return state;
}
