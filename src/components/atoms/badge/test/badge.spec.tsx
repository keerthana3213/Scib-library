import { newSpecPage } from '@stencil/core/testing';
import { AtomsBadge } from '../component/badge';

describe('atoms-badge', () => {
	it('should build the component', () => {
		expect(new AtomsBadge()).toBeTruthy();
	});

	it('should render with default props', async () => {
		// Arrange
		const page = await newSpecPage({
			components: [AtomsBadge],
			html: `<scib-atoms-badge></scib-atoms-badge>`
		});

		// Assert
		expect(page.root).toBeTruthy();
		const badgeContainer = page.root.shadowRoot.querySelector('span');
		expect(badgeContainer).toHaveClass('badge-container');
		expect(badgeContainer.textContent).toBe('');
	});

	it('should render with text', async () => {
		// Arrange
		const page = await newSpecPage({
			components: [AtomsBadge],
			html: `<scib-atoms-badge text="Test"></scib-atoms-badge>`
		});

		// Assert
		const badgeContainer = page.root.shadowRoot.querySelector('span');
		expect(badgeContainer.textContent).toBe('Test');
	});

	it('should hide the badge when hide property is true', async () => {
		// Arrange
		const page = await newSpecPage({
			components: [AtomsBadge],
			html: `<scib-atoms-badge hide></scib-atoms-badge>`
		});

		// Assert
		const badgeContainer = page.root.shadowRoot.querySelector('span');
		expect(badgeContainer).toHaveClass('badge-container--hide');
		expect(badgeContainer).not.toHaveClass('badge-container');
	});

	it('should have correct class names when not hidden', async () => {
		// Create the component using HTML
		const page = await newSpecPage({
			components: [AtomsBadge],
			html: `<scib-atoms-badge text="Mocked Text" type="sm" variant="blue"></scib-atoms-badge>`
		});

		// Assert
		const badgeContainer = page.root.shadowRoot.querySelector('span');
		expect(badgeContainer).toHaveClass('badge-container');
		expect(badgeContainer).not.toHaveClass('badge-container--hide');
		expect(badgeContainer.textContent).toBe('Mocked Text');
	});

	it('should have correct class names when hidden', async () => {
		// Create the component using HTML
		const page = await newSpecPage({
			components: [AtomsBadge],
			html: `<scib-atoms-badge text="Hidden Text" hide></scib-atoms-badge>`
		});

		// Assert
		const badgeContainer = page.root.shadowRoot.querySelector('span');
		expect(badgeContainer).not.toHaveClass('badge-container');
		expect(badgeContainer).toHaveClass('badge-container--hide');
		expect(badgeContainer.textContent).toBe('Hidden Text');
	});

	it('should render with different type and variant props', async () => {
		// Arrange
		const page = await newSpecPage({
			components: [AtomsBadge],
			html: `<scib-atoms-badge type="md" variant="blue" text="Custom"></scib-atoms-badge>`
		});

		// Assert
		expect(page.root).toBeTruthy();
		expect(page.root.getAttribute('type')).toBe('md');
		expect(page.root.getAttribute('variant')).toBe('blue');
		const badgeContainer = page.root.shadowRoot.querySelector('span');
		expect(badgeContainer.textContent).toBe('Custom');
	});

	it('should use default variant when not specified', async () => {
		// Arrange
		const page = await newSpecPage({
			components: [AtomsBadge],
			html: `<scib-atoms-badge></scib-atoms-badge>`
		});

		// Assert
		expect(page.root.getAttribute('variant')).toBe('red');
	});

	it('should test all valid variants', async () => {
		// Test each valid variant from VariantTypes
		const variants = ['white', 'blue', 'red', 'lightblue', 'none'];

		for (const variant of variants) {
			// Arrange
			const page = await newSpecPage({
				components: [AtomsBadge],
				html: `<scib-atoms-badge variant="${variant}" text="Variant Test"></scib-atoms-badge>`
			});

			// Assert
			expect(page.root.getAttribute('variant')).toBe(variant);
			const badgeContainer = page.root.shadowRoot.querySelector('span');
			expect(badgeContainer).toBeTruthy();
		}
	});

	it('should test all valid types', async () => {
		// Test each valid type
		const types = ['sm', 'md'];

		for (const type of types) {
			// Arrange
			const page = await newSpecPage({
				components: [AtomsBadge],
				html: `<scib-atoms-badge type="${type}" text="Type Test"></scib-atoms-badge>`
			});

			// Assert
			expect(page.root.getAttribute('type')).toBe(type);
			const badgeContainer = page.root.shadowRoot.querySelector('span');
			expect(badgeContainer).toBeTruthy();
		}
	});
});
