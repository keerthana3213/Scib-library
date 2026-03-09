import { UI_V2Drawer } from '../component/ui-v2-drawer';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-drawer', () => {
	describe('render', () => {
		it('should active mdc-drawer--right when right is true', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => <scib-ui-v2-drawer rightSide={true}></scib-ui-v2-drawer>,
				supportsShadowDom: true
			});
			const aside = page.root.shadowRoot.querySelector('aside');
			expect(aside.classList.contains('mdc-drawer--right')).toBe(true);
		});
		it('should render the title provided as a parameter', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => <scib-ui-v2-drawer text={'Drawer Title'}></scib-ui-v2-drawer>,
				supportsShadowDom: true
			});
			const title = page.root.shadowRoot.querySelector('.mdc-drawer__header__title');
			expect(title.textContent).toBe('Drawer Title');
		});
		it('should render the top slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => (
					<scib-ui-v2-drawer>
						<h3 slot="top" id="my-top">
							top
						</h3>
					</scib-ui-v2-drawer>
				),
				supportsShadowDom: true
			});
			const top = page.root.querySelector('#my-top');
			expect(top).toBeTruthy();
		});
		it('should render the bottom slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => (
					<scib-ui-v2-drawer>
						<h3 slot="bottom" id="my-bottom">
							bottom
						</h3>
					</scib-ui-v2-drawer>
				),
				supportsShadowDom: true
			});
			const bottom = page.root.querySelector('#my-bottom');
			expect(bottom).toBeTruthy();
		});
		it('should render the content slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => (
					<scib-ui-v2-drawer>
						<p id="my-content">Content</p>
					</scib-ui-v2-drawer>
				),
				supportsShadowDom: true
			});
			const content = page.root.querySelector('#my-content');
			expect(content).toBeTruthy();
		});

		it('should update open equal false when clicked', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => <scib-ui-v2-drawer></scib-ui-v2-drawer>,
				supportsShadowDom: true
			});
			const component: UI_V2Drawer = page.rootInstance;
			const closeButton: HTMLButtonElement = page.root.shadowRoot.querySelector('.mdc-drawer__header__close');
			(closeButton.firstChild as HTMLElement).click();
			expect((component as any)._drawerRef.open).toBe(false);
		});
	});
	describe('componentDidLoad', () => {
		it('should emit closed when MDCDrawer:closed is emitted', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => <scib-ui-v2-drawer></scib-ui-v2-drawer>
			});
			const component: UI_V2Drawer = page.rootInstance;
			const spy = jest.spyOn(component.closed, 'emit');
			const event = new CustomEvent('MDCDrawer:closed');
			(component as any)._drawerRef.root.dispatchEvent(event);
			expect(spy).toHaveBeenCalled();
		});
		it('should emit opened when MDCDrawer:opened is emitted', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => <scib-ui-v2-drawer></scib-ui-v2-drawer>
			});
			const component: UI_V2Drawer = page.rootInstance;
			const spy = jest.spyOn(component.opened, 'emit');
			const event = new CustomEvent('MDCDrawer:opened');
			(component as any)._drawerRef.root.dispatchEvent(event);
			expect(spy).toHaveBeenCalled();
		});
	});
	describe('open (watch)', () => {
		it('should set open property of drawerRef when open property changes', async () => {
			const page = await newSpecPage({
				components: [UI_V2Drawer],
				template: () => <scib-ui-v2-drawer></scib-ui-v2-drawer>,
				supportsShadowDom: true
			});
			const component: UI_V2Drawer = page.rootInstance;
			component.open = true;
			await page.waitForChanges();
			expect((component as any)._drawerRef.open).toBe(true);
		});
	});
});
