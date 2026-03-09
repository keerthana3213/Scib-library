export const excludedFormatters = ['rowSelectionCheckbox', 'rowSelectionRadio'];
export const rightFixedColumns = ['actionMenu', 'showDetail', 'showInfo'];

/**
 *
 * @param columns
 */
export const applyDefaultConfigToColumns = (columns: any[]) => {
	return columns.map((column) => {
		const { formatter } = column;

		if (excludedFormatters.includes(formatter)) {
			column['cssClass'] = `tabulator-checkbox-cell`.trim();
		}

		column.baseWidth = column.width;
		column.baseMinWidth = column.minWidth;

		return column;
	});
};
