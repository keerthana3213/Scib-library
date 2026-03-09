import { TableCell } from '../models/optimized-data-table.model';
import { upperCase } from 'lodash';

export const uppercase = (cell: TableCell) => upperCase(cell.getValue());
