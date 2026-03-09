import { TableCustomEvents } from '../models/advanced-data-table.model';
import { emitCustomEvent, getPosition, headerIconStyle, References } from '../formatters/common-utils';
import { compact } from 'lodash';

export const columnActionsHeader = (tableReferenceId) => (cell) => {
	const itemList = [
		{
			id: 'order_column',
			label: 'Order table',
			icon: 'chevrons-up-down',
			data: ''
		},
		{
			id: 'filter_column',
			label: 'Filter',
			icon: 'filter',
			data: ''
		},
		{
			id: 'mark_column',
			label: 'Mark column',
			icon: 'bookmark',
			data: ''
		},
		{
			id: 'clean_marks',
			label: 'Clean marks',
			icon: 'bookmark',
			data: ''
		},
		{
			id: 'copy_data',
			label: 'Copy data',
			icon: 'copy',
			data: ''
		},
		{
			id: 'hide_column',
			label: 'Hide column',
			icon: 'visibility-off',
			data: ''
		}
	];
	const classes = ['tabulator-action-link', 'header'];
	const iconElement = headerIconStyle(cell, '3-dots-vertical', classes);
	iconElement.onclick = () => {
		const { left, top, width, height, topOffset } = getPosition(tableReferenceId, cell.getElement());
		const topGap = 8;
		const menu = References.instance.getActionMenuRef(tableReferenceId);
		menu.setAttribute('item-list', JSON.stringify(compact(itemList)));
		menu.style.setProperty('left', `${left + width}px`);
		menu.style.setProperty('top', `${top + height + (topOffset - topGap)}px`);
		menu.openMenu();
		const value = cell.getValue();
		emitCustomEvent(tableReferenceId, TableCustomEvents.HEADER_COLUMN_ACTION_MENU, value);
	};
	var container = document.createElement('div');
	var iconContainer = document.createElement('div');

	container.style.setProperty('min-width', '0');
	container.style.setProperty('display', 'flex');
	container.style.setProperty('justify-content', 'space-between');
	container.style.setProperty('align-items', 'center');
	iconContainer.style.setProperty('min-width', '0');
	var textContainer = document.createElement('div');
	textContainer.innerText = cell.getValue();
	textContainer.style.setProperty('text-overflow', 'ellipsis');
	textContainer.style.setProperty('overflow', 'hidden');
	textContainer.style.setProperty('white-space', 'no-wrap');
	container.appendChild(textContainer);
	iconContainer.appendChild(iconElement);
	container.appendChild(iconContainer);
	return container;
};
