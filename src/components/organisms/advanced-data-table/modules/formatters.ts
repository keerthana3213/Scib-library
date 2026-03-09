import { extensionFile } from '../formatters/extension-file';
import { trafficLights } from '../formatters/traffic-lights';
import { actionLink } from '../formatters/action-link';
import { showDetail } from '../formatters/show-detail';
import { showInfo } from '../formatters/show-info';
import { actionMenu } from '../formatters/action-menu';
import { statusDot } from '../formatters/status-dot';
import { uppercase } from '../formatters/uppercase';
import { textIcon } from '../formatters/text-icon';
import { rawValue } from '../formatters/raw-value';
import { radio } from '../formatters/radio-button';
import { tooltip } from '../formatters/tooltip';
import { status } from '../formatters/status';
import { image } from '../formatters/image';
import { bold } from '../formatters/bold';
import { inlineStatus } from '../formatters/inline-status';
import { checkbox } from '../formatters/checkbox';
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
import { moveUp } from '../formatters/move-up-row';
import { moveDown } from '../formatters/move-down-row';
import { deleteRow } from '../formatters/delete-row';

export const getCustomFormatters = {
	bold,
	uppercase,
	rawValue,
	image,
	status,
	statusDot,
	textIcon,
	actionLink,
	radio,
	actionMenu,
	tooltip,
	showDetail,
	showInfo,
	extensionFile,
	trafficLights,
	inlineStatus,
	checkbox,
	editor,
	colorIcon,
	dateRange,
	setCustomFormatters,
	moveUp,
	moveDown,
	deleteRow
};

export const getCustomHeaderFormatters = (tableReferenceId: string, tableInstance: any, advancedTable: any) => {
	return {
		actionMenuHeader: actionMenuHeader(),
		showDetailHeader: showDetailHeader(),
		showInfoHeader: showInfoHeader(),
		checkboxHeader: checkboxHeader(tableInstance),
		filterManagerHeader: filterManagerHeader(tableReferenceId, advancedTable),
		tooltipHeader: tooltipHeader()
	};
};
