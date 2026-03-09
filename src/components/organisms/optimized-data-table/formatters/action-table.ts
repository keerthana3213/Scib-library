import { cellEmptyAction, calculateMinWidthAction } from './common-utils';
import {
	ActionTableConfig,
	ACTION_TABLE_NAME_ACTION_MENU,
	ACTION_TABLE_NAME_CUSTOM_ACTION,
	ACTION_TABLE_NAME_MOVE_ROW,
	ACTION_TABLE_NAME_SHOW_DETAIL,
	ACTION_TABLE_NAME_SHOW_INFO,
	LIST_ORDER_ACTION,
	TableCell
} from '../models/optimized-data-table.model';
import {
	customActionSimple,
	moveDown,
	moveUp,
	showDetail as showDetailFunction,
	actionMenu as actionMenuFunction,
	showInfo as showInfoFunction
} from '../utils/actions-icons';

export const actionTable = (cell: TableCell, formatterParams: ActionTableConfig) => {
	const { actionMenu, showInfo, customActions, showDetail } = formatterParams;

	const listOrderedActionToShow = Object.keys(formatterParams)
		?.filter((actionName) => LIST_ORDER_ACTION.includes(actionName))
		.sort((action1, action2) => LIST_ORDER_ACTION.indexOf(action1) - LIST_ORDER_ACTION.indexOf(action2));

	const containerActions = document.createElement('div');
	containerActions.classList.add('tabulator-action-table-container');

	listOrderedActionToShow?.forEach((actionTableName) => {
		if (actionTableName === ACTION_TABLE_NAME_MOVE_ROW) {
			containerActions.appendChild(moveUp(cell));
			containerActions.appendChild(moveDown(cell));
		}

		if (actionTableName === ACTION_TABLE_NAME_SHOW_DETAIL) {
			containerActions.appendChild(showDetailFunction(cell, showDetail));
		}

		if (actionTableName === ACTION_TABLE_NAME_CUSTOM_ACTION) {
			customActions.forEach((customAction) => {
				containerActions.appendChild(customActionSimple(cell, customAction));
			});
		}

		if (actionTableName === ACTION_TABLE_NAME_ACTION_MENU) {
			const iconShowInfo = actionMenuFunction(cell, actionMenu);
			if (iconShowInfo) {
				containerActions.appendChild(iconShowInfo);
			} else if (containerActions.childElementCount > 0) {
				containerActions.appendChild(cellEmptyAction());
			}
		}

		if (actionTableName === ACTION_TABLE_NAME_SHOW_INFO) {
			const iconShowInfo = showInfoFunction(cell, showInfo);
			if (iconShowInfo) {
				containerActions.appendChild(iconShowInfo);
			} else if (containerActions.childElementCount > 0) {
				containerActions.appendChild(cellEmptyAction());
			}
		}
	});

	// this min width is mandatory for resize last column
	cell.getElement().style.minWidth = `${calculateMinWidthAction(formatterParams)}px`;

	return containerActions;
};
