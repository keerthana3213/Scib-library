import { AtomsToaster } from '../component/toaster';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('atoms-toaster', () => {
	describe('render', () => {
		it('should set message with the property message content', async () => {
			const page = await newSpecPage({
				components: [AtomsToaster],
				template: () => <scib-atoms-toaster open={true} message={'messageText'}></scib-atoms-toaster>,
				supportsShadowDom: true
			});
			const span: HTMLElement = page.root.shadowRoot.querySelector('.mdc-snackbar__label>span');
			expect(span.textContent).toBe('messageText');
		});
		// it('should set open as false when clicked the input', async () => {
		// 	const page = await newSpecPage({
		// 		components: [AtomsToaster],
		// 		template: () => <scib-atoms-toaster open={true}></scib-atoms-toaster>,
		// 		supportsShadowDom: true
		// 	});
		// 	const component: AtomsToaster = page.rootInstance;
		// 	component.open = true;
		// 	await page.waitForChanges();
		// 	const div: HTMLInputElement = page.root.shadowRoot.querySelector('i.icon.state__icon');
		// 	div.click();
		// 	expect(component.open).toBe(false);
		// });
	});
	describe('componentDidLoad', () => {
		// it('should set open property to false when MDCSnackbar:closed is emited', async () => {
		// 	const page = await newSpecPage({
		// 		components: [AtomsToaster],
		// 		template: () => <scib-atoms-toaster open={false}></scib-atoms-toaster>,
		// 		supportsShadowDom: true
		// 	});
		// 	const component: AtomsToaster = page.rootInstance;
		// 	component.open = true;
		// 	await page.waitForChanges();
		// 	const event = new Event('MDCSnackbar:closed');
		// 	(component as any)._snackbarRef.root.dispatchEvent(event);
		// 	expect(component.open).toBe(false);
		// });
		it('should set timeoutMs as 4040 when time is 4040 and open is true', async () => {
			const page = await newSpecPage({
				components: [AtomsToaster],
				template: () => <scib-atoms-toaster open={true} time={4040}></scib-atoms-toaster>,
				supportsShadowDom: true
			});
			const component: AtomsToaster = page.rootInstance;
			expect((component as any)._snackbarRef.timeoutMs).toBe(4040);
		});
	});
	describe('_messageHandler', () => {
		it('should update message when message parameter changed', async () => {
			const page = await newSpecPage({
				components: [AtomsToaster],
				template: () => <scib-atoms-toaster open={true}></scib-atoms-toaster>,
				supportsShadowDom: true
			});
			const component: AtomsToaster = page.rootInstance;
			component.message = 'This is the new message';
			await page.waitForChanges();
			expect(component.message).toBe('This is the new message');
		});
	});
});
