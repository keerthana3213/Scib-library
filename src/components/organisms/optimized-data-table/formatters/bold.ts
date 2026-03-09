import { TableCell } from '../models/optimized-data-table.model';

export const bold = (cell: TableCell) => `<span class="bold_cell">${cell.getValue()}</span>`;
