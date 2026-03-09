import { isEmpty } from 'lodash';

export const excludedFormatters = ['rowSelection'];

/**
 *
 * @param columns
 */
export const applyDefaultConfigToColumns = (columns: any[]) => {
	return columns.map(column => {
		const { title, formatter } = column;
		if (isEmpty(title) && !excludedFormatters.includes(formatter)) {
			column['cssClass'] = 'tabulator-empty-title';
		} else if (excludedFormatters.includes(formatter)) {
			column['cssClass'] = 'tabulator-checkbox-cell';
		}
		if (formatter === 'rowSelection') {
			column['cellClick'] = cell => cell.getRow().toggleSelect();
		}
		return column;
	});
};
