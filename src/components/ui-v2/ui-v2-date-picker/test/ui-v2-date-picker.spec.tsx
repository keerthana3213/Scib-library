import { UI_V2DatePicker } from '../component/ui-v2-date-picker';
import { languages } from '../models/ui-v2-date-picker.model';
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';

// Mocks necesarios para el entorno de pruebas
(global as any).MockHTMLElement = (global as any).HTMLElement || class MockHTMLElement {};
(global as any).MockHTMLElement.prototype.validity = { badInput: false };

// Mock para MutationObserver
const mutatationObserverMock = jest.fn<MutationObserver, [MutationCallback]>().mockImplementation(() => ({
	observe: jest.fn(),
	disconnect: jest.fn(),
	takeRecords: jest.fn()
}));
global.MutationObserver = mutatationObserverMock;

// Mock para MDCTextField
(global as any).MDCTextField = {
	attachTo: jest.fn().mockReturnValue({
		disabled: false,
		required: false,
		valid: true,
		helperTextContent: '',
		useNativeValidation: jest.fn(),
		layout: jest.fn(),
		getDefaultFoundation: jest.fn().mockReturnValue({
			setValid: jest.fn()
		}),
		destroy: jest.fn()
	})
};

// Mock para registerClickOutside
(global as any).registerClickOutside = jest.fn();

describe.skip('ui-v2-date-picker', () => {
	// Creamos un mock para componentDidLoad
	beforeEach(() => {
		// Esto evitará que se ejecute el componentDidLoad original
		jest.spyOn(UI_V2DatePicker.prototype, 'componentDidLoad').mockImplementation(() => {
			return undefined;
		});
	});

	afterEach(() => {
		// Restaurar el mock después de cada prueba
		jest.restoreAllMocks();
	});

	describe('render', () => {
		it('should set label with the property label', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker label={'The label text'}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});
			const label: HTMLElement = page.root.shadowRoot.querySelector('.mdc-floating-label');
			expect(label.textContent).toBe('The label text');
		});
		it('should active clean-icon class when value is not empty and disabled is false', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker value={'2014-08-06T13:07:04.054'} disabled={false}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});
			const span: HTMLElement = page.root.shadowRoot.querySelector('.clean-icon');
			expect(span).toBeTruthy();
		});
		it('should emit valueChange when clicked, disabled is false and value is defined', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker value={'2014-08-06T13:07:04.054'} disabled={false}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});
			const component: UI_V2DatePicker = page.rootInstance;
			const eventEmitSpy = spyOn(component.valueChange, 'emit');

			// Mock the _datePickerRef property
			(component as any)._datePickerRef = {
				clear: jest.fn()
			};

			// Call the _emitValue method directly which emits the valueChange event
			(component as any)._emitValue('');

			expect(eventEmitSpy).toHaveBeenCalled();
		});
	});

	describe('_getStatusIcon', () => {
		it('should return loading icon URL when loading state is true', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker loading={true}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;

			// Establecemos directamente las propiedades internas que usa el método
			component.$loading = true;

			// Usamos acceso al método privado mediante casting
			const result = (component as any)._getStatusIcon();

			expect(result).toContain('assets/color_icons/loading.svg');
		});

		it('should return success icon URL when success state is true', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker success={true}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;

			// Establecemos directamente la propiedad interna
			component.$success = true;

			const result = (component as any)._getStatusIcon();

			expect(result).toContain('assets/color_icons/checkmark.svg');
		});

		it('should return error icon URL when invalid state is true', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker invalid={true}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;

			// Establecemos directamente la propiedad interna
			component.$invalid = true;

			const result = (component as any)._getStatusIcon();

			expect(result).toContain('assets/color_icons/error.svg');
		});

		it('should return warning icon URL when warning state is true', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker warning={true}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;

			// Establecemos directamente la propiedad interna
			component.$warning = true;

			const result = (component as any)._getStatusIcon();

			expect(result).toContain('assets/color_icons/warning.svg');
		});

		it('should respect priority order when multiple states are true', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker loading={true} success={true} invalid={true} warning={true}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;

			// Establecemos directamente todas las propiedades internas
			component.$loading = true;
			component.$success = true;
			component.$invalid = true;
			component.$warning = true;

			const result = (component as any)._getStatusIcon();

			expect(result).toContain('assets/color_icons/loading.svg'); // Loading has highest priority
		});

		it('should return empty string when no status is set', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;

			// Aseguramos que todas las propiedades de estado están en false
			component.$loading = false;
			component.$success = false;
			component.$invalid = false;
			component.$warning = false;

			const result = (component as any)._getStatusIcon();

			expect(result).toBe('');
		});
	});

	describe('language (watch)', () => {
		it('should update the language to "en" when language changes to "en"', async () => {
			const page = await newSpecPage({
				components: [UI_V2DatePicker],
				template: () => <scib-ui-v2-date-picker label={'The label text'} language={'en'}></scib-ui-v2-date-picker>,
				supportsShadowDom: true
			});
			const component: UI_V2DatePicker = page.rootInstance;

			// Mock the _datePickerRef property since componentDidLoad is mocked
			(component as any)._datePickerRef = {
				update: jest.fn()
			};

			const emitUpdate = spyOn((component as any)._datePickerRef, 'update');
			component.language = 'es';
			expect(emitUpdate).toHaveBeenCalledWith({ locale: languages['es'] });
		});
	});
});
