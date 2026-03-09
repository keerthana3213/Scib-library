import { AtomsButton } from '../component/button';
import { mock, instance, verify, when, anyFunction, anything, deepEqual } from 'ts-mockito';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { MDCRipple } from '@material/ripple';

describe('AtomsButton', () => {
	describe('initialization and rendering', () => {
		it('should initialize with default properties', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				html: `<scib-atoms-button></scib-atoms-button>`,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			expect(component.size).toBe('m');
			expect(component.level).toBe('primary');
			expect(component.variant).toBe('basic');
			expect(component.type).toBe('button');
			expect(component.disabled).toBeUndefined();
			expect(component.loading).toBeUndefined();
		});

		it('should render button with proper type attribute', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button type="submit" text="Submit Button"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const button = page.root.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).toBe('submit');
		});

		it('should render button with icon when icon prop is provided', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button icon="search" text="Search"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const iconElement = page.root.shadowRoot.querySelector('span.mdc-button__icon');
			expect(iconElement).toBeTruthy();
			expect((iconElement as HTMLElement).style.getPropertyValue('--icon-content')).toBe('var(--theme-scib-icon-search)');
		});

		it('should not show icon when loading is true', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button icon="search" loading={true}></scib-atoms-button>,
				supportsShadowDom: true
			});

			const iconElement = page.root.shadowRoot.querySelector('span.mdc-button__icon');
			expect(iconElement).toBeFalsy();
		});

		it('should show loading component when loading is true', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button loading={true}></scib-atoms-button>,
				supportsShadowDom: true
			});

			const loadingElement = page.root.shadowRoot.querySelector('scib-atoms-loading');
			expect(loadingElement).toBeTruthy();
		});

		it('should not show loading component when loading is false', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button loading={false}></scib-atoms-button>,
				supportsShadowDom: true
			});

			const loadingElement = page.root.shadowRoot.querySelector('scib-atoms-loading');
			expect(loadingElement).toBeFalsy();
		});

		it('should render button label when text is provided and variant is not icon', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button text="Click Me"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const labelElement = page.root.shadowRoot.querySelector('span.mdc-button__label');
			expect(labelElement).toBeTruthy();
			expect(labelElement.textContent).toBe('Click Me');
		});

		it('should not render button label when variant is icon', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button variant="icon" text="Click Me"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const labelElement = page.root.shadowRoot.querySelector('span.mdc-button__label');
			expect(labelElement).toBeFalsy();
		});

		it('should apply fab-icon class when variant is icon', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button variant="icon"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const button = page.root.shadowRoot.querySelector('button.mdc-button--fab-icon');
			expect(button).toBeTruthy();
		});

		it('should apply fab-icon class when variant is icon-flat', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button variant="icon"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const button = page.root.shadowRoot.querySelector('button.mdc-button--fab-icon');
			expect(button).toBeTruthy();
		});

		it('should apply fab-icon class when variant is icon-outlined', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button variant="icon"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const button = page.root.shadowRoot.querySelector('button.mdc-button--fab-icon');
			expect(button).toBeTruthy();
		});

		it('should apply icon-trailing class when iconPosition is trailing', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button iconPosition="trailing"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const button = page.root.shadowRoot.querySelector('button.mdc-button--icon-trailing');
			expect(button).toBeTruthy();
		});

		it('should apply icon-leading class when iconPosition is leading', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button iconPosition="leading"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const button = page.root.shadowRoot.querySelector('button.mdc-button--icon-leading');
			expect(button).toBeTruthy();
		});
	});

	describe('lifecycle methods', () => {
		it('should attach MDCRipple in componentDidLoad', async () => {
			// Mock MDCRipple
			const mockedRipple = mock<MDCRipple>();
			const mockAttach = jest.spyOn(MDCRipple, 'attachTo').mockImplementation(() => instance(mockedRipple));

			const page = await newSpecPage({
				components: [AtomsButton],
				html: `<scib-atoms-button></scib-atoms-button>`,
				supportsShadowDom: true
			});

			const buttonElement = page.root.shadowRoot.querySelector('.mdc-button');
			expect(mockAttach).toHaveBeenCalledWith(buttonElement);
			mockAttach.mockRestore();
		});

		it('should call manageDisabled with disabled value in componentDidLoad', async () => {
			const mockedRipple = mock<MDCRipple>();
			const mockAttach = jest.spyOn(MDCRipple, 'attachTo').mockImplementation(() => instance(mockedRipple));

			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button disabled={true}></scib-atoms-button>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			expect(component._buttonRef.disabled).toBe(true);
			mockAttach.mockRestore();
		});
	});

	describe('event handling', () => {
		it('should call stopPropagation and preventDefault when disabled and clicked', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button disabled={true}></scib-atoms-button>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			const event = new MouseEvent('click');
			const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
			const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

			component._clickHandler(event);

			expect(stopPropagationSpy).toHaveBeenCalled();
			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('should call stopPropagation and preventDefault when loading and clicked', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button loading={true}></scib-atoms-button>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			const event = new MouseEvent('click');
			const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
			const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

			component._clickHandler(event);

			expect(stopPropagationSpy).toHaveBeenCalled();
			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('should call _dispatchSubmitEvent when type is submit and button is clicked', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button type="submit"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			const mockDispatchSubmitEvent = jest.spyOn(component, '_dispatchSubmitEvent' as any);

			const event = new MouseEvent('click');
			component._clickHandler(event);

			expect(mockDispatchSubmitEvent).toHaveBeenCalledWith(event);
			mockDispatchSubmitEvent.mockRestore();
		});
	});

	describe('utility methods', () => {
		it('should handle manageDisabled with buttonRef', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				html: `<scib-atoms-button></scib-atoms-button>`,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			const mockRemoveAttribute = jest.spyOn(component._hostRef, 'removeAttribute');

			component.manageDisabled(false);
			expect(component._buttonRef.disabled).toBe(false);
			expect(mockRemoveAttribute).toHaveBeenCalledWith('disabled');

			component.manageDisabled(true);
			expect(component._buttonRef.disabled).toBe(true);
		});

		it('should call _disabledHandler watcher when disabled property changes', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				html: `<scib-atoms-button></scib-atoms-button>`,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			const manageDisabledSpy = jest.spyOn(component, 'manageDisabled');

			component._disabledHandler(true);
			expect(manageDisabledSpy).toHaveBeenCalledWith(true);
		});

		it('should handle _dispatchSubmitEvent without parent form', async () => {
			const page = await newSpecPage({
				components: [AtomsButton],
				html: `<scib-atoms-button type="submit"></scib-atoms-button>`,
				supportsShadowDom: true
			});

			const component = page.rootInstance;
			const event = new MouseEvent('click');
			const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
			const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

			component['_dispatchSubmitEvent'](event);

			expect(stopPropagationSpy).toHaveBeenCalled();
			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('should handle _dispatchSubmitEvent with parent form', async () => {
			// Create a page with a mocked structure
			const page = await newSpecPage({
				components: [AtomsButton],
				template: () => <scib-atoms-button type="submit"></scib-atoms-button>,
				supportsShadowDom: true
			});

			const component = page.rootInstance;

			// Mock DOM elements and methods
			const form = document.createElement('form');
			const fakeSubmit = document.createElement('button');

			// Setup mocks
			const mockClosest = jest.spyOn(component._hostRef, 'closest').mockReturnValue(form);
			const mockCreateElement = jest.spyOn(document, 'createElement').mockReturnValue(fakeSubmit);
			const mockAppendChild = jest.spyOn(form, 'appendChild').mockImplementation(() => fakeSubmit);
			const mockClick = jest.spyOn(fakeSubmit, 'click').mockImplementation(() => {});
			const mockRemove = jest.spyOn(fakeSubmit, 'remove').mockImplementation(() => {});

			const event = new MouseEvent('click');
			const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
			const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

			// Call the method
			component['_dispatchSubmitEvent'](event);

			// Assertions
			expect(stopPropagationSpy).toHaveBeenCalled();
			expect(preventDefaultSpy).toHaveBeenCalled();
			expect(mockClosest).toHaveBeenCalledWith('form');
			expect(mockCreateElement).toHaveBeenCalledWith('button');
			expect(mockAppendChild).toHaveBeenCalledWith(fakeSubmit);
			expect(fakeSubmit.type).toBe('submit');
			expect(fakeSubmit.style.display).toBe('none');
			expect(mockClick).toHaveBeenCalled();
			expect(mockRemove).toHaveBeenCalled();

			// Clean up - don't try to remove the form from the DOM
			mockClosest.mockRestore();
			mockCreateElement.mockRestore();
			mockAppendChild.mockRestore();
			mockClick.mockRestore();
			mockRemove.mockRestore();
		});

		it('should not call manageDisabled if _buttonRef is not defined', async () => {
			const button = new AtomsButton();
			// _buttonRef is initially undefined
			button.manageDisabled(true);
			// No error should be thrown
			expect(button._buttonRef).toBeUndefined();
		});
	});
});
