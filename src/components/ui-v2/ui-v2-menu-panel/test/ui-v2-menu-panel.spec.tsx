import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { UI_V2MenuPanel } from '../component/ui-v2-menu-panel';

describe('ui-v2-menu-panel', () => {
	const menuMock = [
		{
			label: 'Opción 1',
			icon: 'edit-pencil',
			id: '1',
			data: {}
		},
		{
			label: 'Opción 2',
			icon: 'delete',
			id: '2',
			data: {}
		}
	];
	const menuMockPosition = [
		{
			label: 'Opción 1',
			id: '1',
			data: {
				row: {
					topPosition: false
				}
			}
		},
		{
			label: 'Opción 2',
			icon: 'delete',
			id: '2',
			data: {}
		}
	];
	describe('render', () => {
		it('should create 2 list element when itemList has 2 elements', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMock}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const listItem = page.root.shadowRoot.querySelectorAll('.mdc-list-item');
			expect(listItem.length).toBe(2);
		});
		it('should create 1 span with item-container class when only 1 element has icon', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMockPosition}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const containerClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__item-container');
			expect(containerClass.length).toBe(1);
		});
		it('should set style value of the item-container class with the icon value', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMock}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const containerClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__item-container');
			const firstElement = containerClass[0];
			const secondlement = containerClass[1];
			expect(firstElement.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-edit-pencil)');
			expect(secondlement.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-delete)');
		});
		it('should set the content of the item__Text class with the label value', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMock}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const textClass: NodeListOf<HTMLElement> = page.root.shadowRoot.querySelectorAll('.mdc-list-item__text');
			const firstElement = textClass[0];
			const secondlement = textClass[1];
			expect(firstElement.textContent).toBe('Opción 1');
			expect(secondlement.textContent).toBe('Opción 2');
		});
		it('should update $topPosition value with -120 value when topPosition is false and itemList has 2 elements', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMockPosition}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const component: UI_V2MenuPanel = page.rootInstance;
			expect(component.$topPosition).toBe(-120);
		});
	});
	describe('componentDidLoad', () => {
		it('should emit menuPanelClosed when MDCMenuSurface:closed is emited', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMock} open={true}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const component: UI_V2MenuPanel = page.rootInstance;
			const emitmenuPanelClosed = jest.spyOn(component.menuPanelClosed, 'emit');
			const event = new Event('MDCMenuSurface:closed');
			(component as any)._menuPanel.root.dispatchEvent(event);
			expect(emitmenuPanelClosed).toHaveBeenCalled();
		});
		it('should emit selectedOption when MDCMenu:selected is emited', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMock} open={true}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const component: UI_V2MenuPanel = page.rootInstance;
			const emitselectedOption = jest.spyOn(component.selectedOption, 'emit');
			const event = new CustomEvent('MDCMenu:selected', { detail: { index: 0 } });
			(component as any)._menuPanel.root.dispatchEvent(event);
			expect(emitselectedOption).toHaveBeenCalled();
		});
	});
	describe('disconnectedCallback', () => {
		it('should unlisten all events', async () => {
			const page = await newSpecPage({
				components: [UI_V2MenuPanel],
				template: () => <scib-ui-v2-menu-panel itemList={menuMock}></scib-ui-v2-menu-panel>,
				supportsShadowDom: true
			});
			const component: UI_V2MenuPanel = page.rootInstance;
			const unlistenSpy = jest.spyOn((component as any)._menuPanel, 'unlisten');
			// page.body.removeChild(page.root);
			// await page.waitForChanges();

			//call destroy method to check if unlisten these events
			(component as any)._destroy();
			const unlistenSpyCalls = unlistenSpy.mock.calls.map(([param]) => param);
			expect(unlistenSpyCalls.includes('MDCMenu:selected')).toBe(true);
			expect(unlistenSpyCalls.includes('MDCMenuSurface:closed')).toBe(true);
		});
	});
});
