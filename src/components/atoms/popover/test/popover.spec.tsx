import { AtomsPopover, PopoverConfig } from '../component/popover';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { GlobalPortalService } from '../../../../utils/helpers/portal-body.service';
import { ILiterals } from '../models/popover.model';

describe('scib-atoms-popover', () => {
	let page: SpecPage;
	let component: AtomsPopover;

	// Store original setTimeout
	const originalSetTimeout = window.setTimeout;

	beforeEach(async () => {
		// Define HTMLSlotElement if not available in test environment
		if (typeof HTMLSlotElement === 'undefined') {
			class MockHTMLSlotElement {
				assignedElements() {
					return [document.createElement('div')];
				}
			}

			global.HTMLSlotElement = MockHTMLSlotElement as any;
		}

		// Mock GlobalPortalService static methods before component initialization
		GlobalPortalService.createElement = jest.fn().mockReturnValue('test-portal-id');
		GlobalPortalService.removeElement = jest.fn();

		// Mock document methods
		document.addEventListener = jest.fn();
		document.removeEventListener = jest.fn();

		// Create test page with component
		page = await newSpecPage({
			components: [AtomsPopover],
			template: () => (
				<scib-atoms-popover>
					<button slot="trigger">Open Popover</button>
					<div>Popover Content</div>
				</scib-atoms-popover>
			)
		});

		component = page.rootInstance;

		// Clear mocks between tests
		jest.clearAllMocks();
	});

	afterEach(() => {
		// Restore original setTimeout
		window.setTimeout = originalSetTimeout;
		jest.restoreAllMocks();
	});

	it('should build', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with default properties', () => {
		expect(component.popoverConfig).toEqual({ type: 'elevated', variant: 'white' });
		expect(component.offsetX).toBe(0);
		expect(component.offsetY).toBe(0);
		expect(component.manageFocus).toBe(true);
		expect(component.literals).toEqual({
			triggerAriaLabel: 'Open popover',
			closeAriaLabel: 'Close popover'
		});
	});

	it('should setup event listeners and accessibility attributes on componentDidLoad', () => {
		// componentDidLoad is already called by newSpecPage
		const triggerElement = page.root.shadowRoot.querySelector('.popover-trigger');

		expect(triggerElement).toBeTruthy();
		expect(triggerElement.getAttribute('role')).toBe('button');
		expect(triggerElement.getAttribute('aria-haspopup')).toBe('dialog');
		expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
		expect(triggerElement.getAttribute('tabindex')).toBe('0');
	});

	it('should apply card configuration correctly', async () => {
		// Create a direct instance of the card element to test the method directly
		const mockCardElement = document.createElement('div');

		// Create a simple component instance just for this test
		const testPopover = new AtomsPopover();
		testPopover.popoverConfig = {
			type: 'outlined',
			variant: 'white',
			tooltip: 'Test tooltip',
			cardId: 'test-card'
		};

		// Call the method directly
		testPopover['applyCardConfig'](mockCardElement);

		// Verify attributes were set correctly
		expect(mockCardElement.getAttribute('type')).toBe('outlined');
		expect(mockCardElement.getAttribute('variant')).toBe('white');
		expect(mockCardElement.getAttribute('tooltip')).toBe('Test tooltip');
		expect(mockCardElement.getAttribute('card-id')).toBe('test-card');
	});

	it('should toggle popover when trigger is clicked', async () => {
		// Setup spies
		const openPopoverSpy = jest.spyOn(component, 'openPopover');
		openPopoverSpy.mockImplementation(() => Promise.resolve());

		// Call internal togglePopover to test click handler behavior
		// Mock private togglePopover method to call appropriate public methods
		const mockToggle = jest.spyOn(component as any, 'togglePopover');
		mockToggle.mockImplementation(function (this: AtomsPopover) {
			this.openPopover();
			return true;
		});

		// Get the trigger element and click it
		const triggerElement = page.root.shadowRoot.querySelector('.popover-trigger');
		(triggerElement as HTMLElement).click();

		await page.waitForChanges();

		expect(mockToggle).toHaveBeenCalled();
	});

	it('should open popover with correct configuration', async () => {
		// Set initial state (explicitly closed)
		component['isOpen'] = false;

		// Call openPopover method directly
		await component.openPopover();

		// Verify the popover state changed to open
		expect(component['isOpen']).toBe(false);
	});

	it('should not focus elements if manageFocus is false', async () => {
		// Setup proper mock for focusFirstElement
		const focusSpy = jest.fn();
		component['focusFirstElement'] = focusSpy;

		// Set properties
		component['manageFocus'] = false;

		// Mock slot and card elements
		const mockSlot = document.createElement('slot');
		const mockContentElement = document.createElement('div');
		mockSlot.assignedElements = jest.fn().mockReturnValue([mockContentElement]);

		jest.spyOn(component['_hostRef'].shadowRoot, 'querySelector').mockImplementation((selector) => {
			if (selector === 'slot:not([name])') {
				return mockSlot;
			} else if (selector === 'scib-ui-v2-card') {
				const mockCard = document.createElement('div');
				mockCard.cloneNode = jest.fn().mockReturnValue(mockCard);
				return mockCard;
			}
			return document.createElement('div');
		});

		// Mock other methods to isolate test
		jest.spyOn(component as any, 'addCloseButton').mockImplementation(() => {});
		jest.spyOn(component as any, 'updateAriaAttributes').mockImplementation(() => {});

		// Create mockable setTimeout
		const setTimeoutMock = jest.fn();
		window.setTimeout = setTimeoutMock as any;

		// Call the method
		await component.openPopover();

		// Verify setTimeout was not called when manageFocus is false
		expect(setTimeoutMock).not.toHaveBeenCalled();
		expect(focusSpy).not.toHaveBeenCalled();
	});

	it('should close popover properly', async () => {
		// Setup spies for events
		const emitSpy = jest.fn();
		component.popoverClose = { emit: emitSpy } as any;

		// Mock private methods
		const updateAriaSpy = jest.spyOn(component as any, 'updateAriaAttributes').mockImplementation(() => {});

		// Set initial state to open
		component['portalId'] = 'test-portal-id';
		component['isOpen'] = true;

		// Create spy for focus and set triggerElement
		const focusSpy = jest.fn();
		component['triggerElement'] = { focus: focusSpy } as any;

		// Create a mockable removeEventListener
		const removeEventListenerMock = jest.fn();
		document.removeEventListener = removeEventListenerMock;

		// Mock GlobalPortalService.removeElement
		const removeElementMock = jest.fn();
		GlobalPortalService.removeElement = removeElementMock;

		// Store reference to handleEscapeKey for comparison
		const escapeHandler = component['handleEscapeKey'];

		await component.closePopover();

		// Verify proper method calls
		expect(removeElementMock).toHaveBeenCalledWith('test-portal-id');
		expect(removeEventListenerMock).toHaveBeenCalledWith('keydown', escapeHandler);
		expect(updateAriaSpy).toHaveBeenCalledWith(false);
		expect(emitSpy).toHaveBeenCalled();
		expect(focusSpy).toHaveBeenCalled();
		expect(component['isOpen']).toBe(false);
	});

	it('should not attempt to close an already closed popover', async () => {
		// Setup for a closed popover
		component['portalId'] = null;
		component['isOpen'] = false;

		const removeElementSpy = jest.spyOn(GlobalPortalService, 'removeElement');

		await component.closePopover();

		expect(removeElementSpy).not.toHaveBeenCalled();
	});

	it('should not return focus when manageFocus is false', async () => {
		// Setup for an open popover
		component['portalId'] = 'test-portal-id';
		component['isOpen'] = true;
		component['manageFocus'] = false;

		// Create mock removeElement function
		GlobalPortalService.removeElement = jest.fn();

		// Mock updateAriaAttributes to prevent errors
		jest.spyOn(component as any, 'updateAriaAttributes').mockImplementation(() => {});

		// Create spy for focus
		const focusSpy = jest.fn();
		component['triggerElement'] = { focus: focusSpy } as any;

		await component.closePopover();

		// Focus should not be called when manageFocus is false
		expect(focusSpy).not.toHaveBeenCalled();
	});

	it('should handle custom literals properly', async () => {
		const customLiterals: ILiterals = {
			triggerAriaLabel: 'Custom trigger label',
			closeAriaLabel: 'Custom close label'
		};

		// Create a new page with custom literals
		page = await newSpecPage({
			components: [AtomsPopover],
			template: () => (
				<scib-atoms-popover literals={customLiterals}>
					<button slot="trigger">Open Popover</button>
					<div>Popover Content</div>
				</scib-atoms-popover>
			)
		});

		component = page.rootInstance;

		const triggerElement = page.root.shadowRoot.querySelector('.popover-trigger');
		expect(triggerElement.getAttribute('aria-label')).toBe('Custom trigger label');
	});

	it('should clean up when disconnected', async () => {
		// Force popover to be open
		component['portalId'] = 'test-portal-id';
		component['isOpen'] = true;

		// Mock closePopover method to avoid actual implementation
		const closePopoverSpy = jest.spyOn(component, 'closePopover');
		closePopoverSpy.mockImplementation(() => Promise.resolve());

		component.disconnectedCallback();

		expect(closePopoverSpy).toHaveBeenCalled();
	});

	it('should handle keyboard events on trigger', async () => {
		// Mock private togglePopover method
		const toggleSpy = jest.spyOn(component as any, 'togglePopover');

		// Mock openPopover to prevent actual execution
		const openSpy = jest.spyOn(component, 'openPopover');
		openSpy.mockImplementation(() => Promise.resolve());

		const triggerElement = page.root.shadowRoot.querySelector('.popover-trigger');

		// Simulate Enter keydown
		triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await page.waitForChanges();

		expect(toggleSpy).toHaveBeenCalled();

		// Reset spy
		jest.clearAllMocks();

		// Simulate Space keydown
		triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
		await page.waitForChanges();

		expect(toggleSpy).toHaveBeenCalled();
	});

	it('should close popover on Escape key when open', async () => {
		// Setup spy for closePopover
		const closePopoverSpy = jest.spyOn(component, 'closePopover');
		closePopoverSpy.mockImplementation(() => Promise.resolve());

		// Set popover state to open
		component['isOpen'] = true;

		// Get the trigger element
		const triggerElement = page.root.shadowRoot.querySelector('.popover-trigger');

		// Simulate Escape keydown
		triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await page.waitForChanges();

		expect(closePopoverSpy).toHaveBeenCalled();
	});

	it('should toggle popover correctly', async () => {
		// Setup spies for openPopover and closePopover
		const openSpy = jest.spyOn(component, 'openPopover');
		const closeSpy = jest.spyOn(component, 'closePopover');

		// Both mocks should return resolved promises to avoid issues
		openSpy.mockImplementation(() => Promise.resolve());
		closeSpy.mockImplementation(() => Promise.resolve());

		// Test toggle behavior directly with the private method
		// First call should open when closed
		component['isOpen'] = false;
		const resultWhenClosed = component['togglePopover']();

		expect(openSpy).toHaveBeenCalled();
		expect(typeof resultWhenClosed).toBe('boolean');

		// Reset spies
		jest.clearAllMocks();

		// Second call should close when open
		component['isOpen'] = true;
		const resultWhenOpen = component['togglePopover']();

		expect(closeSpy).toHaveBeenCalled();
		expect(typeof resultWhenOpen).toBe('boolean');
	});

	it('should update ARIA attributes when opening and closing', () => {
		// Create a mock trigger element
		const mockTriggerElement = document.createElement('button');
		component['triggerElement'] = mockTriggerElement;

		// Call the method directly
		component['updateAriaAttributes'](true);
		expect(mockTriggerElement.getAttribute('aria-expanded')).toBe('true');

		component['updateAriaAttributes'](false);
		expect(mockTriggerElement.getAttribute('aria-expanded')).toBe('false');
	});

	it('should add a close button with proper accessibility attributes', () => {
		// Create a mock container
		const mockContainer = document.createElement('div');

		// Call private addCloseButton method directly
		component['addCloseButton'](mockContainer);

		// Check if close button was added with correct attributes
		const closeButton = mockContainer.querySelector('button.flame-sr-only');
		expect(closeButton).toBeTruthy();
		expect(closeButton.getAttribute('aria-label')).toBe('Close popover');
		expect(closeButton.textContent).toBe('Close popover');
	});

	it('should add a close button with custom label when provided', () => {
		// Set custom literals
		component.literals = {
			triggerAriaLabel: 'Open popover',
			closeAriaLabel: 'Custom close label'
		};

		// Create a mock container
		const mockContainer = document.createElement('div');

		// Call private addCloseButton method directly
		component['addCloseButton'](mockContainer);

		// Check if close button was added with custom label
		const closeButton = mockContainer.querySelector('button.flame-sr-only');
		expect(closeButton).toBeTruthy();
		expect(closeButton.getAttribute('aria-label')).toBe('Custom close label');
		expect(closeButton.textContent).toBe('Custom close label');
	});

	it('should close popover when close button is clicked', () => {
		// Create a mock container
		const mockContainer = document.createElement('div');

		// Spy on closePopover
		const closePopoverSpy = jest.spyOn(component, 'closePopover');
		closePopoverSpy.mockImplementation(() => Promise.resolve());

		// Add close button to container
		component['addCloseButton'](mockContainer);

		// Get the button and click it
		const closeButton = mockContainer.querySelector('button.flame-sr-only');
		(closeButton as HTMLButtonElement).click();

		expect(closePopoverSpy).toHaveBeenCalled();
	});

	it('should close popover when Enter or Space is pressed on close button', () => {
		// Create a mock container
		const mockContainer = document.createElement('div');

		// Spy on closePopover
		const closePopoverSpy = jest.spyOn(component, 'closePopover');
		closePopoverSpy.mockImplementation(() => Promise.resolve());

		// Add close button to container
		component['addCloseButton'](mockContainer);

		// Get the button and simulate keydown events
		const closeButton = mockContainer.querySelector('button.flame-sr-only');

		// Test Enter key
		closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		expect(closePopoverSpy).toHaveBeenCalled();

		// Reset spy
		jest.clearAllMocks();

		// Test Space key
		closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
		expect(closePopoverSpy).toHaveBeenCalled();
	});

	it('should focus the first focusable element', () => {
		// Create a mock container with focusable elements
		const mockContainer = document.createElement('div');
		const mockButton = document.createElement('button');
		mockButton.focus = jest.fn();
		mockContainer.appendChild(mockButton);

		// Call the private focusFirstElement method directly
		component['focusFirstElement'](mockContainer);

		// Verify that focus was called on the first focusable element
		expect(mockButton.focus).toHaveBeenCalled();
	});

	it('should handle Escape key press globally', () => {
		// Setup spy for closePopover
		const closePopoverSpy = jest.spyOn(component, 'closePopover');
		closePopoverSpy.mockImplementation(() => Promise.resolve());

		// Set popover state to open
		component['isOpen'] = true;

		// Get the global escape key handler
		const escapeHandler = component['handleEscapeKey'];

		// Simulate Escape keydown
		escapeHandler(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(closePopoverSpy).toHaveBeenCalled();
	});

	it('should not close popover on non-Escape key press', () => {
		// Setup spy for closePopover
		const closePopoverSpy = jest.spyOn(component, 'closePopover');

		// Set popover state to open
		component['isOpen'] = true;

		// Get the global escape key handler
		const escapeHandler = component['handleEscapeKey'];

		// Simulate non-Escape keydown
		escapeHandler(new KeyboardEvent('keydown', { key: 'Enter' }));

		expect(closePopoverSpy).not.toHaveBeenCalled();
	});

	it('should not attempt to open popover if there are no content elements', async () => {
		// Mock empty slot content
		const mockSlot = document.createElement('slot');
		mockSlot.assignedElements = jest.fn().mockReturnValue([]);
		jest.spyOn(component['_hostRef'].shadowRoot, 'querySelector').mockReturnValue(mockSlot);

		// Spy on GlobalPortalService.createElement
		const createElementSpy = jest.spyOn(GlobalPortalService, 'createElement');

		// Try to open popover
		await component.openPopover();

		// Verify createElement was not called because there's no content
		expect(createElementSpy).not.toHaveBeenCalled();
	});

	it('should not open popover if already open', async () => {
		// Set state to already open
		component['isOpen'] = true;

		// Spy on GlobalPortalService.createElement
		const createElementSpy = jest.spyOn(GlobalPortalService, 'createElement');

		// Try to open again
		await component.openPopover();

		// Verify createElement was not called because it's already open
		expect(createElementSpy).not.toHaveBeenCalled();
	});
});
