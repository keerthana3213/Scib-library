import { MoleculesLateralMenu } from '../component/lateral-menu';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Item, Items } from '../models/lateral-menu.model';

describe('MoleculesLateralMenu', () => {
	let component: MoleculesLateralMenu;
	let page: SpecPage;

	const mockItems: Items = [
		{ id: '1', text: 'Item 1', level: 1, subtext: 'Sub 1' },
		{ id: '2', text: 'Item 2', level: 2 },
		{ id: '3', text: 'Item 3', level: 3 },
		{ id: '4', text: 'Item 4', level: 1 },
		{ id: '5', text: 'Item 5', level: 2 }
	];

	const hierarchicalItems: Items = [
		{ id: 'parent1', text: 'Parent 1', level: 1, hasChevron: true, isExpanded: false },
		{ id: 'child1', text: 'Child 1', level: 2 },
		{ id: 'parent2', text: 'Parent 2', level: 1, hasChevron: true, isExpanded: true },
		{ id: 'child2', text: 'Child 2', level: 2 },
		{ id: 'child3', text: 'Child 3', level: 2 }
	];

	beforeEach(async () => {
		page = await newSpecPage({
			components: [MoleculesLateralMenu],
			html: '<scib-molecules-lateral-menu></scib-molecules-lateral-menu>'
		});
		component = page.rootInstance;
	});

	describe('initialization', () => {
		it('should create component instance', () => {
			expect(component).toBeTruthy();
			expect(component).toBeInstanceOf(MoleculesLateralMenu);
		});

		it('should initialize default properties', () => {
			expect(component.collapsible).toBe(false);
			expect(component.showChevrons).toBe(true);
			expect(component.collapseMode).toBe('full');
			expect(component._collapsed).toBe(false);
		});

		it('should initialize literals with default values', () => {
			expect(component.literals).toEqual({
				showMenu: 'Show menu',
				hideMenu: 'Hide menu',
				expand: 'Expand',
				collapse: 'Collapse'
			});
		});
	});

	describe('componentWillLoad', () => {
		it('should call all initialization methods', () => {
			const parseItemsSpy = jest.spyOn(component, 'parseItems');
			const parseSelectedSpy = jest.spyOn(component, 'parseSelected');
			const parseCollapsedSpy = jest.spyOn(component, 'parseCollapsed');
			const updateItemsWithChevronInfoSpy = jest.spyOn(component, 'updateItemsWithChevronInfo');

			component.items = JSON.stringify(mockItems);
			component.selected = '1';
			component.collapsed = true;
			component.icon = 'test-icon';

			component.componentWillLoad();

			expect(parseItemsSpy).toHaveBeenCalledWith(component.items);
			expect(parseSelectedSpy).toHaveBeenCalledWith('1');
			expect(parseCollapsedSpy).toHaveBeenCalledWith(true);
			expect(updateItemsWithChevronInfoSpy).toHaveBeenCalled();
			expect(component.iconSelected).toBe('test-icon');
		});

		it('should set iconSelected to icon if not provided', () => {
			component.icon = 'default-icon';
			component.iconSelected = undefined;

			component.componentWillLoad();

			expect(component.iconSelected).toBe('default-icon');
		});
	});

	describe('parseItems', () => {
		it('should parse string items correctly', () => {
			const itemsString = JSON.stringify(mockItems);
			component.parseItems(itemsString);

			// Should contain the original items plus chevron info
			expect(component._items).toHaveLength(mockItems.length);
			expect(component._items[0]).toEqual(
				expect.objectContaining({
					id: '1',
					text: 'Item 1',
					level: 1,
					subtext: 'Sub 1',
					hasChevron: expect.any(Boolean),
					isExpanded: false
				})
			);
		});

		it('should parse array items directly', () => {
			component.parseItems(mockItems);

			// Should contain the original items plus chevron info
			expect(component._items).toHaveLength(mockItems.length);
			expect(component._items[0]).toEqual(
				expect.objectContaining({
					id: '1',
					text: 'Item 1',
					level: 1,
					subtext: 'Sub 1'
				})
			);
		});

		it('should call parseSelected if selected is set', () => {
			const parseSelectedSpy = jest.spyOn(component, 'parseSelected');
			component.selected = '1';

			component.parseItems(mockItems);

			expect(parseSelectedSpy).toHaveBeenCalledWith('1');
		});
	});

	describe('parseSelected', () => {
		beforeEach(() => {
			component._items = mockItems;
		});

		it('should set selectedItem and selectedIndex when item found', () => {
			component.parseSelected('2');

			expect(component.selectedItem).toEqual(mockItems[1]);
			expect(component.selectedIndex).toBe(1);
		});

		it('should not set selectedItem when item not found', () => {
			component.parseSelected('999');

			expect(component.selectedItem).toBeUndefined();
			expect(component.selectedIndex).toBeUndefined();
		});

		it('should not set selectedItem when newSelected is empty', () => {
			component.parseSelected('');

			expect(component.selectedItem).toBeUndefined();
		});

		it('should not set selectedItem when _items is undefined', () => {
			component._items = undefined;
			component.parseSelected('1');

			expect(component.selectedItem).toBeUndefined();
		});
	});

	describe('parseCollapsed', () => {
		it('should set _collapsed state', () => {
			component.parseCollapsed(true);
			expect(component._collapsed).toBe(true);

			component.parseCollapsed(false);
			expect(component._collapsed).toBe(false);
		});
	});

	describe('setSelectedItem', () => {
		it('should set selectedItem, selectedIndex and emit event', () => {
			const emitSpy = jest.spyOn(component.itemSelected, 'emit');
			const item = mockItems[0];

			component.setSelectedItem(item, 0);

			expect(component.selectedItem).toBe(item);
			expect(component.selectedIndex).toBe(0);
			expect(emitSpy).toHaveBeenCalledWith(item);
		});
	});

	describe('getItemPadding', () => {
		it('should return correct padding for level 1', () => {
			expect(component.getItemPadding(1)).toBe('0px');
		});

		it('should return correct padding for level 2', () => {
			expect(component.getItemPadding(2)).toBe('8px');
		});

		it('should return correct padding for level 3', () => {
			expect(component.getItemPadding(3)).toBe('16px');
		});

		it('should return default padding for undefined level', () => {
			expect(component.getItemPadding()).toBe('0px');
		});
	});

	describe('hasChildren', () => {
		it('should return true when item has children', () => {
			const result = component.hasChildren(hierarchicalItems, 0);
			expect(result).toBe(true);
		});

		it('should return false when item has no children', () => {
			const result = component.hasChildren(hierarchicalItems, 1);
			expect(result).toBe(false);
		});
	});

	describe('isItemVisible', () => {
		beforeEach(() => {
			component._items = hierarchicalItems;
		});

		it('should return true when showChevrons is false', () => {
			component.showChevrons = false;
			const result = component.isItemVisible(hierarchicalItems, 1);
			expect(result).toBe(true);
		});

		it('should return true for level 1 items', () => {
			const result = component.isItemVisible(hierarchicalItems, 0);
			expect(result).toBe(true);
		});

		it('should return false when parent is not expanded', () => {
			const result = component.isItemVisible(hierarchicalItems, 1);
			expect(result).toBe(false);
		});

		it('should return true when parent is expanded', () => {
			const result = component.isItemVisible(hierarchicalItems, 3);
			expect(result).toBe(true);
		});
	});

	describe('toggleCollapsed', () => {
		it('should toggle _collapsed state', () => {
			component._collapsed = false;
			component.toggleCollapsed();
			expect(component._collapsed).toBe(true);

			component.toggleCollapsed();
			expect(component._collapsed).toBe(false);
		});
	});

	describe('toggleChevron', () => {
		beforeEach(() => {
			component._items = [...hierarchicalItems];
		});

		it('should toggle isExpanded property', () => {
			const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;

			component.toggleChevron(hierarchicalItems[0], 0, mockEvent);

			expect(component._items[0].isExpanded).toBe(true);
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
		});

		it('should not modify items when _items is not array', () => {
			component._items = null;
			const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;

			component.toggleChevron(hierarchicalItems[0], 0, mockEvent);

			expect(mockEvent.stopPropagation).toHaveBeenCalled();
		});
	});

	describe('getSliderVisibleIndex', () => {
		beforeEach(() => {
			component._items = mockItems;
		});

		it('should return -1 when no selectedItem', () => {
			component.selectedItem = undefined;
			const result = component.getSliderVisibleIndex();
			expect(result).toBe(-1);
		});

		it('should return -1 when _items is not array', () => {
			component._items = null;
			component.selectedItem = mockItems[0];
			const result = component.getSliderVisibleIndex();
			expect(result).toBe(-1);
		});

		it('should return correct index for visible selected item', () => {
			component.selectedItem = mockItems[0];
			jest.spyOn(component, 'isItemVisible').mockReturnValue(true);

			const result = component.getSliderVisibleIndex();
			expect(result).toBe(0);
		});
	});

	describe('containsSelectedItem', () => {
		beforeEach(() => {
			component.selectedItem = hierarchicalItems[1];
		});

		it('should return false when no selectedItem', () => {
			component.selectedItem = undefined;
			const result = component.containsSelectedItem(hierarchicalItems, 0);
			expect(result).toBe(false);
		});

		it('should return true when parent contains selected item', () => {
			const result = component.containsSelectedItem(hierarchicalItems, 0);
			expect(result).toBe(true);
		});

		it('should return false when parent does not contain selected item', () => {
			const result = component.containsSelectedItem(hierarchicalItems, 2);
			expect(result).toBe(false);
		});
	});

	describe('isItemActiveInView', () => {
		beforeEach(() => {
			component._items = hierarchicalItems;
			component.selectedItem = hierarchicalItems[1];
		});

		it('should return false when no selectedItem', () => {
			component.selectedItem = undefined;
			const result = component.isItemActiveInView(hierarchicalItems[0], 0);
			expect(result).toBe(false);
		});

		it('should return true when item is selected item', () => {
			const result = component.isItemActiveInView(hierarchicalItems[1], 1);
			expect(result).toBe(true);
		});

		it('should return false for non-selected items with no children', () => {
			const result = component.isItemActiveInView(hierarchicalItems[2], 2);
			expect(result).toBe(false);
		});
	});

	describe('getSelectedItemIndex', () => {
		beforeEach(() => {
			component._items = mockItems;
		});

		it('should return -1 when no selectedItem', () => {
			component.selectedItem = undefined;
			const result = component.getSelectedItemIndex();
			expect(result).toBe(-1);
		});

		it('should return -1 when _items is not array', () => {
			component._items = null;
			component.selectedItem = mockItems[0];
			const result = component.getSelectedItemIndex();
			expect(result).toBe(-1);
		});

		it('should return correct index when item found', () => {
			component.selectedItem = mockItems[1];
			const result = component.getSelectedItemIndex();
			expect(result).toBe(1);
		});
	});

	describe('updateItemsWithChevronInfo', () => {
		it('should not update when _items is not array', () => {
			component._items = null;
			component.updateItemsWithChevronInfo();
			expect(component._items).toBeNull();
		});

		it('should update items with chevron info', () => {
			component._items = [...mockItems];
			component.showChevrons = true;

			component.updateItemsWithChevronInfo();

			expect(component._items[0]).toHaveProperty('hasChevron');
			expect(component._items[0]).toHaveProperty('isExpanded');
		});
	});

	describe('componentDidLoad', () => {
		it('should call componentDidLoad without errors', () => {
			expect(() => component.componentDidLoad()).not.toThrow();
		});
	});

	describe('disconnectedCallback', () => {
		it('should call disconnectedCallback without errors', () => {
			expect(() => component.disconnectedCallback()).not.toThrow();
		});
	});

	describe('isClosestVisibleParent', () => {
		beforeEach(() => {
			component._items = hierarchicalItems;
		});

		it('should return false when parent level >= selected level', () => {
			const result = component.isClosestVisibleParent(1, 0);
			expect(result).toBe(false);
		});

		it('should return true when valid parent relationship exists', () => {
			const result = component.isClosestVisibleParent(0, 1);
			expect(result).toBe(true);
		});
	});

	describe('render', () => {
		it('should render component without errors', () => {
			component._items = mockItems;
			component.selectedItem = mockItems[0];
			component._collapsed = false;
			component.slotHeight = 50;
			component.fullWidth = 100;
			component.iconsOnlyWidth = 48;
			component.headerWidth = 200;

			const result = component.render();
			expect(result).toBeDefined();
		});

		it('should render in collapsed state', () => {
			component._collapsed = true;
			component.collapseMode = 'full';

			const result = component.render();
			expect(result).toBeDefined();
		});

		it('should render in icons only mode', () => {
			component._collapsed = true;
			component.collapseMode = 'icons';

			const result = component.render();
			expect(result).toBeDefined();
		});
	});

	describe('integration tests', () => {
		it('should handle complete item selection flow', () => {
			component._items = mockItems;
			const item = mockItems[1];
			const emitSpy = jest.spyOn(component.itemSelected, 'emit');

			component.setSelectedItem(item, 1);

			expect(component.selectedItem).toBe(item);
			expect(component.selectedIndex).toBe(1);
			expect(emitSpy).toHaveBeenCalledWith(item);
		});

		it('should handle chevron toggling correctly', () => {
			component._items = [...hierarchicalItems];
			const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;
			const initialExpanded = component._items[0].isExpanded;

			component.toggleChevron(component._items[0], 0, mockEvent);

			expect(component._items[0].isExpanded).toBe(!initialExpanded);
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
		});

		it('should handle visibility calculations correctly', () => {
			component._items = hierarchicalItems;
			component.showChevrons = true;

			// Level 1 should always be visible
			expect(component.isItemVisible(hierarchicalItems, 0)).toBe(true);

			// Child of unexpanded parent should not be visible
			expect(component.isItemVisible(hierarchicalItems, 1)).toBe(false);

			// Child of expanded parent should be visible
			expect(component.isItemVisible(hierarchicalItems, 3)).toBe(true);
		});

		it('should correctly identify items with children', () => {
			expect(component.hasChildren(hierarchicalItems, 0)).toBe(true); // Parent 1 has children
			expect(component.hasChildren(hierarchicalItems, 1)).toBe(false); // Child 1 has no children
			expect(component.hasChildren(hierarchicalItems, 2)).toBe(true); // Parent 2 has children
		});

		it('should handle item padding correctly', () => {
			expect(component.getItemPadding(1)).toBe('0px');
			expect(component.getItemPadding(2)).toBe('8px');
			expect(component.getItemPadding(3)).toBe('16px');
			expect(component.getItemPadding(undefined)).toBe('0px');
		});
	});
});
