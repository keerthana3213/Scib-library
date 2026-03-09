import { AtomsBackgroundVeil } from '../component/background-veil';
import { h } from '@stencil/core';
import { mock, instance, when, verify, anything, deepEqual, spy } from 'ts-mockito';
import { newSpecPage } from '@stencil/core/testing';

describe('AtomsBackgroundVeil', () => {
	let backgroundVeil: AtomsBackgroundVeil;
	let mockedBackgroundVeil: AtomsBackgroundVeil;

	beforeEach(() => {
		// Create a fresh mocked instance for each test
		mockedBackgroundVeil = mock(AtomsBackgroundVeil);
		backgroundVeil = instance(mockedBackgroundVeil);
	});

	it('should initialize with default properties', () => {
		// Create a real instance to test default values
		const realBackgroundVeil = new AtomsBackgroundVeil();

		// Assert default value
		expect(realBackgroundVeil.imgBackground).toBe('');
	});

	it('should set imgBackground property', () => {
		// Create a real instance
		const realBackgroundVeil = new AtomsBackgroundVeil();

		// Set property
		const testUrl = 'test-image.jpg';
		realBackgroundVeil.imgBackground = testUrl;

		// Assert value was set
		expect(realBackgroundVeil.imgBackground).toBe(testUrl);
	});

	describe('render tests', () => {
		it('should render with default values', async () => {
			// Arrange & Act
			const page = await newSpecPage({
				components: [AtomsBackgroundVeil],
				html: `<scib-atoms-background-veil></scib-atoms-background-veil>`
			});

			// Assert
			expect(page.root).toBeTruthy();
			const container = page.root.shadowRoot.querySelector('.store__container') as HTMLElement;
			expect(container).toBeTruthy();
			expect(container.style.background).toBe('url()');
		});

		it('should render with provided background image', async () => {
			// Arrange & Act
			const testUrl = 'test-image.jpg';
			const page = await newSpecPage({
				components: [AtomsBackgroundVeil],
				html: `<scib-atoms-background-veil img-background="${testUrl}"></scib-atoms-background-veil>`
			});

			// Assert
			expect(page.root).toBeTruthy();
			const container = page.root.shadowRoot.querySelector('.store__container') as HTMLElement;
			expect(container).toBeTruthy();
			expect(container.style.background).toBe(`url(${testUrl})`);
		});

		it('should render slot content', async () => {
			// Arrange & Act
			const page = await newSpecPage({
				components: [AtomsBackgroundVeil],
				html: `
          <scib-atoms-background-veil>
            <div class="test-content">Hello World</div>
          </scib-atoms-background-veil>
        `
			});

			// Assert
			expect(page.root).toBeTruthy();
			// Check slot content is projected
			const slotted = page.root.querySelector('.test-content');
			expect(slotted).toBeTruthy();
			expect(slotted.textContent).toBe('Hello World');
		});

		it('should properly structure DOM elements', async () => {
			// Arrange & Act
			const page = await newSpecPage({
				components: [AtomsBackgroundVeil],
				html: `<scib-atoms-background-veil></scib-atoms-background-veil>`
			});

			// Assert
			expect(page.root).toBeTruthy();

			// Check all expected elements are present
			const store = page.root.shadowRoot.querySelector('.store');
			expect(store).toBeTruthy();

			const container = store.querySelector('.store__container');
			expect(container).toBeTruthy();

			const overlay = container.querySelector('.store__img-overlay');
			expect(overlay).toBeTruthy();
		});
	});

	describe('mocked render tests', () => {
		it('should call render method', () => {
			// Arrange
			when(mockedBackgroundVeil.render()).thenReturn(null);

			// Act
			const result = backgroundVeil.render();

			// Assert
			verify(mockedBackgroundVeil.render()).once();
			expect(result).toBeNull();
		});
	});
});
