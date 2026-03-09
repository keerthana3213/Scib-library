import { MockHTMLElement } from '@stencil/core/mock-doc';
import { Blob } from 'buffer';

class File extends Blob {
	name;
	constructor(a, name) {
		super(a);
		this.name = name;
	}
}

global.beforeEach(() => {
	global.File = File;
	jest.setTimeout(50 * 1000);
	jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
	Object.defineProperty(MockHTMLElement.prototype, 'assignedElements', {
		value: () => [],
		configurable: true,
		writable: true
	});
	Object.defineProperty(MockHTMLElement.prototype, 'assignedNodes', {
		value: () => [],
		configurable: true,
		writable: true
	});

	Object.defineProperty(MockHTMLElement.prototype, 'checkVisibility', {
		value: () => true,
		configurable: true,
		writable: true
	});

	global.ResizeObserver = jest.fn().mockImplementation(() => ({
		observe: jest.fn(),
		unobserve: jest.fn(),
		disconnect: jest.fn()
	}));

	// Mock window.luxon DateTime
	global.luxon = {
		DateTime: {
			fromJSDate: jest.fn().mockImplementation((date) => {
				return {
					month: 6, // June
					year: 2025,
					day: 4,
					daysInMonth: 30,
					set: jest.fn().mockReturnValue({
						weekday: 3, // Wednesday
						day: 1,
						month: 6,
						year: 2025,
						toISODate: jest.fn().mockReturnValue('2025-06-01'),
						plus: jest.fn().mockImplementation(({ days }) => ({
							day: days,
							month: 6,
							year: 2025,
							toISODate: jest.fn().mockReturnValue(`2025-06-${days}`),
							weekday: (days % 7) + 1
						}))
					}),
					toISODate: jest.fn().mockReturnValue('2025-06-04')
				};
			}),
			now: jest.fn().mockReturnValue({
				toISODate: jest.fn().mockReturnValue('2025-06-04')
			}),
			fromISO: jest.fn().mockImplementation((dateString) => ({
				toISODate: jest.fn().mockReturnValue(dateString)
			}))
		}
	};
});

global.afterEach(() => {
	jest.setTimeout(5 * 1000);
});

global.MutationObserver = class {
	constructor(callback) {}
	disconnect() {}
	observe(element, initObject) {}
};
