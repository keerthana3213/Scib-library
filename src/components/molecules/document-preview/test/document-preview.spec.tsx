import { DocumentPreviewExtensions } from '../models/document-preview.model';
import { MoleculesDocumentPreview } from '../component/document-preview';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe('molecules-document-preview', () => {
	const filesMock = [
		{
			name: 'Test-file(1).pdf',
			extension: DocumentPreviewExtensions.pdf,
			size: '175.8 KB',
			downloable: false,
			formatedSize: '165.8 KB',
			error: undefined,
			disableRemoveFile: false
		},
		{
			name: 'Test-file(2).jpg',
			extension: DocumentPreviewExtensions.jpg,
			size: '1.8 MB',
			downloable: true,
			disableRemoveFile: false
		},
		{
			name: 'Test-file(3).pdf',
			extension: DocumentPreviewExtensions.pdf,
			size: '175.8 KB',
			downloable: false,
			disableRemoveFile: false,
			error: 'errorString'
		},
		{
			name: 'Test-file(4).pdf',
			extension: DocumentPreviewExtensions.pdf,
			size: '175.8 KB',
			downloable: false,
			disableRemoveFile: true
		}
	];
	describe('render', () => {
		it('should set display as block when files is defined', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const host = page.root;
			expect(host.style.display).toBe('block');
		});
		it('should set display as none when files is empty', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const host = page.root;
			expect(host.style.display).toBe('none');
		});
		it('should set display as block when files is defined', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const container = page.root.shadowRoot.querySelector('.preview-container');
			expect(container).toBeTruthy();
		});
		it('should render the header slot', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => (
					<scib-molecules-document-preview>
						<h3 slot="title" id="my-title">
							Title
						</h3>
					</scib-molecules-document-preview>
				),
				supportsShadowDom: true
			});
			const title = page.root.querySelector('#my-title');
			expect(title).toBeTruthy();
		});
		it('should set 1 element of the list with --center class when only 1 element of the files has downloable as true', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const li = page.root.shadowRoot.querySelectorAll('li.--center');
			expect(li.length).toBe(1);
		});
		it('should set 3 button with content-item-action class and only one element of the files has downloable as true', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const downloadButton = page.root.shadowRoot.querySelectorAll('.content-button-download');
			const button = page.root.shadowRoot.querySelectorAll('.content-item-action');
			expect(downloadButton.length).toBe(1);
			expect(button.length).toBe(3);
		});
		it('should set 1 button with content-button-download class when only 1 element of the files has downloable as true', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const button = page.root.shadowRoot.querySelectorAll('.content-button-download');
			expect(button.length).toBe(1);
		});
		it('should emit userAction with action as cancel when clicked the button, file has downloable as false and error undefined', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const component: MoleculesDocumentPreview = page.rootInstance;
			const button = page.root.shadowRoot.querySelectorAll('button');
			const emituserAction = jest.spyOn(component.userAction, 'emit');
			button[0].click();
			expect(emituserAction).toHaveBeenCalledWith({
				actionType: 'cancel',
				data: {
					downloable: false,
					error: undefined,
					extension: 'pdf',
					formatedSize: '165.8 KB',
					indexInFileList: 0,
					name: 'Test-file(1).pdf',
					disableRemoveFile: false,
					size: '175.8 KB'
				}
			});
		});
		it('should emit userAction with action as retry when clicked the button, file has downloable false and error defined', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const component: MoleculesDocumentPreview = page.rootInstance;
			const button = page.root.shadowRoot.querySelectorAll('button');
			const emituserAction = jest.spyOn(component.userAction, 'emit');
			button[3].click();
			expect(emituserAction).toHaveBeenCalledWith({
				actionType: 'retry',
				data: {
					downloable: false,
					error: 'errorString',
					extension: 'pdf',
					indexInFileList: 2,
					name: 'Test-file(3).pdf',
					disableRemoveFile: false,
					size: '175.8 KB'
				}
			});
		});
		it('should emit userAction when clicked the button and file has downloable as true', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const component: MoleculesDocumentPreview = page.rootInstance;
			const button = page.root.shadowRoot.querySelectorAll('button');
			const emituserAction = jest.spyOn(component.userAction, 'emit');
			button[1].click();
			expect(emituserAction).toHaveBeenCalledWith({
				actionType: 'download',
				data: {
					downloable: true,
					extension: 'jpg',
					indexInFileList: 1,
					name: 'Test-file(2).jpg',
					disableRemoveFile: false,
					size: '1.8 MB'
				}
			});
		});
		it('should set the button with --icon-content as var(--theme-scib-icon-retry) when error is defined', async () => {
			const filesMockCase = [
				{
					name: 'Test-file(1).pdf',
					extension: DocumentPreviewExtensions.pdf,
					size: '175.8 KB',
					downloable: false,
					error: 'errorString'
				},
				{
					name: 'Test-file.pdf',
					extension: DocumentPreviewExtensions.xls,
					size: '1.8 MB',
					downloable: true
				}
			];
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMockCase}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const button: HTMLButtonElement = page.root.shadowRoot.querySelector('.content-item-action');
			expect(button.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-retry)');
		});
		it('should set the button with --icon-content as var(--theme-scib-icon-close) when error does not exist', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const button: HTMLButtonElement = page.root.shadowRoot.querySelector('.content-item-action');
			expect(button.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-close)');
		});
	});
	describe('files (watch)', () => {
		it('should set _files and call scrollAttachedDocs when the files is updated', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => (
					<scib-molecules-document-preview
						files={[
							{
								name: 'Test-file(1).pdf',
								extension: DocumentPreviewExtensions.pdf,
								size: '175.8 KB',
								downloable: false,
								formatedSize: '165.8 KB',
								error: undefined
							}
						]}
					></scib-molecules-document-preview>
				),
				supportsShadowDom: true
			});
			const component: MoleculesDocumentPreview = page.rootInstance;
			const emitvalueChange = jest.spyOn(component, 'scrollAttachedDocs');
			component.files = filesMock;
			await page.waitForChanges();
			expect(component._files).toBe(filesMock);
			requestAnimationFrame(() => {
				expect(emitvalueChange).toHaveBeenCalled();
			});
		});
	});
	describe('PillContent', () => {
		it('should set the style with u-icon class as var(--theme-scib-icon-filepage) when extension is not part of the icon list', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const icon = page.root.shadowRoot.querySelectorAll('.u-icon');
			const iconFirst: HTMLSpanElement = icon[0] as HTMLSpanElement;
			expect(iconFirst.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-filepage)');
		});
		it('should set the style with u-icon class as var(--theme-scib-icon-image) when extension is part of the icon list', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const icon = page.root.shadowRoot.querySelectorAll('.u-icon');
			const iconSecond: HTMLSpanElement = icon[1] as HTMLSpanElement;
			expect(iconSecond.style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-image)');
		});
		it('should set display with block when extension is defined and it is not part of the icon list', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const extension = page.root.shadowRoot.querySelectorAll('.preview-icon-extension');
			const firstElement = extension[0] as HTMLSpanElement;
			expect(firstElement.style.display).toBe('block');
		});
		it('should set display with none when extension is not defined or part of the icon list', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const extension = page.root.shadowRoot.querySelectorAll('.preview-icon-extension');
			const secondElement: HTMLSpanElement = extension[1] as HTMLSpanElement;
			expect(secondElement.style.display).toBe('none');
		});
		it('should set extension with the property extension content', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const extension = page.root.shadowRoot.querySelectorAll('.preview-icon-extension');
			expect(extension[0].textContent).toBe('pdf');
			expect(extension[1].textContent).toBe('jpg');
			expect(extension[2].textContent).toBe('pdf');
		});
		it('should set title with the property name content', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const title = page.root.shadowRoot.querySelectorAll('.preview-icon-textcontent__title');
			expect(title[0].textContent).toBe('Test-file(1).pdf');
			expect(title[1].textContent).toBe('Test-file(2).jpg');
			expect(title[2].textContent).toBe('Test-file(3).pdf');
		});
		it('should activate --error class when error is defined', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const error = page.root.shadowRoot.querySelectorAll('.--error');
			expect(error.length).toBe(1);
		});
		it('should set subtitle content with formatedSize value when error is not a string and has formatedSize', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const title = page.root.shadowRoot.querySelectorAll('.preview-icon-textcontent__subtitle');
			expect(title[0].textContent).toBe('165.8 KB');
		});
		it('should set subtitle content with size value when error is not a string and has not formatedSize', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const title = page.root.shadowRoot.querySelectorAll('.preview-icon-textcontent__subtitle');
			expect(title[1].textContent).toBe('1.8 MB');
		});
		it('should set subtitle content with error value when error is a string', async () => {
			const page = await newSpecPage({
				components: [MoleculesDocumentPreview],
				template: () => <scib-molecules-document-preview files={filesMock}></scib-molecules-document-preview>,
				supportsShadowDom: true
			});
			const title = page.root.shadowRoot.querySelectorAll('.preview-icon-textcontent__subtitle');
			expect(title[2].textContent).toBe('errorString');
		});
	});
});
