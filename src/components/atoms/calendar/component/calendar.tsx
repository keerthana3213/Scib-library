import { Component, Host, h, Element, Prop, State, Watch, EventEmitter, Event } from '@stencil/core';
import { Config, DateInfo, DayInfo, DisabledDatesConfig, defaultConfig } from '../models/calendar.model';
import { HelperLevel, SizeTypes } from '../../../../shared/models';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { get, merge } from 'lodash';
import { DateTime } from 'luxon';

/**
 * Component description
 */
@Component({
	tag: 'scib-atoms-calendar',
	styleUrl: 'calendar.scss',
	shadow: true
})
export class AtomsCalendar {
	firstDayPosition: number = 0;

	today: DateTime = DateTime.now();

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop() date: string;
	@State() $calendar: string[][];
	@Watch('date') _dateHandler(newValue: string | undefined) {
		this.$calendar = this._getCalendar(newValue);
	}

	/**
	 *
	 */
	@Prop() config: string | Config;
	@State() $config: Config;
	@Watch('config') _configHandler(newValue: string | Config) {
		this.$config = merge({}, defaultConfig, _parseProp<Config>(newValue, {}));
	}

	/**
	 * Calendar theme
	 */
	@Prop({ reflect: true }) level: HelperLevel = 'tertiary';

	/**
	 * Calendar size
	 */
	@Prop() size: SizeTypes = 'm';

	/**
	 * If dates before selected date should be disabled.
	 */
	@Prop() disablePastDates: boolean = false;

	/**
	 * Disables weekends or specific days
	 */
	@Prop() disableDates: Partial<DisabledDatesConfig> | string;
	@State() $disableDates: Partial<DisabledDatesConfig>;
	@Watch('disableDates') _disableDatesHandler(newValue: Partial<DisabledDatesConfig> | string) {
		this.$disableDates = _parseProp(newValue, {});
	}

	/**
	 *
	 */
	@Event({ bubbles: false })
	dayActionClick: EventEmitter<DayInfo>;

	/**
	 *
	 */
	@Event({ bubbles: false })
	dayClick: EventEmitter<DayInfo>;

	/**
	 *
	 */
	componentWillLoad() {
		this._dateHandler(this.date);
		this._configHandler(this.config);
		this._disableDatesHandler(this.disableDates);
	}

	/**
	 *
	 */
	private _getCalendar(inputDate?: string): string[][] {
		const calendar = [];
		const luxon = window.luxon.DateTime;
		const options = { zone: 'local' };
		const currentDate = luxon.fromJSDate(inputDate ? new Date(inputDate) : new Date(), options);
		const currentMonth = currentDate.month;
		const currentYear = currentDate.year;
		const daysInMonth = currentDate.daysInMonth;
		const firstDayOfMonth = currentDate.set({ day: 1, month: currentMonth, year: currentYear });
		const firstDayPosition = firstDayOfMonth.weekday;
		let weeks = (daysInMonth + (firstDayPosition - 1)) / 6;
		if (weeks < 5) {
			weeks = Math.ceil(weeks);
		} else {
			weeks = Math.trunc(weeks);
		}
		let date = firstDayOfMonth;
		let numberOfSavedDays = 1;
		this.firstDayPosition = firstDayPosition - 1;
		for (let dayPosition = 1; dayPosition <= weeks; dayPosition++) {
			const week = new Array(7).fill(null);
			if (dayPosition === 1) {
				calendar.push(
					week.map((value, index) => {
						if (index + 1 >= firstDayPosition) {
							const _currentDate = date;
							date = date.plus({ days: 1 });
							numberOfSavedDays++;

							return {
								day: _currentDate.day,
								month: _currentDate.month,
								year: _currentDate.year,
								isoDate: _currentDate.toISODate(),
								isPastDate: _currentDate.toISODate() < this.today.toISODate(),
								isWeekend: _currentDate.weekday >= 6
							};
						}
						return value;
					})
				);
			} else if (dayPosition === weeks) {
				const restDays = daysInMonth - numberOfSavedDays;
				calendar.push(
					week.map((value, index) => {
						if (index <= restDays) {
							const _currentDate = date;
							date = date.plus({ days: 1 });
							numberOfSavedDays++;

							return {
								day: _currentDate.day,
								month: _currentDate.month,
								year: _currentDate.year,
								isoDate: _currentDate.toISODate(),
								isPastDate: _currentDate.toISODate() < this.today.toISODate(),
								isWeekend: _currentDate.weekday >= 6
							};
						}
						return value;
					})
				);
			} else {
				calendar.push(
					week.map(() => {
						const _currentDate = date;
						date = date.plus({ days: 1 });
						numberOfSavedDays++;
						return {
							day: _currentDate.day,
							month: _currentDate.month,
							year: _currentDate.year,
							isoDate: _currentDate.toISODate(),
							isPastDate: _currentDate.toISODate() < this.today.toISODate(),
							isWeekend: _currentDate.weekday >= 6
						};
					})
				);
			}
		}
		return calendar;
	}

