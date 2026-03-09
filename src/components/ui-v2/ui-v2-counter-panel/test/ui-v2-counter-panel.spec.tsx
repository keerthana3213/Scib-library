import { UI_V2CounterPanel } from '../component/ui-v2-counter-panel';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-counter-panel', () => {
	describe('render', () => {
		it('should not render the container when the parameter panels is an empty array', async () => {
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={[]} singleSelection={true}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const panelContainer = page.root.shadowRoot.querySelector('.counter-panel');
			expect(panelContainer).toBeFalsy();
		});
		it('should render 2 element when the parameter panels is an array with 2 panel objects', async () => {
			const panelMock = [
				{
					label: 'string',
					color: 'string',
					status: 'string',
					counter: 4,
				},
				{
					label: 'string1',
					color: 'string1',
					status: 'string1',
					counter: 1,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock} singleSelection={true}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const panelContainer = page.root.shadowRoot.querySelector('.counter-panel');
			expect(panelContainer.childNodes.length).toEqual(2);
		});
		it('should render the panel label as parameter when panel label exist', async () => {
			const panelMock = [
				{
					label: 'string Label',
					color: 'string',
					status: 'string',
					counter: 1,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const panelContainer = page.root.shadowRoot.querySelector('.counter-panel');
			const label = (panelContainer.childNodes[0] as HTMLElement).querySelector('.counter-panel__label');
			expect(label.textContent).toBe('string Label');
		});
		it('should render the panel counter as parameter', async () => {
			const panelMock = [
				{
					label: 'string Label',
					color: 'string',
					status: 'string',
					counter: 1,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const panelContainer = page.root.shadowRoot.querySelector('.counter-panel');
			const counter = (panelContainer.childNodes[0] as HTMLElement).querySelector('.counter-panel__card__text');
			expect(counter.textContent).toBe('1');
		});
		it('should add counter-panel__card--opacity class when id is not clicked', async () => {
			const panelMock = [
				{
					label: 'Pend. paid',
					status: 'pendingPaid',
					color: '#F2AB4E',
					counter: 4,
				},
				{
					label: 'Issued',
					status: 'issued',
					color: '#1BB3BC',
					counter: 1,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const panels: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.counter-panel__card');
			panels[0].click();
			await page.waitForChanges();
			expect(panels[0].classList.contains('counter-panel__card--opacity')).toBe(false);
			expect(panels[1].classList.contains('counter-panel__card--opacity')).toBe(true);
		});
		it('should add counter-panel__card--active class when id is clicked', async () => {
			const panelMock = [
				{
					label: 'Pend. paid',
					status: 'pendingPaid',
					color: '#F2AB4E',
					counter: 4,
				},
				{
					label: 'Issued',
					status: 'issued',
					color: '#1BB3BC',
					counter: 1,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const panels: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.counter-panel__card');
			panels[0].click();
			await page.waitForChanges();
			expect(panels[0].classList.contains('counter-panel__card--active')).toBe(true);
			expect(panels[1].classList.contains('counter-panel__card--active')).toBe(false);
		});
		it('should remove the previously selected element on the array and emit the array when clicked two times', async () => {
			const panelMock = [
				{
					label: 'string',
					color: 'string',
					status: 'string',
					counter: 4,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const component: UI_V2CounterPanel = page.rootInstance;
			const panels: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.counter-panel__card');
			panels[0].click();
			const panelClickEvent = jest.spyOn(component.panelClick, 'emit');
			panels[0].click();
			expect(panelClickEvent).toHaveBeenCalledWith([]);
		});
		it('should emit an array with the first element when the user clicked (second, first) and singleSelection is true', async () => {
			const panelMock = [
				{
					label: 'string',
					color: 'string',
					status: 'string',
					counter: 4,
				},
				{
					label: 'string1',
					color: 'string1',
					status: 'string1',
					counter: 1,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock} singleSelection={true}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const component: UI_V2CounterPanel = page.rootInstance;
			const panelclickEmit = jest.spyOn(component.panelClick, 'emit');
			const panels: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.counter-panel__card');
			panels[1].click();
			panels[0].click();
			const calls = panelclickEmit.mock.calls;
			expect(calls[calls.length - 1][0]).toEqual([
				{
					label: 'string',
					color: 'string',
					status: 'string',
					counter: 4,
				},
			]);
		});
		it('should emit an array with the second and first element when the user clicked (second, first) and singleSelection is false', async () => {
			const panelMock = [
				{
					label: 'string',
					color: 'string',
					status: 'string',
					counter: 4,
				},
				{
					label: 'string1',
					color: 'string1',
					status: 'string1',
					counter: 1,
				},
			];
			const page = await newSpecPage({
				components: [UI_V2CounterPanel],
				template: () => <scib-ui-v2-counter-panel panels={panelMock} singleSelection={false}></scib-ui-v2-counter-panel>,
				supportsShadowDom: true,
			});
			const component: UI_V2CounterPanel = page.rootInstance;
			const panelclickEmit = jest.spyOn(component.panelClick, 'emit');
			const panels: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.counter-panel__card');
			panels[1].click();
			panels[0].click();
			expect(panelclickEmit).toHaveBeenCalledWith([
				{
					label: 'string1',
					color: 'string1',
					status: 'string1',
					counter: 1,
				},
				{
					label: 'string',
					color: 'string',
					status: 'string',
					counter: 4,
				},
			]);
		});
	});
});
