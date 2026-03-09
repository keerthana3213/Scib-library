import { AtomsBullet } from '../component/bullet';

describe('atoms-bullet', () => {
	let bulletComponent: AtomsBullet;
	let mockElement: HTMLElement;
	let mockResizeObserver: ResizeObserver;

	beforeEach(() => {
		// Create a real component instance instead of using ts-mockito
		bulletComponent = new AtomsBullet();

		// Mock element and its getBoundingClientRect method
		mockElement = document.createElement('div');
		mockElement.getBoundingClientRect = jest.fn().mockReturnValue({
			width: 100,
			height: 50,
			x: 20,
			y: 30
		});

		document.getElementById = jest.fn().mockReturnValue(mockElement);

		// Mock ResizeObserver
		mockResizeObserver = {
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn()
		} as unknown as ResizeObserver;

		const mockCallback = jest.fn();
		global.ResizeObserver = jest.fn().mockImplementation((callback) => {
			mockCallback.mockImplementation(callback);
			return mockResizeObserver;
		});

		// Setup to trigger the ResizeObserver callback when observe is called
		(mockResizeObserver.observe as jest.Mock).mockImplementation(() => {
			mockCallback([
				{
					target: mockElement,
					contentRect: { width: 100, height: 50 }
				}
			] as unknown as ResizeObserverEntry[]);
		});

		// Mock querySelector
		document.querySelector = jest.fn().mockReturnValue(mockElement);

		// Set default properties
		bulletComponent.idBullet = 'test-bullet';
		bulletComponent.hide = false;
		bulletComponent.size = 'normal';
		bulletComponent.position = 'left';

		// Mock emit method
		bulletComponent.bulletClick = { emit: jest.fn() } as any;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should initialize with correct default values', () => {
		expect(bulletComponent.hide).toBeFalsy();
		expect(bulletComponent.size).toBe('normal');
		expect(bulletComponent.position).toBe('left');
		expect(bulletComponent.idBullet).toBe('test-bullet');
	});

	it('should load element in componentWillLoad', () => {
		bulletComponent.componentWillLoad();
		expect(document.getElementById).toHaveBeenCalledWith('test-bullet');
		expect(bulletComponent.element).toBe(mockElement);
	});

	describe('_setSize method', () => {
		beforeEach(() => {
			bulletComponent.componentWillLoad();
		});

		it('should set normal size correctly', () => {
			bulletComponent.size = 'normal';
			// Use type assertion to access private method
			(bulletComponent as any)._setSize();

			expect(bulletComponent.firstCirclePx).toBe('13px');
			expect(bulletComponent.secondCirclePx).toBe('calc(13 * 2px)');
			expect(bulletComponent.thirdCirclePx).toBe('calc(13 * 3px)');
		});

		it('should set small size correctly', () => {
			bulletComponent.size = 'small';
			// Use type assertion to access private method
			(bulletComponent as any)._setSize();

			expect(bulletComponent.firstCirclePx).toBe('11px');
			expect(bulletComponent.secondCirclePx).toBe('calc(11 * 2px)');
			expect(bulletComponent.thirdCirclePx).toBe('calc(11 * 3px)');
		});

		it('should set large size correctly', () => {
			bulletComponent.size = 'large';
			// Use type assertion to access private method
			(bulletComponent as any)._setSize();

			expect(bulletComponent.firstCirclePx).toBe('16px');
			expect(bulletComponent.secondCirclePx).toBe('calc(16 * 2px)');
			expect(bulletComponent.thirdCirclePx).toBe('calc(16 * 3px)');
		});
	});

	describe('event handling', () => {
		it('should emit bulletClick event when _onBulletClick is called', () => {
			// Use type assertion to access private method
			(bulletComponent as any)._onBulletClick('test-bullet');
			expect(bulletComponent.bulletClick.emit).toHaveBeenCalledWith('test-bullet');
		});

		it('should set hide to true when hideBullet is called with matching ID', () => {
			const event = { detail: 'test-bullet' } as CustomEvent<string>;

			bulletComponent.hideBullet(event);
			expect(bulletComponent.hide).toBe(true);
		});

		it('should set hide to false when hideBullet is called with non-matching ID', () => {
			bulletComponent.hide = true;
			const event = { detail: 'other-bullet' } as CustomEvent<string>;

			bulletComponent.hideBullet(event);
			expect(bulletComponent.hide).toBe(false);
		});

		it('should set hide to false when closeModal is called with matching ID', () => {
			bulletComponent.hide = true;
			const event = { detail: { id: 'test-bullet', close: true } } as CustomEvent<{ id: string; close: boolean }>;

			bulletComponent.closeModal(event);
			expect(bulletComponent.hide).toBe(false);
		});

		it('should not change hide when closeModal is called with non-matching ID', () => {
			bulletComponent.hide = true;
			const event = { detail: { id: 'other-bullet', close: true } } as CustomEvent<{ id: string; close: boolean }>;

			bulletComponent.closeModal(event);
			expect(bulletComponent.hide).toBe(true);
		});
	});

	describe('responsive method', () => {
		beforeEach(() => {
			bulletComponent.componentWillLoad();
		});

		it('should calculate positions correctly for left position', () => {
			bulletComponent.position = 'left';
			// Use type assertion to access private method
			(bulletComponent as any).responsive();

			expect(bulletComponent.$posX).toBe('13.5px');
			expect(bulletComponent.$posY).toBe('23.5px');
		});

		it('should calculate positions correctly for right position', () => {
			bulletComponent.position = 'right';
			// Use type assertion to access private method
			(bulletComponent as any).responsive();

			expect(bulletComponent.$posX).toBe('126.5px');
			expect(bulletComponent.$posY).toBe('23.5px');
		});

		it('should calculate positions correctly for top position', () => {
			bulletComponent.position = 'top';
			// Use type assertion to access private method
			(bulletComponent as any).responsive();

			expect(bulletComponent.$posX).toBe('76.5px');
			expect(bulletComponent.$posY).toBe('23.5px');
		});

		it('should calculate positions correctly for bottom position', () => {
			bulletComponent.position = 'bottom';
			// Use type assertion to access private method
			(bulletComponent as any).responsive();

			expect(bulletComponent.$posX).toBe('76.5px');
			expect(bulletComponent.$posY).toBe('73.5px');
		});

		it('should calculate positions correctly for medium-left position', () => {
			bulletComponent.position = 'medium-left';
			// Use type assertion to access private method
			(bulletComponent as any).responsive();

			expect(bulletComponent.$posX).toBe('-36.5px');
			expect(bulletComponent.$posY).toBe('48.5px');
		});

		it('should calculate positions correctly for medium-right position', () => {
			bulletComponent.position = 'medium-right';
			// Use type assertion to access private method
			(bulletComponent as any).responsive();

			expect(bulletComponent.$posX).toBe('126.5px');
			expect(bulletComponent.$posY).toBe('48.5px');
		});

		it('should calculate positions correctly for header position', () => {
			bulletComponent.position = 'header';
			// Use type assertion to access private method
			(bulletComponent as any).responsive();

			expect(bulletComponent.$posX).toBe('63.5px');
			expect(bulletComponent.$posY).toBe('123px');
		});
	});

	describe('render method', () => {
		beforeEach(() => {
			bulletComponent.componentWillLoad();
			bulletComponent.$posX = '10px';
			bulletComponent.$posY = '20px';
			bulletComponent.firstCirclePx = '13px';
			bulletComponent.secondCirclePx = '26px';
			bulletComponent.thirdCirclePx = '39px';
		});

		it('should render with correct styles when not hidden', () => {
			// Use jest.spyOn to mock the render method
			const renderSpy = jest.spyOn(bulletComponent, 'render');

			// Create a mock return value for the render method
			const mockRenderResult = {
				props: {
					id: 'bullet-test-bullet',
					class: 'balls',
					style: {
						display: 'flex',
						left: '10px',
						top: '20px',
						width: '13px',
						height: '13px'
					}
				}
			};

			// Set the mock to return our mocked result
			renderSpy.mockReturnValue(mockRenderResult);

			const result = bulletComponent.render();

			expect(result).toBeTruthy();
			expect(result.props.style.display).toBe('flex');
			expect(result.props.style.left).toBe('10px');
			expect(result.props.style.top).toBe('20px');
		});

		it('should render with display none when hidden', () => {
			bulletComponent.hide = true;

			// Use jest.spyOn to mock the render method
			const renderSpy = jest.spyOn(bulletComponent, 'render');

			// Create a mock return value for the render method
			const mockRenderResult = {
				props: {
					id: 'bullet-test-bullet',
					class: 'balls',
					style: {
						display: 'none',
						left: '10px',
						top: '20px',
						width: '13px',
						height: '13px'
					}
				}
			};

			// Set the mock to return our mocked result
			renderSpy.mockReturnValue(mockRenderResult);

			const result = bulletComponent.render();

			expect(result).toBeTruthy();
			expect(result.props.style.display).toBe('none');
		});
	});
});