	/**
	 *
	 * @param day
	 * @param data
	 */
	eventHandler(event: Event, dateInfo: DateInfo, data: any, trigger: 'dayActionClick' | 'dayClick' = 'dayActionClick') {
		event.preventDefault();
		event.stopPropagation();
		this[trigger].emit({ date: dateInfo.isoDate, ...data, ...dateInfo });
	}

	/**
	 *
	 * @param day
	 * @returns boolean
	 */
	private _isDisabledDay(day: DateInfo): boolean {
		const isWeekendsDisabled = get(this.$disableDates, ['weekends'], false);
		const disabledDates = get(this.$disableDates, ['dates'], []);
		const isDateDisabled = disabledDates.some((dayDate) => {
			const _date = DateTime.fromISO(dayDate, { zone: 'local' });
			return _date.toISODate() === day?.isoDate;
		});
		return (!!this.disablePastDates && !!day?.isPastDate) || !!isDateDisabled || (!!isWeekendsDisabled && !!day?.isWeekend);
	}

	render() {
		return (
			<Host>
				<div class="calendar">
					<div class="calendar__header">
						{get(this.$config, 'dayNames', []).map((value, index) => {
							return (
								<div class="calendar__header__text" key={index}>
									<span>{(value || '').toLowerCase()}</span>
								</div>
							);
						})}
					</div>
					<div class="calendar__body">
						{this.$calendar.map((week, weekIndex) => {
							return (
								<div class="calendar__body__week" id={`week-${weekIndex}`}>
									{week.map((date: any, dayIndex) => (
										<div
											id={`day-${dayIndex}`}
											class={{
												calendar__body__week__day: true,
												'calendar__body__week__day--empty': !((date && date.day) || null),
												'calendar__body__week__day--last': weekIndex === this.$calendar.length - 1,
												'calendar__body__week__day--first': weekIndex === 0 && dayIndex === this.firstDayPosition - 1,
												'calendar__body__week__day--has-events':
													date && date.isoDate && get(this.$config, ['dayData', date.isoDate]) ? true : false,
												'calendar__body__week__day--selected': get(this.$config, ['dayData', date?.isoDate, 'selected']),
												'calendar__body__week__day--disabled': this._isDisabledDay(date)
											}}
											onClick={(event) =>
												this.eventHandler(event, date, get(this.$config, ['dayData', date.isoDate]), 'dayClick')
											}
										>
											{date && date.day && (
												<div class="calendar__body__week__day__number">
													<div style={{ '--icon-content': `var(--theme-scib-icon-cancel)` }}>
														<i class="icon"></i>
													</div>

													<span>{date.day}</span>
												</div>
											)}

											{date && date.isoDate && get(this.$config, ['dayData', date.isoDate]) && (
												<div class="calendar__body__week__day__info">
													<div class="calendar__body__week__day__info__title">
														<span>{get(this.$config, ['dayData', date.isoDate, 'title'])}</span>
														<span>{get(this.$config, ['dayData', date.isoDate, 'total'])}</span>
													</div>
													<div class="calendar__body__week__day__info__sub-title">
														<span>{get(this.$config, ['dayData', date.isoDate, 'currency'])}</span>
														<span>{get(this.$config, ['dayData', date.isoDate, 'amount'])}</span>
													</div>
												</div>
											)}

											{get(this.$config, ['action', 'icon']) && (
												<div
													class="calendar__body__week__day__info__action action-button"
													style={{
														'--icon-content': `var(--theme-scib-icon-${get(this.$config, ['action', 'icon'])})`
													}}
												>
													<scib-atoms-button
														onClick={(event) =>
															this.eventHandler(event, date, get(this.$config, ['dayData', date.isoDate]))
														}
														style={{ background: 'var(--_atoms-background-action-button)' }}
														size="s"
														level="tertiary"
														variant="icon"
														icon={get(this.$config, ['action', 'icon'])}
													></scib-atoms-button>
												</div>
											)}
										</div>
									))}
								</div>
							);
						})}
					</div>
				</div>
			</Host>
		);
	}
}
