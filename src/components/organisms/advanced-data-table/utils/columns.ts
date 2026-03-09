import { fixedColumns, TableCell } from '../models/advanced-data-table.model';
import { isEmpty } from 'lodash';

export const excludedFormatters = ['rowSelection'];

/**
 *
 * @param columns
 */
export const applyDefaultConfigToColumns = (columns: any[], literals: any) => {
	let frozzenColumnIndex = 1;
	const frozenColumns = (columns || []).filter((column) => {
		const _formatter = column?.formatter || null;
		return column.frozen && !!fixedColumns[_formatter];
	});
	return columns.map((column) => {
		column['topCalcFormatter'] = calcFormatter;
		const { title, formatter, frozen } = column;
		let extraClass = '';
		if (frozen && !!fixedColumns[formatter]) {
			extraClass = `tabulator-frozen-${frozenColumns.length - frozzenColumnIndex}`;
			frozzenColumnIndex += 1;
		}
		if (isEmpty(title) && !excludedFormatters.includes(formatter)) {
			column['cssClass'] = `tabulator-empty-title ${extraClass}`.trim();
		} else if (excludedFormatters.includes(formatter)) {
			column['cssClass'] = `tabulator-checkbox-cell ${extraClass}`.trim();
		}
		if (formatter === 'rowSelection') {
			column['cellClick'] = (cell) => cell.getRow().toggleSelect();
		}
		return column;
	});

	function calcFormatter(cell: TableCell) {
		return !!cell.getValue() ? tooltipTotals(cell) : '';
	}

	function formatNumber(number: number): string {
		const parts = number.toString().split('.');
		const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		const decimalPart = parts[1];
		return `${integerPart}.${decimalPart || '00'}`;
	}

	function tooltipTotals(cell: TableCell) {
		const textContainer = document.createElement('div');
		textContainer.innerText = formatNumber(cell.getValue());
		textContainer?.classList.add('tooltip-text');
		const tooltipTotals = document.createElement('scib-atoms-tooltip-info');
		tooltipTotals.arrow = 'bottom';
		tooltipTotals?.classList.add('tooltip-total');
		// tooltipTotals.disableReposition = true;
		tooltipTotals.literalsTooltip = literals.columnSum;
		tooltipTotals.appendChild(textContainer);
		return tooltipTotals;
	}
};
