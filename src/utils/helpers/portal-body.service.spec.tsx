import { anything, instance, mock, verify, when } from 'ts-mockito';
import { GlobalPortalService } from './portal-body.service';

describe.skip('GlobalPortalService', () => {
	// Original DOM methods for restoration
	const originalCreateElement = document.createElement;
	const originalAppendChild = document.body.appendChild;
	const originalRemoveChild = document.body.removeChild;
	const originalAddEventListener = document.addEventListener;
	const originalRemoveEventListener = document.removeEventListener;
	const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

	// Mock DOM elements and objects
	let mockTriggerElement: HTMLElement;
	let mockContentElement: HTMLElement;
	let mockContainer: HTMLDivElement;
	let mockStyleElement: HTMLStyleElement;

	beforeEach(() => {
		// Mock DOM elements
		mockTriggerElement = mock<HTMLElement>();
		mockContentElement = mock<HTMLElement>();
		mockContainer = mock<HTMLDivElement>();
		mockStyleElement = mock<HTMLStyleElement>();

		// Propiedad id modificable para el mockContainer
		let containerId = '';
		Object.defineProperty(instance(mockContainer), 'id', {
			get: () => containerId,
			set: (value) => {
				containerId = value;
			},
			configurable: true
		});

		// Mock DOM methods
		document.createElement = jest.fn((tagName) => {
			if (tagName === 'div') return instance(mockContainer);
			if (tagName === 'style') return instance(mockStyleElement);
			return originalCreateElement.call(document, tagName);
		});

		document.body.appendChild = jest.fn().mockReturnValue(null);
		document.body.removeChild = jest.fn().mockReturnValue(null);
		document.addEventListener = jest.fn();
		document.removeEventListener = jest.fn();

		// Mock getBoundingClientRect
		Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function () {
			if (this === instance(mockTriggerElement)) {
				return {
					top: 100,
					bottom: 150,
					left: 100,
					right: 200,
					width: 100,
					height: 50
				};
			}
			if (this === instance(mockContainer)) {
				return {
					width: 200,
					height: 100
				};
			}
			return originalGetBoundingClientRect.call(this);
		});

		// Mock window properties
		Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
		Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
		Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
		Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
		Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true });
		Object.defineProperty(window, 'pageXOffset', { value: 0, configurable: true });

		// Use jest.useFakeTimers() to avoid hanging tests with setTimeout
		jest.useFakeTimers();

		// Setup mockContainer
		when(mockContainer.contains(anything())).thenReturn(false);
		when(mockContainer.appendChild(anything())).thenReturn(null);

		// Setup mockTriggerElement
		when(mockTriggerElement.contains(anything())).thenReturn(false);

		// Reset any internal state of the service
		// This is necessary because the service uses static properties
		(GlobalPortalService as any).activeElements = new Map();
	});

	afterEach(() => {
		// Restore original DOM methods
		document.createElement = originalCreateElement;
		document.body.appendChild = originalAppendChild;
		document.body.removeChild = originalRemoveChild;
		document.addEventListener = originalAddEventListener;
		document.removeEventListener = originalRemoveEventListener;
		Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;

		// Clean up fake timers
		jest.useRealTimers();

		jest.restoreAllMocks();
	});

	describe('createElement', () => {
		it('should create and position an element with string content', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id: 'test-element'
			};

			// Act
			const result = GlobalPortalService.createElement(config);

			// Assert
			expect(result).toBe('test-element');
			expect(document.createElement).toHaveBeenCalledWith('div');
			expect(document.body.appendChild).toHaveBeenCalled();
			expect((mockContainer.style as any).position).toBe('absolute');
			expect((mockContainer.style as any).width).toBe('auto');
			expect((mockContainer.style as any).zIndex).toBe('9999');
			expect((mockContainer.style as any).boxSizing).toBe('border-box');
			expect((mockContainer.style as any).top).toBe('150px');
			expect((mockContainer.style as any).left).toBe('100px');
			expect((instance(mockContainer) as HTMLDivElement).innerHTML).toBe('Test content');

			// Advance timers to process the setTimeout
			jest.runAllTimers();
		});

		it('should create and position an element with HTMLElement content', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: instance(mockContentElement),
				id: 'test-element'
			};

			// Act
			const result = GlobalPortalService.createElement(config);

			// Assert
			expect(result).toBe('test-element');
			expect(document.createElement).toHaveBeenCalledWith('div');
			expect(document.body.appendChild).toHaveBeenCalled();
			verify(mockContainer.appendChild(instance(mockContentElement))).once();

			// Advance timers to process the setTimeout
			jest.runAllTimers();
		});

		it('should remove existing element with the same ID', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id: 'test-element'
			};

			// First create an element
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Reset mocks to verify new calls
			jest.clearAllMocks();

			// Act - Create another element with the same ID
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect(document.body.removeChild).toHaveBeenCalled();
			expect(document.createElement).toHaveBeenCalledWith('div');
			expect(document.body.appendChild).toHaveBeenCalled();
		});

		it('should add custom styles if provided', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				styles: '.custom-style { color: red; }',
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect(document.createElement).toHaveBeenCalledWith('style');
			verify(mockContainer.appendChild(instance(mockStyleElement))).once();
			expect((instance(mockStyleElement) as HTMLStyleElement).textContent).toBe('.custom-style { color: red; }');
		});

		it('should position the element above the trigger', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				position: 'above' as 'above' | 'below' | 'left' | 'right',
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect((mockContainer.style as any).top).toBe('0px'); // 100 (triggerRect.top) - 100 (elementRect.height) = 0
			expect((mockContainer.style as any).left).toBe('100px');
		});

		it('should position the element to the left of the trigger', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				position: 'left' as 'above' | 'below' | 'left' | 'right',
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect((mockContainer.style as any).top).toBe('100px');
			expect((mockContainer.style as any).left).toBe('0px'); // 100 (triggerRect.left) - 100 (elementRect.width) = 0
		});

		it('should position the element to the right of the trigger', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				position: 'right' as 'above' | 'below' | 'left' | 'right',
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect((mockContainer.style as any).top).toBe('100px');
			expect((mockContainer.style as any).left).toBe('200px'); // triggerRect.right
		});

		it('should apply offset to the element position', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				offset: { x: 10, y: 20 },
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect((mockContainer.style as any).top).toBe('170px'); // 150 (triggerRect.bottom) + 20 (offset.y)
			expect((mockContainer.style as any).left).toBe('110px'); // 100 (triggerRect.left) + 10 (offset.x)
		});

		it('should handle overflow prevention for right edge', () => {
			// Arrange
			// Mock element dimensions to cause right edge overflow
			Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function () {
				if (this === instance(mockTriggerElement)) {
					return {
						top: 100,
						bottom: 150,
						left: 900,
						right: 950,
						width: 50,
						height: 50
					};
				}
				if (this === instance(mockContainer)) {
					return {
						width: 200,
						height: 100
					};
				}
				return originalGetBoundingClientRect.call(this);
			});

			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect((mockContainer.style as any).left).toBe('795px'); // 1000 (viewport width) - 200 (element width) - 5 (margin)
		});

		it('should handle overflow prevention for bottom edge', () => {
			// Arrange
			// Mock element dimensions to cause bottom edge overflow
			Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function () {
				if (this === instance(mockTriggerElement)) {
					return {
						top: 750,
						bottom: 780,
						left: 100,
						right: 200,
						width: 100,
						height: 30
					};
				}
				if (this === instance(mockContainer)) {
					return {
						width: 200,
						height: 100
					};
				}
				return originalGetBoundingClientRect.call(this);
			});

			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect((mockContainer.style as any).top).toBe('650px'); // 750 (triggerRect.top) - 100 (element height)
		});

		it('should handle scrolling when calculating position', () => {
			// Arrange
			// Mock scroll values
			Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
			Object.defineProperty(window, 'scrollX', { value: 25, configurable: true });

			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect((mockContainer.style as any).top).toBe('200px'); // 150 (triggerRect.bottom) + 50 (scrollY)
			expect((mockContainer.style as any).left).toBe('125px'); // 100 (triggerRect.left) + 25 (scrollX)
		});

		it('should add event listener for outside clicks if closeOnOutsideClick is true', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				closeOnOutsideClick: true,
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
		});

		it('should not add event listener for outside clicks if closeOnOutsideClick is false', () => {
			// Arrange
			const config = {
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				closeOnOutsideClick: false,
				id: 'test-element'
			};

			// Act
			GlobalPortalService.createElement(config);
			jest.runAllTimers();

			// Assert
			expect(document.addEventListener).not.toHaveBeenCalled();
		});
	});

	describe('removeElement', () => {
		it('should remove element from DOM and registry when it exists', () => {
			// Arrange
			const id = 'test-element';

			// First create an element
			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id
			});

			jest.runAllTimers();

			// Reset mocks to verify new calls
			jest.clearAllMocks();

			// Act
			const result = GlobalPortalService.removeElement(id);

			// Assert
			expect(result).toBe(true);
			expect(document.body.removeChild).toHaveBeenCalled();
			expect((GlobalPortalService as any).activeElements.has(id)).toBe(false);
		});

		it('should return false when element does not exist', () => {
			// Act
			const result = GlobalPortalService.removeElement('non-existent-id');

			// Assert
			expect(result).toBe(false);
			expect(document.body.removeChild).not.toHaveBeenCalled();
		});
	});

	describe('removeAllElements', () => {
		it('should remove all elements from DOM and registry', () => {
			// Arrange
			// Create several elements
			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content 1',
				id: 'element-1'
			});

			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content 2',
				id: 'element-2'
			});

			jest.runAllTimers();

			// Reset mocks to verify new calls
			jest.clearAllMocks();

			// Act
			GlobalPortalService.removeAllElements();

			// Assert
			expect(document.body.removeChild).toHaveBeenCalledTimes(2);
			expect((GlobalPortalService as any).activeElements.size).toBe(0);
		});
	});

	describe('updateElementPosition', () => {
		it('should update the position of an existing element', () => {
			// Arrange
			const id = 'test-element';

			// First create an element
			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id
			});

			jest.runAllTimers();

			// Reset mocks to verify new calls
			jest.clearAllMocks();

			// Mock new trigger element position
			const newMockTrigger = mock<HTMLElement>();

			Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(function () {
				if (this === instance(newMockTrigger)) {
					return {
						top: 200,
						bottom: 250,
						left: 200,
						right: 300,
						width: 100,
						height: 50
					};
				}
				if (this === instance(mockContainer)) {
					return {
						width: 200,
						height: 100
					};
				}
				return originalGetBoundingClientRect.call(this);
			});

			// Act
			const result = GlobalPortalService.updateElementPosition(id, {
				triggerElement: instance(newMockTrigger),
				position: 'above' as 'above' | 'below' | 'left' | 'right'
			});

			// Assert
			expect(result).toBe(true);
			expect((mockContainer.style as any).top).toBe('100px'); // 200 (top) - 100 (height)
			expect((mockContainer.style as any).left).toBe('200px');
		});

		it('should return false when element does not exist', () => {
			// Act
			const result = GlobalPortalService.updateElementPosition('non-existent-id', {
				triggerElement: instance(mockTriggerElement)
			});

			// Assert
			expect(result).toBe(false);
		});

		it('should return false when no triggerElement is provided', () => {
			// Arrange
			const id = 'test-element';

			// First create an element
			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id
			});

			jest.runAllTimers();

			// Act
			const result = GlobalPortalService.updateElementPosition(id, {});

			// Assert
			expect(result).toBe(false);
		});
	});

	describe('outside click handling', () => {
		it('should remove element when clicking outside', () => {
			// Arrange
			const onCloseMock = jest.fn();
			const id = 'test-element';

			// Create an element with onClose callback
			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id,
				onClose: onCloseMock
			});

			jest.runAllTimers();

			// Reset mocks to verify new calls
			jest.clearAllMocks();

			// Create a click event with a target outside the element
			const clickEvent = new MouseEvent('click');
			Object.defineProperty(clickEvent, 'target', { value: document.body });

			// Assert
			expect(document.body.removeChild).toHaveBeenCalled();
			expect(onCloseMock).toHaveBeenCalled();
		});

		it('should not remove element when clicking inside the element', () => {
			// Arrange
			const onCloseMock = jest.fn();
			const id = 'test-element';

			// Setup container.contains to return true for clicks inside
			when(mockContainer.contains(anything())).thenReturn(true);

			// Create an element with onClose callback
			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id,
				onClose: onCloseMock
			});

			jest.runAllTimers();

			// Reset mocks to verify new calls
			jest.clearAllMocks();

			// Create a click event with a target inside the element
			const clickEvent = new MouseEvent('click');
			Object.defineProperty(clickEvent, 'target', { value: instance(mockContainer) });

			// Assert
			expect(document.body.removeChild).not.toHaveBeenCalled();
			expect(onCloseMock).not.toHaveBeenCalled();
			expect(document.removeEventListener).not.toHaveBeenCalled();
		});
	});

	describe('MutationObserver', () => {
		it('should update position when content changes', () => {
			// Arrange
			const id = 'test-element';

			// First create an element to register the MutationObserver
			GlobalPortalService.createElement({
				triggerElement: instance(mockTriggerElement),
				content: 'Test content',
				id
			});

			jest.runAllTimers();

			// Reset mocks to verify new calls
			jest.clearAllMocks();

			// Get the observer callback from the MutationObserver mock in setupTests.js
			// and trigger it directly
			((GlobalPortalService as any).activeElements.get(id) as any).style = {};

			// Act - simulate MutationObserver callback
			const mockMutationCallback = (MutationObserver as any).mock.instances[0].constructor.mock.calls[0][0];
			mockMutationCallback([{ type: 'childList' }]);

			// Assert
			expect((mockContainer.style as any).top).toBe('150px');
			expect((mockContainer.style as any).left).toBe('100px');
		});
	});

	describe('generateId', () => {
		it('should generate a unique ID', () => {
			// Arrange
			const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(123456789);
			const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.42);

			// Act
			const result = (GlobalPortalService as any).generateId();

			// Assert
			expect(result).toBe('global-element-123456789-420');

			// Clean up
			dateSpy.mockRestore();
			randomSpy.mockRestore();
		});
	});
});
