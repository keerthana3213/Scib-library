import { AtomsSegmentedControl } from '../component/segmented-control';

describe('atoms-segmented-control', () => {
	it('builds', () => {
		expect(new AtomsSegmentedControl()).toBeTruthy();
	});

	it('should initialize with default values', () => {
		const component = new AtomsSegmentedControl();
		expect(component.size).toBe('m');
		expect(component.firstLoadComplete).toBeFalsy();
	});

	it('should parse options on component will load', () => {
		// Arrange
		const mockOptions = [
			{ label: 'Option 1', value: 'opt1' },
			{ label: 'Option 2', value: 'opt2' }
		];
		const component = new AtomsSegmentedControl();
		component.options = mockOptions;

		// Mock the private methods
		const parseOptionsSpy = jest.spyOn(component, '_parseOptions' as any);
		const valueHandlerSpy = jest.spyOn(component, '_valueHandler' as any);

		// Act
		component.componentWillLoad();

		// Assert
		expect(parseOptionsSpy).toHaveBeenCalledWith(mockOptions);
		expect(valueHandlerSpy).toHaveBeenCalled();
	});

	it('should change current option', () => {
		// Arrange
		const component = new AtomsSegmentedControl();
		const mockEvent = {
			preventDefault: jest.fn(),
			stopPropagation: jest.fn()
		};
		const emitSpy = jest.fn();
		component.valueChange = { emit: emitSpy } as any;
		const moveBackgroundSpy = jest.spyOn(component, '_moveBackground' as any).mockImplementation();

		// Act
		component.changeCurrentOption(mockEvent as any, 'opt2', 1);

		// Assert
		expect(mockEvent.preventDefault).toHaveBeenCalled();
		expect(mockEvent.stopPropagation).toHaveBeenCalled();
		expect(component.currentOption).toBe('opt2');
		expect(emitSpy).toHaveBeenCalledWith('opt2');
		expect(moveBackgroundSpy).toHaveBeenCalledWith(1, true);
	});

	it('should get id by value', () => {
		// Arrange
		const component = new AtomsSegmentedControl();
		component._options = [
			{ id: 0, label: 'Option 1', value: 'opt1' },
			{ id: 1, label: 'Option 2', value: 'opt2' }
		];

		// Act & Assert
		expect((component as any)._getIdByValue('opt1')).toBe(0);
		expect((component as any)._getIdByValue('opt2')).toBe(1);
		expect((component as any)._getIdByValue('non-existent')).toBe(0);
	});

	it('should move background', () => {
		// Arrange
		const component = new AtomsSegmentedControl();
		component.firstLoadComplete = true;

		// Create mock DOM elements
		component.containerRef = document.createElement('div');
		const mockOption = document.createElement('div');
		const mockBackground = document.createElement('div');

		// Set up properties
		Object.defineProperty(mockOption, 'offsetWidth', { value: 100 });
		Object.defineProperty(mockOption, 'getBoundingClientRect', {
			value: () => ({ left: 150 })
		});

		Object.defineProperty(component.containerRef, 'getBoundingClientRect', {
			value: () => ({ left: 50 })
		});

		// Mock querySelector calls
		jest.spyOn(component.containerRef, 'querySelector').mockImplementation((selector: string) => {
			if (selector === '#option_1') return mockOption;
			if (selector === '#options-background') return mockBackground;
			return null;
		});

		// Mock requestAnimationFrame
		const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
			callback(0);
			return 0;
		});

		// Act
		(component as any)._moveBackground(1);

		// Act with transition
		// Properly mock the classList.contains and classList.add methods
		const containsSpy = jest.fn().mockReturnValue(false);
		const addSpy = jest.fn();

		Object.defineProperty(mockBackground, 'classList', {
			value: {
				contains: containsSpy,
				add: addSpy
			}
		});

		(component as any)._moveBackground(1, true);

		// Assert
		expect(addSpy).toHaveBeenCalledWith('transition');

		// Restore mocks
		requestAnimationFrameSpy.mockRestore();
	});

	it('should render with the correct structure', () => {
		// Arrange
		const component = new AtomsSegmentedControl();
		component._options = [
			{ id: 0, label: 'Option 1', value: 'opt1' },
			{ id: 1, label: 'Option 2', value: 'opt2', icon: 'icon-test' }
		];
		component.currentOption = 'opt1';
		component.firstLoadComplete = true;
		component.size = 's';

		// Act
		const result = component.render();

		// Assert
		expect(result).toBeTruthy();
		// Note: We can't fully test the actual render output because it's JSX,
		// but we can verify that render() returns something
	});

	it('should not move background when container or option is not found', () => {
		// Arrange
		const component = new AtomsSegmentedControl();
		component.firstLoadComplete = true;
		component.containerRef = null;

		const requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame');

		// Act
		(component as any)._moveBackground(1);

		// Assert
		expect(requestAnimationFrameSpy).not.toHaveBeenCalled();

		// Setup with container but no option found
		component.containerRef = document.createElement('div');
		jest.spyOn(component.containerRef, 'querySelector').mockReturnValue(null);

		// Act
		(component as any)._moveBackground(1);

		// Assert - Should not throw errors
		expect(true).toBeTruthy();

		requestAnimationFrameSpy.mockRestore();
	});

	it('should handle string options', () => {
		// Arrange
		const component = new AtomsSegmentedControl();
		const stringOptions = JSON.stringify([
			{ label: 'Option 1', value: 'opt1' },
			{ label: 'Option 2', value: 'opt2' }
		]);

		// Act
		component._parseOptions(stringOptions);

		// Assert
		expect(component._options).toEqual([
			{ id: 0, label: 'Option 1', value: 'opt1' },
			{ id: 1, label: 'Option 2', value: 'opt2' }
		]);
	});
});
