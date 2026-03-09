import { UI_V2Dialog } from '../component/ui-v2-dialog';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('ui-v2-dialog', () => {
	describe('render', () => {
		it('should render the title provided as a parameter', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => <scib-ui-v2-dialog dialogTitle={'Dialog Title'}></scib-ui-v2-dialog>,
				supportsShadowDom: true
			});
			const heading = page.root.shadowRoot.querySelector('.mdc-dialog__header__info--title');
			expect(heading.textContent).toBe('Dialog Title');
		});
		it('should render the header slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => (
					<scib-ui-v2-dialog>
						<h3 slot="header" id="my-header">
							Header
						</h3>
					</scib-ui-v2-dialog>
				),
				supportsShadowDom: true
			});
			const header = page.root.querySelector('#my-header');
			expect(header).toBeTruthy();
		});
		it('should render the content slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => (
					<scib-ui-v2-dialog>
						<p slot="content" id="my-content">
							Content
						</p>
					</scib-ui-v2-dialog>
				),
				supportsShadowDom: true
			});
			const content = page.root.querySelector('#my-content');
			expect(content).toBeTruthy();
		});
		it('should render the actions slot', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => (
					<scib-ui-v2-dialog>
						<div slot="actions" id="my-actions"></div>
					</scib-ui-v2-dialog>
				),
				supportsShadowDom: true
			});
			const actions = page.root.querySelector('#my-actions');
			expect(actions).toBeTruthy();
		});
		it('should render a close icon when disableClose is not provided (defaults to false)', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => <scib-ui-v2-dialog></scib-ui-v2-dialog>,
				supportsShadowDom: true
			});
			const icon = page.root.shadowRoot.querySelector('.mdc-dialog__header__close');
			expect(icon).toBeTruthy();
		});
		it('should render a close icon when disableClose is false', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => <scib-ui-v2-dialog disableClose={false}></scib-ui-v2-dialog>,
				supportsShadowDom: true
			});
			const icon = page.root.shadowRoot.querySelector('.mdc-dialog__header__close');
			expect(icon).toBeTruthy();
		});
		it('should not render a close icon when disableClose is true', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => <scib-ui-v2-dialog disableClose={true}></scib-ui-v2-dialog>,
				supportsShadowDom: true
			});
			const icon = page.root.shadowRoot.querySelector('.mdc-dialog__header__close');
			expect(icon).toBeFalsy();
		});
		// it('should update open property to false when clicked on the close icon', async () => {
		// 	const page = await newSpecPage({
		// 		components: [UI_V2Dialog],
		// 		template: () => <scib-ui-v2-dialog open={true}></scib-ui-v2-dialog>,
		// 		supportsShadowDom: true
		// 	});
		// 	const icon: HTMLElement = page.root.shadowRoot.querySelector('.icon');
		// 	icon.click();
		// 	const isOpen = page.root.hasAttribute('open');
		// 	expect(isOpen).toBe(false);
		// });
	});
	describe('open (watch)', () => {
		it('should open the dialog when open is set to true and was previously set to false', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => <scib-ui-v2-dialog open={false}></scib-ui-v2-dialog>
			});
			const component: UI_V2Dialog = page.rootInstance;
			const dialogOpenSpy = jest.spyOn((component as any)._dialogRef, 'open');
			component.open = true;
			await page.waitForChanges();
			expect(dialogOpenSpy).toHaveBeenCalled();
		});
		it('should not open the dialog when it was previously opened', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => <scib-ui-v2-dialog open={true}></scib-ui-v2-dialog>
			});
			const component: UI_V2Dialog = page.rootInstance;
			const dialogOpenSpy = jest.spyOn((component as any)._dialogRef, 'open');
			component.open = true;
			await page.waitForChanges();
			expect(dialogOpenSpy).not.toHaveBeenCalled();
		});
		it('should emit dialogOpened when dialog was opened', async () => {
			const page = await newSpecPage({
				components: [UI_V2Dialog],
				template: () => <scib-ui-v2-dialog open={false}></scib-ui-v2-dialog>
			});
			const component: UI_V2Dialog = page.rootInstance;
			const spy = jest.spyOn(component.dialogOpened, 'emit');
			component.open = true;
			await page.waitForChanges();
			expect(spy).toHaveBeenCalled();
		});
	});
	// describe('componentDidLoad', () => {
	// 	it('should emit dialogClosed and update open property to false when MDCDialog:closed is emited', async () => {
	// 		const page = await newSpecPage({
	// 			components: [UI_V2Dialog],
	// 			template: () => <scib-ui-v2-dialog></scib-ui-v2-dialog>
	// 		});
	// 		const component: UI_V2Dialog = page.rootInstance;
	// 		const spy = jest.spyOn(component.dialogClosed, 'emit');
	// 		const event = new Event('MDCDialog:closed');
	// 		(component as any)._dialogRef.root.dispatchEvent(event);
	// 		const isOpen = page.root.hasAttribute('open');
	// 		expect(isOpen).toBe(false);
	// 		expect(spy).toHaveBeenCalled();
	// 	});
	// });
});
