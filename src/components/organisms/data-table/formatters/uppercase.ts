import { TableCell } from '../models/data-table.model';
import { upperCase } from 'lodash';

export const uppercase = (cell: TableCell) => upperCase(cell.getValue());
