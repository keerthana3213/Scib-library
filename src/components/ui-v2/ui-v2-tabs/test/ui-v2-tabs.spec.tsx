import { UI_V2Tabs } from '../component/ui-v2-tabs';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-tabs', () => {
	const tabsMock = [
		{
			id: 1,
			value: 'tarmelon'
		},
		{
			id: 2,
			value: 'tanana'
		},
		{
			id: 3,
			value: 'tapple'
		}
	];

	it('should not render any tabs when provided no options', async () => {
		const page = await newSpecPage({
			components: [UI_V2Tabs],
			template: () => <scib-ui-v2-tabs></scib-ui-v2-tabs>
		});
		const tabButtons = page.root.shadowRoot.querySelectorAll('button');
		expect(tabButtons.length).toBe(0);
	});
	it('should render 1 tab when provided 1 option', async () => {
		const page = await newSpecPage({
			components: [UI_V2Tabs],
			template: () => <scib-ui-v2-tabs tabOptions={[{ id: 1, value: 'tarmelon' }]}></scib-ui-v2-tabs>
		});
		const tabButtons = page.root.shadowRoot.querySelectorAll('button');
		expect(tabButtons.length).toBe(1);
	});
	it('should render 3 tabs when provided 3 options', async () => {
		const page = await newSpecPage({
			components: [UI_V2Tabs],
			template: () => <scib-ui-v2-tabs tabOptions={tabsMock}></scib-ui-v2-tabs>
		});
		const tabButtons = page.root.shadowRoot.querySelectorAll('button');
		expect(tabButtons.length).toBe(3);
	});
	it('should activate visually the tab when clicked', async () => {
		const page = await newSpecPage({
			components: [UI_V2Tabs],
			template: () => <scib-ui-v2-tabs tabOptions={tabsMock}></scib-ui-v2-tabs>
		});
		const tabButtons = page.root.shadowRoot.querySelectorAll('button');
		tabButtons[1].click();
		await page.waitForChanges();
		expect(tabButtons[1].classList.contains('mdc-tab--active')).toBeTruthy();
	});
	it('should emit tabEventChange when MDCTabBar:activated is emited', async () => {
		const page = await newSpecPage({
			components: [UI_V2Tabs],
			template: () => <scib-ui-v2-tabs tabOptions={tabsMock}></scib-ui-v2-tabs>
		});
		const component: UI_V2Tabs = page.rootInstance;
		const spy = jest.spyOn(component.tabEventChange, 'emit');
		const event = new CustomEvent('MDCTabBar:activated', { detail: { index: 0 } });
		(component as any)._tabRef.root.dispatchEvent(event);
		expect(spy).toHaveBeenCalledWith(tabsMock[0]);
	});

	describe('activeIndex (watch)', () => {
		it('should activate the tab with index 2 when selected index 2 having 3 tabs (inside tabs boundaries)', async () => {
			const page = await newSpecPage({
				components: [UI_V2Tabs],
				template: () => <scib-ui-v2-tabs tabOptions={tabsMock}></scib-ui-v2-tabs>
			});
			const component: UI_V2Tabs = page.rootInstance;
			const activateTabSpy = jest.spyOn((component as any)._tabRef, 'activateTab');
			component.activeIndex = 2;
			expect(activateTabSpy).toHaveBeenCalledWith(2);
		});
		it('should activate the tab with index 0 when selected index -1 having 3 tabs (outside tabs boundaries)', async () => {
			const page = await newSpecPage({
				components: [UI_V2Tabs],
				template: () => <scib-ui-v2-tabs tabOptions={tabsMock}></scib-ui-v2-tabs>
			});
			const component: UI_V2Tabs = page.rootInstance;
			const activateTabSpy = jest.spyOn((component as any)._tabRef, 'activateTab');
			component.activeIndex = -1;
			expect(activateTabSpy).toHaveBeenCalledWith(0);
		});
		it('should activate the tab with index 0 when selected index 3 having 3 tabs (outside tabs boundaries)', async () => {
			const page = await newSpecPage({
				components: [UI_V2Tabs],
				template: () => <scib-ui-v2-tabs tabOptions={tabsMock}></scib-ui-v2-tabs>
			});
			const component: UI_V2Tabs = page.rootInstance;
			const activateTabSpy = jest.spyOn((component as any)._tabRef, 'activateTab');
			component.activeIndex = 3;
			expect(activateTabSpy).toHaveBeenCalledWith(0);
		});
	});
	describe('tabOptions (watch)', () => {
		it('should activate the tab with index 1 when selected index 1 and setting new 3 tabs', async () => {
			const page = await newSpecPage({
				components: [UI_V2Tabs],
				template: () => <scib-ui-v2-tabs activeIndex={1}></scib-ui-v2-tabs>
			});
			const component: UI_V2Tabs = page.rootInstance;
			const activateTabSpy = jest.spyOn((component as any)._tabRef, 'activateTab');
			component.tabOptions = tabsMock;
			expect(activateTabSpy).toHaveBeenCalledWith(1);
		});
	});
});
