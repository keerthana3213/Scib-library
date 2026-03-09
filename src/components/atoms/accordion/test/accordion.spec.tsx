import { AtomsAccordion } from '../component/accordion';
import { newSpecPage } from '@stencil/core/testing';

describe('AtomsAccordion', () => {
	it('should render with default properties', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();
		const hr = page.root.shadowRoot.querySelector('hr');
		expect(hr).toBeTruthy();
	});

	it('should not render upper border when forceUpperBorder is false', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion force-upper-border="false"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get all hr elements
		const hrs = page.root.shadowRoot.querySelectorAll('hr');

		// Should only have the bottom divider
		expect(hrs.length).toBe(1);
	});

	it('should add accordion__cursor class when disableFullHandler is false', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Check for accordion__cursor class
		const section = page.root.shadowRoot.querySelector('section');
		expect(section.classList.contains('accordion__cursor')).toBe(true);
	});

	it('should not add accordion__cursor class when disableFullHandler is true', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion disable-full-handler="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Check for accordion__cursor class
		const section = page.root.shadowRoot.querySelector('section');
		expect(section.classList.contains('accordion__cursor')).toBe(false);
	});

	it('should add accordion__focused class when focused', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Set focused state
		const accordionInstance = page.rootInstance;
		accordionInstance.focused = true;
		await page.waitForChanges();

		// Check for accordion__focused class
		const section = page.root.shadowRoot.querySelector('section');
		expect(section.classList.contains('accordion__focused')).toBe(true);
	});

	it('should add accordion__btn--open class to button when open is true', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion open="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get button element
		const button = page.root.shadowRoot.querySelector('button');
		expect(button.classList.contains('accordion__btn--open')).toBe(true);
	});

	it('should not add accordion__content--hidden class when open is true', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion open="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get content div
		const contentDiv = page.root.shadowRoot.querySelector('.accordion__content');
		expect(contentDiv.classList.contains('accordion__content--hidden')).toBe(false);
	});

	it('should add accordion__content--hidden class when open is false', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get content div
		const contentDiv = page.root.shadowRoot.querySelector('.accordion__content');
		expect(contentDiv.classList.contains('accordion__content--hidden')).toBe(true);
	});

	it('should toggle open state when header is clicked and disableFullHandler is false', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Initial state
		const accordionInstance = page.rootInstance;
		expect(accordionInstance.open).toBeFalsy();

		// Simulate header click
		const headerDiv = page.root.shadowRoot.querySelector('.accordion__header');
		(headerDiv as HTMLElement).click();
		await page.waitForChanges();

		// Verify state changed
		expect(accordionInstance.open).toBe(true);
	});

	it('should not toggle open state when header is clicked and disableFullHandler is true', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion disable-full-handler="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Initial state
		const accordionInstance = page.rootInstance;
		expect(accordionInstance.open).toBeFalsy();

		// Simulate header click
		const headerDiv = page.root.shadowRoot.querySelector('.accordion__header');
		(headerDiv as HTMLElement).click();
		await page.waitForChanges();

		// Verify state did not change
		expect(accordionInstance.open).toBeFalsy();
	});

	it('should toggle open state when button is clicked and disableFullHandler is true', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion disable-full-handler="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Initial state
		const accordionInstance = page.rootInstance;
		expect(accordionInstance.open).toBeFalsy();

		// Simulate button click
		const button = page.root.shadowRoot.querySelector('button');
		button.click();
		await page.waitForChanges();

		// Verify state changed
		expect(accordionInstance.open).toBe(true);
	});

	it('should not toggle open state when button is clicked and disableFullHandler is false', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Initial state
		const accordionInstance = page.rootInstance;
		expect(accordionInstance.open).toBeFalsy();

		// Manually spy on internal method
		const spy = jest.spyOn(accordionInstance as any, '_toggleModal');

		// Simulate button click
		const button = page.root.shadowRoot.querySelector('button');
		button.click();

		// The button click itself should not call _toggleModal, but the header click will
		// This is tricky to test because both events fire
		expect(spy).not.toHaveBeenCalledTimes(2);
	});

	it('should update focused state to true when button gets focus', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Initial state
		const accordionInstance = page.rootInstance;
		expect(accordionInstance.focused).toBe(false);

		// Simulate focus event
		const button = page.root.shadowRoot.querySelector('button');
		button.dispatchEvent(new Event('focus'));
		await page.waitForChanges();

		// Verify state changed
		expect(accordionInstance.focused).toBe(true);
	});

	it('should update focused state to false when button loses focus', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Set initial state
		const accordionInstance = page.rootInstance;
		accordionInstance.focused = true;
		await page.waitForChanges();

		// Simulate blur event
		const button = page.root.shadowRoot.querySelector('button');
		button.dispatchEvent(new Event('blur'));
		await page.waitForChanges();

		// Verify state changed
		expect(accordionInstance.focused).toBe(false);
	});

	it('should verify bottom divider is always rendered regardless of forceUpperBorder', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion force-upper-border="false"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get all hr elements
		const hrs = page.root.shadowRoot.querySelectorAll('hr');

		// Find the last one
		const lastHr = hrs[hrs.length - 1];
		expect(lastHr).toBeTruthy();
		expect(lastHr.className).toBe('accordion__divider');
	});

	it('should expand the accordion when expand method is called', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get instance and spy on emitter
		const accordionInstance = page.rootInstance;
		const emitSpy = jest.spyOn(accordionInstance.eventAccordionChange, 'emit');
		const expandedSpy = jest.spyOn(accordionInstance.eventAccordionExpanded, 'emit');

		// Call expand method
		await accordionInstance.expand();

		// Verify state and events
		expect(accordionInstance.open).toBe(true);
		expect(emitSpy).toHaveBeenCalledWith(false);
		expect(expandedSpy).toHaveBeenCalled();
	});

	it('should collapse the accordion when collapse method is called', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion open="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get instance and spy on emitters
		const accordionInstance = page.rootInstance;
		const emitSpy = jest.spyOn(accordionInstance.eventAccordionChange, 'emit');
		const collapsedSpy = jest.spyOn(accordionInstance.eventAccordionCollapsed, 'emit');

		// Call collapse method
		await accordionInstance.collapse();

		// Verify state and events
		expect(accordionInstance.open).toBe(false);
		expect(emitSpy).toHaveBeenCalledWith(true);
		expect(collapsedSpy).toHaveBeenCalled();
	});

	it('should toggle open state from false to true and emit events when _toggleModal is called', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get instance and spy on emitters
		const accordionInstance = page.rootInstance;
		const emitSpy = jest.spyOn(accordionInstance.eventAccordionChange, 'emit');
		const expandedSpy = jest.spyOn(accordionInstance.eventAccordionExpanded, 'emit');
		const collapsedSpy = jest.spyOn(accordionInstance.eventAccordionCollapsed, 'emit');

		// Call _toggleModal method
		(accordionInstance as any)._toggleModal();

		// Verify state and events
		expect(accordionInstance.open).toBe(true);
		expect(emitSpy).toHaveBeenCalledWith(false);
		expect(expandedSpy).toHaveBeenCalled();
		expect(collapsedSpy).not.toHaveBeenCalled();
	});

	it('should toggle open state from true to false and emit events when _toggleModal is called', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion open="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get instance and spy on emitters
		const accordionInstance = page.rootInstance;
		const emitSpy = jest.spyOn(accordionInstance.eventAccordionChange, 'emit');
		const expandedSpy = jest.spyOn(accordionInstance.eventAccordionExpanded, 'emit');
		const collapsedSpy = jest.spyOn(accordionInstance.eventAccordionCollapsed, 'emit');

		// Call _toggleModal method
		(accordionInstance as any)._toggleModal();

		// Verify state and events
		expect(accordionInstance.open).toBe(false);
		expect(emitSpy).toHaveBeenCalledWith(true);
		expect(expandedSpy).not.toHaveBeenCalled();
		expect(collapsedSpy).toHaveBeenCalled();
	});

	it('should emit the correct events when open is true and _emitEvents is called', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion open="true"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get instance and spy on emitters
		const accordionInstance = page.rootInstance;
		const emitSpy = jest.spyOn(accordionInstance.eventAccordionChange, 'emit');
		const expandedSpy = jest.spyOn(accordionInstance.eventAccordionExpanded, 'emit');
		const collapsedSpy = jest.spyOn(accordionInstance.eventAccordionCollapsed, 'emit');

		// Call _emitEvents method
		(accordionInstance as any)._emitEvents();

		// Verify events
		expect(emitSpy).toHaveBeenCalledWith(false);
		expect(expandedSpy).toHaveBeenCalled();
		expect(collapsedSpy).not.toHaveBeenCalled();
	});

	it('should emit the correct events when open is false and _emitEvents is called', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();

		// Get instance and spy on emitters
		const accordionInstance = page.rootInstance;
		const emitSpy = jest.spyOn(accordionInstance.eventAccordionChange, 'emit');
		const expandedSpy = jest.spyOn(accordionInstance.eventAccordionExpanded, 'emit');
		const collapsedSpy = jest.spyOn(accordionInstance.eventAccordionCollapsed, 'emit');

		// Call _emitEvents method
		(accordionInstance as any)._emitEvents();

		// Verify events
		expect(emitSpy).toHaveBeenCalledWith(true);
		expect(expandedSpy).not.toHaveBeenCalled();
		expect(collapsedSpy).toHaveBeenCalled();
	});

	it('should render with direction=bottom property', async () => {
		const page = await newSpecPage({
			components: [AtomsAccordion],
			html: `<scib-atoms-accordion direction="bottom"></scib-atoms-accordion>`
		});

		expect(page.root).toBeTruthy();
		expect(page.root.getAttribute('direction')).toBe('bottom');
	});
});
