import { Component, Host, h, Prop, Element, Watch, Event, EventEmitter, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import {
	CalendarNavigationDirection,
	dayInfoFactory,
	EventsCalendarDayClickEvent,
	EventsCalendarInputEvent,
	EventsCalendarLiterals,
	EventsCalendarNavigationEvent,
	EventsCalendarState,
	stateChange
} from '../models/events-calendar.model';
import { HelperLevel, SizeTypes, UiKitLocaleCodes } from '../../../../shared/models';
import { DateTime, Info, StringUnitLength } from 'luxon';
import { ButtonVariants } from '../../../atoms/button/models/button.model';
import { CalendarDates, DayInfo, DisabledDatesConfig } from '../../../atoms/calendar/models/calendar.model';
import { isUndefined } from 'lodash';

/**
 * Calendar to visualize/set up event dates.
 * Entry configuration is the same as for the atoms-calendar.
 *
 * Management is done from outside. Each Event has all the information normalized to luxon DateTimes.
 *
 * @slot header
 */
@Component({
	tag: 'scib-molecules-events-calendar',
	styleUrl: 'events-calendar.scss',
	shadow: true
})
export class MoleculesEventsCalendar {
	/**
	 * Internal state
	 * Not decorated to avoid triggering change detection.
	 */
	state: EventsCalendarState;

	@Element() _hostRef: HTMLElement;

	/**
	 * If the header is displayed
	 */
	@Prop({ mutable: true }) displayHeader: boolean = true;

	/**
	 * If the title is displayed
	 */
	@Prop({ mutable: true }) displayTitle: boolean = true;

	/**
	 * If the navigation is displayed
	 */
	@Prop({ mutable: true }) displayNavigation: boolean = true;

	/**
	 * Buttons color.
	 */
	@Prop({ mutable: true }) buttonsColor: HelperLevel = 'tertiary';

	/**
	 * Variant for buttons.
	 */
	@Prop({ mutable: true }) buttonsVariant: ButtonVariants = 'icon';

	/**
	 * Title date format
	 * @see https://moment.github.io/luxon/#/parsing?id=table-of-tokens
	 */
	@Prop({ mutable: true }) formatTitle: string = 'LLLL, yyyy';

	/**
	 * Days format.
	 * Available options are:
	 * - long: Full day name
	 * - short: 3 letters
	 * - narrow: first letter.
	 */
	@Prop({ mutable: true }) formatDays: StringUnitLength = 'long';

	/**
	 * Calendar date
	 */
	@Prop({ mutable: true }) date: string = DateTime.now().toISODate();
	@Watch('date') watchDate(newValue: string) {
		this.state = stateChange(this.state, 'currentDateTime', DateTime.fromISO(newValue));
	}

	/**
	 * Calendar color
	 */
	@Prop({ mutable: true }) calendarColor: HelperLevel = 'primary';

	/**
	 * Localization.
	 * @todo if typescript > 4.5 is supported and target is es2020, I think Intl.Locale is available.
	 */
	@Prop({ mutable: true }) language: UiKitLocaleCodes = 'en-US';
	@Watch('language') watchLanguage(newValue: string): void {
		this.state = stateChange(this.state, 'language', newValue);
	}

	/**
	 * If loading
	 */
	@Prop({ mutable: true }) loading: boolean = false;
	@Watch('loading') watchLoading(newValue: boolean): void {
		this.state = stateChange(this.state, 'loading', newValue);
	}

	/**
	 * Calendar size
	 */
	@Prop({ mutable: true }) size: SizeTypes = 'm';

	/**
	 * Labels
	 */
	@Prop({ mutable: true }) literals: EventsCalendarLiterals | string = {
		navigation: {
			nextMonth: 'Next',
			previousMonth: 'Previous'
		}
	};
	@Watch('literals') watchLiterals(newValue: EventsCalendarLiterals | string) {
		this.state = stateChange(this.state, 'literals', _parseProp<EventsCalendarLiterals>(newValue));
	}

	/**
	 * Payment dates
	 */
	@Prop({ mutable: true }) events: CalendarDates | string = {};
	@Watch('events') watchPaymentDates(newValue: CalendarDates | string) {
		this.state = stateChange(this.state, 'events', _parseProp<CalendarDates>(newValue));
	}

	/**
	 * Disables weekends or specific days
	 */
	@Prop() disableDates: Partial<DisabledDatesConfig> | string;
	@State() $disableDates: Partial<DisabledDatesConfig>;
	@Watch('disableDates') _disableDatesHandler(newValue: Partial<DisabledDatesConfig> | string) {
		this.$disableDates = _parseProp(newValue, {});
	}

	/** Outputs */

	/**
	 * Emitted when a day is clicked.
	 */
	@Event({
		bubbles: false
	})
	eventDayClick: EventEmitter<EventsCalendarDayClickEvent>;

	/**
	 * Emitted when the action button in each day is clicked.
	 */
	@Event({
		bubbles: false
	})
	eventDayActionClick: EventEmitter<EventsCalendarDayClickEvent>;

	/**
	 * Emitted when the navigation arrows are clicked.
	 */
	@Event({
		bubbles: false
	})
	eventNavigation: EventEmitter<EventsCalendarNavigationEvent>;

	componentWillLoad() {
		const luxonDate = !isUndefined(this.date) ? DateTime.fromISO(this.date) : DateTime.now();
		this.state = {
			previousDateTime: null,
			currentDateTime: luxonDate,
			buttonsColor: this.buttonsColor,
			buttonsVariant: this.buttonsVariant,
			calendarColor: this.calendarColor,
			displayHeader: this.displayHeader,
			displayNavigation: this.displayNavigation,
			displayTitle: this.displayTitle,
			formatDays: this.formatDays,
			formatTitle: this.formatTitle,
			language: this.language,
			loading: this.loading,
			size: this.size,
			literals: _parseProp<EventsCalendarLiterals>(this.literals),
			events: _parseProp<CalendarDates>(this.events)
		};
		this.watchDate(this.date);
		this.watchLanguage(this.language);
		this.watchLiterals(this.literals);
		this.watchLoading(this.loading);
		this.watchPaymentDates(this.events);
		this._disableDatesHandler(this.disableDates);
	}

	navigate($event: MouseEvent, direction: CalendarNavigationDirection): void {
		$event.preventDefault();

		const diff = { months: 1 };
		const nextDate = direction === 'previous' ? this.state.currentDateTime.minus(diff) : this.state.currentDateTime.plus(diff);

		this.eventNavigation.emit({
			direction,
			previousDateTime: this.state.currentDateTime,
			currentDateTime: nextDate,
			currentDate: nextDate.toISODate(),
			previousDate: this.state.currentDateTime.toISODate()
		});
	}

	handleDayClick($event: CustomEvent<DayInfo>): void {
		$event.preventDefault();

		// @fixme: Typing comes from the original calendar but is missing properties.
		const { detail } = $event as unknown as CustomEvent<EventsCalendarInputEvent>;

		if (detail?.isPastDate === true) {
			return;
		}

		this.eventDayClick.emit({
			dayInfo: dayInfoFactory(detail),
			date: detail.date,
			dateTime: DateTime.fromISO(detail.date)
		});
	}

	handleDayActionClick($event: CustomEvent<DayInfo>): void {
		$event.preventDefault();

		// @fixme: Typing comes from the original calendar but is missing properties.
		const { detail } = $event as unknown as CustomEvent<EventsCalendarInputEvent>;

		this.eventDayActionClick.emit({
			dayInfo: dayInfoFactory(detail),
			date: detail.date,
			dateTime: DateTime.fromISO(detail.date)
		});
	}

	render() {
		const locale = this.state.currentDateTime.setLocale(this.state.language);
		const now = DateTime.now();
		const isCurrentMonth = locale.year === now.year && locale.month === now.month;

		return (
			<Host>
				{!!this.state?.loading && <scib-atoms-skeleton skeletonType="card"></scib-atoms-skeleton>}

				{!this.state?.loading && !!this.state?.displayHeader && (
					<header>
						<slot name="header" />
						{!!this.state?.displayNavigation && (
							<nav>
								{!!this.state?.displayTitle && <time dateTime={locale.toISODate()}>{locale.toFormat(this.state?.formatTitle)}</time>}

								{!isCurrentMonth && (
									<scib-atoms-button
										role="button"
										icon="chevron-left"
										size="s"
										aria-label={this.state.literals?.navigation.previousMonth}
										text={this.state.literals?.navigation.previousMonth}
										onClick={(event) => this.navigate(event, 'previous')}
										level={this.state.buttonsColor}
										variant={this.state.buttonsVariant}
									></scib-atoms-button>
								)}

								<scib-atoms-button
									role="button"
									size="s"
									icon="chevron"
									icon-position="trailing"
									aria-label={this.state.literals?.navigation.nextMonth}
									text={this.state.literals?.navigation.nextMonth}
									onClick={(event) => this.navigate(event, 'next')}
									level={this.state.buttonsColor}
									variant={this.state.buttonsVariant}
								></scib-atoms-button>
							</nav>
						)}
					</header>
				)}

				{!this.state?.loading && (
					<scib-atoms-calendar
						level={this.state.calendarColor}
						config={{
							dayData: this.state.events,
							dayNames: Info.weekdays(this.state.formatDays, {
								locale: this.state.language
							})
						}}
						date={this.state.currentDateTime.toISODate()}
						size={this.state.size}
						disable-past-dates="true"
						disableDates={this.$disableDates}
						onDayClick={(event) => this.handleDayClick(event)}
						onDayActionClick={(event) => this.handleDayActionClick(event)}
						style={{ ['--atoms-calendar-days-cursor']: 'pointer' }}
					></scib-atoms-calendar>
				)}
			</Host>
		);
	}
}
