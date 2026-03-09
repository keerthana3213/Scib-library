import { extensionFile } from '../formatters/extension-file';
import { trafficLights } from '../formatters/traffic-lights';
import { actionLink } from '../formatters/action-link';
import { statusDot } from '../formatters/status-dot';
import { uppercase } from '../formatters/uppercase';
import { textIcon } from '../formatters/text-icon';
import { rawValue } from '../formatters/raw-value';
import { rowSelectionRadio } from '../formatters/radio-button';
import { tooltip } from '../formatters/tooltip';
import { status } from '../formatters/status';
import { image } from '../formatters/image';
import { bold } from '../formatters/bold';
import { inlineStatus } from '../formatters/inline-status';
import { rowSelectionCheckbox } from '../formatters/checkbox';
import { editor } from '../formatters/editor';
import { actionMenuHeader } from '../headers-formatters/action-menu-header';
import { showDetailHeader } from '../headers-formatters/show-detail-header';
import { showInfoHeader } from '../headers-formatters/show-info-header';
import { checkboxHeader } from '../headers-formatters/checkbox-header';
import { filterManagerHeader } from '../headers-formatters/filter-manager-header';
import { colorIcon } from '../formatters/color-icon';
import { tooltipHeader } from '../headers-formatters/tooltip-header';
import { dateRange } from '../formatters/date-range';
import { setCustomFormatters } from '../formatters/set-custom-formatter';
import { actionTable } from '../formatters/action-table';
import { defaultCells } from '../formatters/default-cells';
import { actionTableHeader } from '../headers-formatters/action-table-header';
import { Formatter } from '../models/optimized-data-table.model';

export const getCustomFormatters: { [key: string]: Formatter } = {
	bold,
	uppercase,
	rawValue,
	image,
	status,
	statusDot,
	textIcon,
	actionLink,
	rowSelectionRadio,
	tooltip,
	extensionFile,
	trafficLights,
	inlineStatus,
	rowSelectionCheckbox,
	editor,
	colorIcon,
	dateRange,
	setCustomFormatters,
	actionTable,
	defaultCells
};

export const getCustomHeaderFormatters = (tableInstance: any, optimizedTable: any) => {
	return {
		actionMenuHeader: actionMenuHeader(),
		showDetailHeader: showDetailHeader(),
		showInfoHeader: showInfoHeader(),
		checkboxHeader: checkboxHeader(tableInstance),
		filterManagerHeader: filterManagerHeader(optimizedTable),
		tooltipHeader: tooltipHeader(),
		actionTableHeader: actionTableHeader()
	};
};
