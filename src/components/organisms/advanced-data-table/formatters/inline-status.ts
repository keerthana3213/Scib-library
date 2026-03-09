import { TableCell } from '../models/advanced-data-table.model';

export const inlineStatus = (cell: TableCell, formatterParams) => {
	const { field, trueTitle, falseTitle } = formatterParams;
	const value = cell.getData()[field];
	return value == undefined || value == null
		? ''
		: `<div class="inline-status__container"><span class="inline-status inline-status--${value}">${
				value == true ? trueTitle : falseTitle
		  }</span></div>`;
};
