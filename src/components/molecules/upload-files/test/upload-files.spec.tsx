import { MoleculesUploadFiles } from '../component/upload-files';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

describe.skip('molecules-upload-files', () => {
	const literalMock = {
		titleselector: 'Select or drag files to upload*',
		errorMaxFiles: 'Sorry, you cannot upload more than 1 files at a time',
		errorFormat: 'The file or extension is not supported',
		errorDuplicate: 'Duplicated filename',
		fileListTitle: 'TitleName of the List',
		fileSelectedText: 'Attached document',
		labelSelector: 'labelSelector'
	};

	const mockFile = {
		id: 1,
		extension: '.txt',
		formatedSize: '22.50 kB',
		lastModified: 1644930132324,
		lastModifiedDate: 'Tue Feb 15 2022 14:02:12 GMT+0100 (hora estándar de Europa central)',
		name: 'hola.txt',
		size: 23040,
		type: 'text/plain',
		webkitRelativePath: ''
	};

	describe('render', () => {
		it('should activate upload-files__title class when literals has definite fileListTitle', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const title = page.root.shadowRoot.querySelector('.upload-files__title');
			expect(title).toBeTruthy();
		});
		it('should set strong element with the property fileListTitle content', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const title = page.root.shadowRoot.querySelector('strong');
			expect(title.textContent).toBe('TitleName of the List');
		});
		it('should set colLg with 6 when showUploadFiles is true and _filesArray has elements', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						styleVariant={'standard'}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new CustomEvent('drop', {
				dataTransfer: {
					files: []
				}
			} as any);
			component._hostRef.dispatchEvent(event);
			const column = page.root.shadowRoot.querySelector('scib-ui-column');
			await page.waitForChanges();
			expect(column.getAttribute('colLg')).toBe('6');
		});
		it('should set colLg with 6 when showUploadFiles is false or _filesArray has not element', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const column = page.root.shadowRoot.querySelector('scib-ui-column');
			expect(column.getAttribute('colLg')).toBe('6');
		});
		it('should activate c-label class when literals has definite labelSelector', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const label = page.root.shadowRoot.querySelector('.c-label');
			expect(label).toBeTruthy();
		});
		it('should set dropdown class with the property labelSelector content', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const dropdown = page.root.shadowRoot.querySelector('.sc-scib-ui-dropdown');
			expect(dropdown.textContent).toBe('labelSelector');
		});
		it('should activate upload-files__draggdrop--drop class when _highlighted is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new Event('dragover');
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			const drop = page.root.shadowRoot.querySelector('.upload-files__draggdrop--drop');
			expect(drop).toBeTruthy();
		});
		// it('should emit navigatorClicked when clicked the button with upload-files__draggdrop class and idelement is not defined', async () => {
		// 	const page = await newSpecPage({
		// 		components: [MoleculesUploadFiles],
		// 		template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
		// 	});
		// 	const component: MoleculesUploadFiles = page.rootInstance;
		// 	const button: HTMLDivElement = page.root.shadowRoot.querySelector('.upload-files__draggdrop');
		// 	const emitnavigatorClicked = jest.spyOn(component.navigatorClicked, 'emit');
		// 	button.click();
		// 	expect(emitnavigatorClicked).toHaveBeenCalled();
		// });
		// it('should call click of getElementById when clicked the button with upload-files__draggdrop class and idelement is defined', async () => {
		// 	const page = await newSpecPage({
		// 		components: [MoleculesUploadFiles],
		// 		template: () => <scib-molecules-upload-files literals={literalMock} idelement={'definedElement'}></scib-molecules-upload-files>
		// 	});
		// 	const button: HTMLDivElement = page.root.shadowRoot.querySelector('.upload-files__draggdrop');
		// 	const emitClick = jest.spyOn(page.root.shadowRoot.getElementById('definedElement'), 'click');
		// 	button.click();
		// 	expect(emitClick).toHaveBeenCalled();
		// });
		it('should set upload-files__txt class with the property titleselector content', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const files = page.root.shadowRoot.querySelector('.upload-files__txt');
			expect(files.textContent).toBe('Select or drag files to upload*');
		});
		it('should activate upload-files__error class with the errorMaxFiles property when maxFileLimit is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			(component as any).$maxFileLimit = true;
			await page.waitForChanges();
			const error = page.root.shadowRoot.querySelector('.upload-files__error');
			expect(error.textContent).toBe('Sorry, you cannot upload more than 1 files at a time');
		});
		it('should activate upload-files__error class with the errorFormat property when _errorFile is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			(component as any).$errorFile = true;
			await page.waitForChanges();
			const error = page.root.shadowRoot.querySelector('.upload-files__error');
			expect(error.textContent).toBe('The file or extension is not supported');
		});
		it('should activate upload-files__error class with the errorDuplicate property when _duplicatedFilename is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			(component as any).$duplicatedFilename = true;
			await page.waitForChanges();
			const error = page.root.shadowRoot.querySelector('.upload-files__error');
			expect(error.textContent).toBe('Duplicated filename');
		});
		it('should set scib-molecules-document-preview with the property fileSelectedText content', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new CustomEvent('drop', { dataTransfer: { files: [mockFile] } } as any);
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			const previw = page.root.shadowRoot.querySelector('scib-molecules-document-preview');
			expect(previw.firstChild.textContent).toBe('Attached document');
		});
		it('should activate upload-files--disabled class when disabled is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
						disabled={true}
					></scib-molecules-upload-files>
				)
			});
			const disable = page.root.shadowRoot.querySelector('.upload-files--disabled');
			expect(disable).toBeTruthy();
		});
		it('should activate upload-files__action--disabled class when disabled is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
						disabled={true}
					></scib-molecules-upload-files>
				)
			});
			const disable = page.root.shadowRoot.querySelector('.upload-files__action--disabled');
			expect(disable).toBeTruthy();
		});
		it('should activate upload-files--disabled class when _maxFileDisabled is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={1}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new CustomEvent('drop', { dataTransfer: { files: [mockFile] } } as any);
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			const disable = page.root.shadowRoot.querySelector('.upload-files--disabled');
			expect(disable).toBeTruthy();
		});
		it('should activate upload-files__action--disabled class when _maxFileDisabled is true', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={1}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new CustomEvent('drop', { dataTransfer: { files: [mockFile] } } as any);
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			const disable = page.root.shadowRoot.querySelector('.upload-files__action--disabled');
			expect(disable).toBeTruthy();
		});
	});
	describe('componentDidLoad', () => {
		it('should call handleFiles and set _highlighted as false when drop EventListener is emited', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new CustomEvent('drop', { dataTransfer: { files: [{ ...mockFile, extension: '.pdf', name: 'hola.pdf' }] } } as any);
			const emithandleFiles = jest.spyOn(component, 'handleFiles');
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			expect((component as any).$highlighted).toBe(false);
			expect(emithandleFiles).toHaveBeenCalledWith([{ ...mockFile, extension: '.pdf', name: 'hola.pdf' }]);
		});
		it('should call event preventDefault, stopPropagation and set _highlighted as true when dragover EventListener is emited', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new Event('dragover');
			const emitstopPropagation = jest.spyOn(event, 'stopPropagation');
			const emitpreventDefault = jest.spyOn(event, 'preventDefault');
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			expect((component as any).$highlighted).toBe(true);
			expect(emitstopPropagation).toHaveBeenCalled();
			expect(emitpreventDefault).toHaveBeenCalled();
		});
		it('should call event preventDefault, stopPropagation and set _highlighted as false when dragenter EventListener is emited', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new Event('dragenter');
			const emitstopPropagation = jest.spyOn(event, 'stopPropagation');
			const emitpreventDefault = jest.spyOn(event, 'preventDefault');
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			expect((component as any).$highlighted).toBe(false);
			expect(emitstopPropagation).toHaveBeenCalled();
			expect(emitpreventDefault).toHaveBeenCalled();
		});
		it('should call event preventDefault, stopPropagation and set _highlighted as false when dragleave EventListener is emited', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files
						showUploadFiles={true}
						literals={literalMock}
						maxfiles={3}
						allowedFilesExt={['.txt', '.csv']}
					></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new Event('dragenter');
			const emitpreventDefault = jest.spyOn(event, 'preventDefault');
			component._hostRef.dispatchEvent(event);
			await page.waitForChanges();
			expect((component as any).$highlighted).toBe(false);
			expect(emitpreventDefault).toHaveBeenCalled();
		});
	});
	describe('maxFilesAllowed', () => {
		// it('should set _maxFileLimit as false when maxFilesAllowed is executed with maxfiles smaller than files length (with timer)', async () => {
		// 	const page = await newSpecPage({
		// 		components: [MoleculesUploadFiles],
		// 		template: () => (
		// 			<scib-molecules-upload-files literals={literalMock} maxfiles={1} allowedFilesExt={['.txt', '.csv']}></scib-molecules-upload-files>
		// 		)
		// 	});
		// 	const component: MoleculesUploadFiles = page.rootInstance;
		// 	component.maxFilesAllowed([{ name: 'first.txt' }, { name: 'second.csv' }]);
		// 	await page.waitForChanges();
		// 	expect(component.$maxFileLimit).toBe(true);
		// 	setTimeout(() => {
		// 		expect(component.$maxFileLimit).toBe(false);
		// 	}, 7000);
		// });
		it('should set _maxFileLimit as true when maxFilesAllowed is executed with maxfiles smaller than files length (without timer)', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files literals={literalMock} maxfiles={1} allowedFilesExt={['.txt', '.csv']}></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			component.maxFilesAllowed([{ name: 'first.txt' }, { name: 'second.csv' }]);
			expect(component.$maxFileLimit).toBe(true);
		});
		it('should set _maxFileLimit as false when maxFilesAllowed is executed with maxfiles bigger than files length', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files literals={literalMock} maxfiles={3} allowedFilesExt={['.txt', '.csv']}></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			component.maxFilesAllowed([{ name: 'first.txt' }, { name: 'second.csv' }]);
			expect(component.$maxFileLimit).toBe(false);
		});
	});
	describe('handleFiles', () => {
		it('should call emitCurrentUploads with [] when handleFiles is executed with maxfiles equal to files length', async () => {
			const page = await newSpecPage({
				components: [MoleculesUploadFiles],
				template: () => (
					<scib-molecules-upload-files literals={literalMock} maxfiles={0} allowedFilesExt={['.txt', '.csv']}></scib-molecules-upload-files>
				)
			});
			const component: MoleculesUploadFiles = page.rootInstance;
			const event = new CustomEvent('drop', { dataTransfer: { files: [] } } as any);
			const emitCurrentUploads = jest.spyOn(component, 'emitCurrentUploads');
			component._hostRef.dispatchEvent(event);
			expect(emitCurrentUploads).not.toHaveBeenCalledWith(event);
		});
	});
	describe('validateFile', () => {
		// it('should set _errorFile as false when validateFile is executed with a invalid extension (with timer)', async () => {
		// 	const page = await newSpecPage({
		// 		components: [MoleculesUploadFiles],
		// 		template: () => (
		// 			<scib-molecules-upload-files
		// 				showUploadFiles={true}
		// 				literals={literalMock}
		// 				maxfiles={3}
		// 				allowedFilesExt={['.txt', '.csv']}
		// 			></scib-molecules-upload-files>
		// 		)
		// 	});
		// 	const component: MoleculesUploadFiles = page.rootInstance;
		// 	const event = new CustomEvent('drop', { dataTransfer: { files: [mockFile] } } as any);
		// 	component._hostRef.dispatchEvent(event);
		// 	await page.waitForChanges();
		// 	expect(component.$errorFile).toBe(false);
		// 	setTimeout(() => {
		// 		expect(component.$errorFile).toBe(true);
		// 	}, 7000);
		// });
		// it('should set _errorFile as true when validateFile is executed with a invalid extension (without timer)', async () => {
		// 	const page = await newSpecPage({
		// 		components: [MoleculesUploadFiles],
		// 		template: () => (
		// 			<scib-molecules-upload-files
		// 				showUploadFiles={true}
		// 				literals={literalMock}
		// 				maxfiles={3}
		// 				allowedFilesExt={['.txt', '.csv']}
		// 			></scib-molecules-upload-files>
		// 		)
		// 	});
		// 	const component: MoleculesUploadFiles = page.rootInstance;
		// 	const event = new CustomEvent('drop', { dataTransfer: { files: [{ ...mockFile, name: 'test.pdf', extension: '.pdf' }] } } as any);
		// 	component._hostRef.dispatchEvent(event);
		// 	expect(component.$errorFile).toBe(true);
		// });
		// it('should set _duplicatedFilename as false and not call component push when validateFile is executed with a valid extension (with timer)', async () => {
		// 	const page = await newSpecPage({
		// 		components: [MoleculesUploadFiles],
		// 		template: () => (
		// 			<scib-molecules-upload-files
		// 				showUploadFiles={true}
		// 				literals={literalMock}
		// 				maxfiles={3}
		// 				allowedFilesExt={['.txt', '.csv']}
		// 			></scib-molecules-upload-files>
		// 		)
		// 	});
		// 	const component: MoleculesUploadFiles = page.rootInstance;
		// 	const componentPush = spyOn(component.filesValidated, 'push');
		// 	const event = new CustomEvent('drop', {
		// 		dataTransfer: { files: [mockFile, mockFile] }
		// 	} as any);
		// 	component._hostRef.dispatchEvent(event);
		// 	setTimeout(() => {
		// 		expect(component.$duplicatedFilename).toBe(false);
		// 		expect(componentPush).not.toHaveBeenCalled();
		// 	}, 7000);
		// });
	});
	// describe('formatSize', () => {
	// 	it('should set _filesArray as formatedFiles when formatFileSize is true', async () => {
	// 		const page = await newSpecPage({
	// 			components: [MoleculesUploadFiles],
	// 			template: () => (
	// 				<scib-molecules-upload-files
	// 					formatFileSize={true}
	// 					literals={literalMock}
	// 					maxfiles={3}
	// 					allowedFilesExt={['.txt', '.csv']}
	// 				></scib-molecules-upload-files>
	// 			)
	// 		});
	// 		const component: MoleculesUploadFiles = page.rootInstance;
	// 		const event = new CustomEvent('drop', {
	// 			dataTransfer: {
	// 				files: [mockFile, { ...mockFile, extension: '.csv', name: 'mundo.csv' }]
	// 			}
	// 		} as any);
	// 		component._hostRef.dispatchEvent(event);
	// 		await page.waitForChanges();
	// 		expect((component as any).$filesArray).toEqual([mockFile, { ...mockFile, extension: '.csv', name: 'mundo.csv' }]);
	// 	});
	// });
	// describe('handleUserActionFile', () => {
	// 	it('should emit eventFormChange when actionType is cancel and onUserAction is activated', async () => {
	// 		const page = await newSpecPage({
	// 			components: [MoleculesUploadFiles],
	// 			template: () => (
	// 				<scib-molecules-upload-files
	// 					showUploadFiles={true}
	// 					literals={literalMock}
	// 					maxfiles={3}
	// 					allowedFilesExt={['.txt', '.csv']}
	// 				></scib-molecules-upload-files>
	// 			)
	// 		});
	// 		const component: MoleculesUploadFiles = page.rootInstance;
	// 		const event = new CustomEvent('drop', { dataTransfer: { files: [mockFile] } } as any);
	// 		const eventAction = new CustomEvent('userAction', {
	// 			detail: { actionType: 'cancel', data: { indexInFileList: 2 } }
	// 		});
	// 		const emiteventFormChange = jest.spyOn(component.eventFormChange, 'emit');
	// 		component._hostRef.dispatchEvent(event);
	// 		await page.waitForChanges();
	// 		const previw = page.root.shadowRoot.querySelector('scib-molecules-document-preview');
	// 		component.name = 'newName';
	// 		previw.dispatchEvent(eventAction);
	// 		expect(emiteventFormChange).toHaveBeenCalledWith({
	// 			name: 'newName',
	// 			required: undefined,
	// 			value: [mockFile]
	// 		});
	// 	});
	// 	it('should not emit eventFormChange when actionType is download and onUserAction is activated', async () => {
	// 		const page = await newSpecPage({
	// 			components: [MoleculesUploadFiles],
	// 			template: () => (
	// 				<scib-molecules-upload-files
	// 					showUploadFiles={true}
	// 					literals={literalMock}
	// 					maxfiles={3}
	// 					allowedFilesExt={['.txt', '.csv']}
	// 				></scib-molecules-upload-files>
	// 			)
	// 		});
	// 		const component: MoleculesUploadFiles = page.rootInstance;
	// 		const event = new CustomEvent('drop', { dataTransfer: { files: [mockFile] } } as any);
	// 		const eventAction = new CustomEvent('userAction', {
	// 			detail: { actionType: 'download', data: { indexInFileList: 0 } }
	// 		});
	// 		const emiteventFormChange = jest.spyOn(component.eventFormChange, 'emit');
	// 		component._hostRef.dispatchEvent(event);
	// 		await page.waitForChanges();
	// 		const previw = page.root.shadowRoot.querySelector('scib-molecules-document-preview');
	// 		component.name = 'newName';
	// 		previw.dispatchEvent(eventAction);
	// 		expect(emiteventFormChange).not.toHaveBeenCalledWith({
	// 			name: 'newName',
	// 			required: undefined,
	// 			value: [{ extension: '.txt', name: 'hola.txt' }]
	// 		});
	// 	});
	// 	it('should not emit eventFormChange when actionType is not download or cancel and onUserAction is activated', async () => {
	// 		const page = await newSpecPage({
	// 			components: [MoleculesUploadFiles],
	// 			template: () => (
	// 				<scib-molecules-upload-files
	// 					showUploadFiles={true}
	// 					literals={literalMock}
	// 					maxfiles={3}
	// 					allowedFilesExt={['.txt', '.csv']}
	// 				></scib-molecules-upload-files>
	// 			)
	// 		});
	// 		const component: MoleculesUploadFiles = page.rootInstance;
	// 		const event = new CustomEvent('drop', { dataTransfer: { files: [mockFile] } } as any);
	// 		const eventAction = new CustomEvent('userAction', {
	// 			detail: { actionType: 'not', data: { indexInFileList: 0 } }
	// 		});
	// 		const emiteventFormChange = jest.spyOn(component.eventFormChange, 'emit');
	// 		component._hostRef.dispatchEvent(event);
	// 		await page.waitForChanges();
	// 		const previw = page.root.shadowRoot.querySelector('scib-molecules-document-preview');
	// 		component.name = 'newName';
	// 		previw.dispatchEvent(eventAction);
	// 		expect(emiteventFormChange).not.toHaveBeenCalledWith({
	// 			name: 'newName',
	// 			required: undefined,
	// 			value: [{ extension: '.txt', name: 'hola.txt' }]
	// 		});
	// 	});
	// });
	// describe('literals (watch)', () => {
	// 	it('should set literals', async () => {
	// 		const page = await newSpecPage({
	// 			components: [MoleculesUploadFiles],
	// 			template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>,
	// 			supportsShadowDom: true
	// 		});
	// 		const component: MoleculesUploadFiles = page.rootInstance;
	// 		component.literals = '{"fileListTitle": "prueba"}';
	// 		expect(component.$literals).toEqual({ fileListTitle: 'prueba' });
	// 	});
	// });
	// describe('fixedDate', () => {
	// 	it('should add 0 when only has one digit', async () => {
	// 		const component = new MoleculesUploadFiles();
	// 		const result = component.fixedDate(3);
	// 		expect(result).toEqual('03');
	// 	});
	// 	it('should ', async () => {
	// 		const component = new MoleculesUploadFiles();
	// 		const result = component.fixedDate(25);
	// 		expect(result).toEqual('25');
	// 	});
	// });
	it('should update autoDownloadFiles property and modify $filesArray when autoDownloadFiles is changed', async () => {
		const page = await newSpecPage({
			components: [MoleculesUploadFiles],
			template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
		});
		const component: MoleculesUploadFiles = page.rootInstance;
		component.autoDownloadFiles = true;
		await page.waitForChanges();
		expect(component.autoDownloadFiles).toBe(true);
		expect(component.$filesArray).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					downloable: true,
					url: expect.any(String)
				})
			])
		);
	});

	it('should update autoDownloadFiles property and modify $filesArray when autoDownloadFiles is changed to false', async () => {
		const page = await newSpecPage({
			components: [MoleculesUploadFiles],
			template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
		});
		const component: MoleculesUploadFiles = page.rootInstance;
		component.autoDownloadFiles = false;
		await page.waitForChanges();
		expect(component.autoDownloadFiles).toBe(false);
		expect(component.$filesArray).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					downloable: false,
					url: undefined
				})
			])
		);
	});

	it('should update disableRemoveFile property and modify $filesArray when disableRemoveFile is changed', async () => {
		const page = await newSpecPage({
			components: [MoleculesUploadFiles],
			template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
		});
		const component: MoleculesUploadFiles = page.rootInstance;
		component.disableRemoveFile = true;
		await page.waitForChanges();
		expect(component.disableRemoveFile).toBe(true);
		expect(component.$filesArray).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					downloable: true,
					url: expect.any(String)
				})
			])
		);
	});

	it('should update disableRemoveFile property and modify $filesArray when disableRemoveFile is changed to false', async () => {
		const page = await newSpecPage({
			components: [MoleculesUploadFiles],
			template: () => <scib-molecules-upload-files literals={literalMock}></scib-molecules-upload-files>
		});
		const component: MoleculesUploadFiles = page.rootInstance;
		component.disableRemoveFile = false;
		await page.waitForChanges();
		expect(component.disableRemoveFile).toBe(false);
		expect(component.$filesArray).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					downloable: false,
					url: undefined
				})
			])
		);
	});
});
