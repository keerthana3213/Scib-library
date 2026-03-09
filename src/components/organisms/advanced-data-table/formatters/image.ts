import { TableCell } from '../models/advanced-data-table.model';
import { get } from 'lodash';

export const image = (cell: TableCell, formatterParams): string => {
	const {
		borderRadius = '50',
		imageField,
		border = '2px solid #ec0000',
		boxShadow = '0 1px 6px 0 rgba(0, 0, 0, 0.2)',
		width = '37px',
		fontSize = '0.875rem'
	} = formatterParams;
	const srcImage: string = get(cell.getRow().getData(), imageField);
	if (typeof srcImage === 'string') {
		return `<div class="tabulator-image">
            <img class="tabulator-image__img" style="border-radius: ${borderRadius}%; border: ${border}; box-shadow: ${boxShadow}; width: ${width}" src="${srcImage}" [alt]="image" />
            <span style="font-size: ${fontSize}">${cell.getValue()}</span>
        </div>`;
	}
	return `<div class="tabulator-image"><span>${cell.getValue()}</span></div>`;
};
