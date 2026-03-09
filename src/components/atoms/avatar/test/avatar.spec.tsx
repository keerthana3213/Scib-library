import { AtomsAvatar } from '../component/avatar';
import { h } from '@stencil/core';
import { mock, instance, when, verify, anything, deepEqual, spy } from 'ts-mockito';
import { newSpecPage } from '@stencil/core/testing';

describe('AtomsAvatar', () => {
	let avatar: AtomsAvatar;
	let mockedAvatar: AtomsAvatar;

	beforeEach(() => {
		// Create a fresh instance for each test
		mockedAvatar = mock(AtomsAvatar);
		avatar = instance(mockedAvatar);
	});

	it('should initialize correctly with default properties', () => {
		// Create a real instance to test defaults
		const realAvatar = new AtomsAvatar();

		// Assert default values
		expect(realAvatar.variant).toBe('white');
		expect(realAvatar.badge).toBe('');
		expect(realAvatar.alt).toBe('');
	});

	it('should process text in componentWillLoad', () => {
		// Arrange
		const realAvatar = new AtomsAvatar();
		const textSpy = spy(realAvatar);
		realAvatar.text = 'AB';
		realAvatar.img = 'image.jpg';

		// Act
		realAvatar.componentWillLoad();

		// Assert
		expect(realAvatar['$text']).toBe('AB');
		expect(realAvatar['$img']).toBe('image.jpg');
	});

	it('should handle text changes through _textHandler', () => {
		// Arrange
		const realAvatar = new AtomsAvatar();

		// Act & Assert - Normal text
		realAvatar['_textHandler']('John Doe');
		expect(realAvatar['$text']).toBe('JO');

		// Act & Assert - Empty text
		realAvatar['_textHandler']('');
		expect(realAvatar['$text']).toBe('');

		// Act & Assert - Null text
		realAvatar['_textHandler'](null);
		expect(realAvatar['$text']).toBe('');
	});

	it('should handle image changes through _imgHandler', () => {
		// Arrange
		const realAvatar = new AtomsAvatar();
		const imagePath = 'path/to/image.jpg';

		// Act
		realAvatar['_imgHandler'](imagePath);

		// Assert
		expect(realAvatar['$img']).toBe(imagePath);
	});

	describe('render tests using SpecPage', () => {
		it('should render with text when $text is provided', async () => {
			// Arrange
			const page = await newSpecPage({
				components: [AtomsAvatar],
				html: `<scib-atoms-avatar text="AB"></scib-atoms-avatar>`
			});

			// Assert
			expect(page.root).toBeTruthy();
			const span = page.root.shadowRoot.querySelector('.avatar__letters');
			expect(span).toBeTruthy();
			expect(span.textContent).toBe('AB');
		});

		it('should render with image when text is not provided', async () => {
			// Arrange
			const page = await newSpecPage({
				components: [AtomsAvatar],
				html: `<scib-atoms-avatar img="test-img.jpg" alt="Test alt text"></scib-atoms-avatar>`
			});

			// Assert
			expect(page.root).toBeTruthy();
			const img = page.root.shadowRoot.querySelector('.avatar__img');
			expect(img).toBeTruthy();
			expect(img.getAttribute('src')).toBe('test-img.jpg');
			expect(img.getAttribute('alt')).toBe('Test alt text');
		});

		it('should render with badge when badge prop is provided', async () => {
			// Arrange
			const page = await newSpecPage({
				components: [AtomsAvatar],
				html: `<scib-atoms-avatar text="AB" badge="3" variant="red"></scib-atoms-avatar>`
			});

			// Assert
			expect(page.root).toBeTruthy();
			const badge = page.root.shadowRoot.querySelector('scib-atoms-badge');
			expect(badge).toBeTruthy();
			expect(badge.getAttribute('text')).toBe('3');
			expect(badge.getAttribute('variant')).toBe('red');
		});

		it('should render without badge when badge prop is empty', async () => {
			// Arrange
			const page = await newSpecPage({
				components: [AtomsAvatar],
				html: `<scib-atoms-avatar text="AB"></scib-atoms-avatar>`
			});

			// Assert
			expect(page.root).toBeTruthy();
			const badge = page.root.shadowRoot.querySelector('scib-atoms-badge');
			expect(badge).toBeFalsy();
		});

		it('should use default empty alt when alt is not provided', async () => {
			// Arrange
			const page = await newSpecPage({
				components: [AtomsAvatar],
				html: `<scib-atoms-avatar img="test-img.jpg"></scib-atoms-avatar>`
			});

			// Assert
			expect(page.root).toBeTruthy();
			const img = page.root.shadowRoot.querySelector('.avatar__img');
			expect(img).toBeTruthy();
			expect(img.getAttribute('alt')).toBe('');
		});
	});

	describe('unit tests', () => {
		it('should handle null text in _textHandler', () => {
			const realAvatar = new AtomsAvatar();
			realAvatar['_textHandler'](null);
			expect(realAvatar['$text']).toBe('');
		});

		it('should handle undefined text in _textHandler', () => {
			const realAvatar = new AtomsAvatar();
			realAvatar['_textHandler'](undefined);
			expect(realAvatar['$text']).toBe('');
		});

		it('should handle null image in _imgHandler', () => {
			const realAvatar = new AtomsAvatar();
			realAvatar['_imgHandler'](null);
			expect(realAvatar['$img']).toBe(null);
		});

		it('should have correct type property', () => {
			const realAvatar = new AtomsAvatar();
			realAvatar.type = 'sm';
			expect(realAvatar.type).toBe('sm');

			realAvatar.type = 'md';
			expect(realAvatar.type).toBe('md');
		});
	});
});
