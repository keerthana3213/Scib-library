import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { MoleculesEventsCalendar } from '../component/events-calendar';
import { h } from '@stencil/core';
import { DateTime } from 'luxon';

describe('molecules-events-calendar', () => {
	let page: SpecPage;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [MoleculesEventsCalendar],
			template: () => <scib-molecules-events-calendar></scib-molecules-events-calendar>
		});
	});

	it('builds', () => {
		expect(new MoleculesEventsCalendar()).toBeTruthy();
	});

	it('should provide defaults.', async () => {
		expect(page.rootInstance.date).toBe(DateTime.now().toISODate());
		expect(page.rootInstance.buttonsColor).toBe('tertiary');
		expect(page.rootInstance.buttonsVariant).toBe('icon');
		expect(page.rootInstance.calendarColor).toBe('primary');
		expect(page.rootInstance.displayHeader).toBeTruthy();
		expect(page.rootInstance.displayNavigation).toBeTruthy();
		expect(page.rootInstance.displayTitle).toBeTruthy();
		expect(page.rootInstance.formatDays).toBe('long');
		expect(page.rootInstance.formatTitle).toBe('LLLL, yyyy');
		expect(page.rootInstance.language).toBe('en-US');
		expect(page.rootInstance.loading).toBeFalsy();
		expect(page.rootInstance.size).toEqual('m');
		expect(page.rootInstance.literals).toEqual({
			navigation: {
				nextMonth: 'Next',
				previousMonth: 'Previous'
			}
		});
		expect(page.rootInstance.events).toEqual({});
	});
});
