import { extensionFile } from '../formatters/extension-file';
import { trafficLights } from '../formatters/traffic-lights';
import { actionLink } from '../formatters/action-link';
import { showDetail } from '../formatters/show-detail';
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
import { colorIcon } from '../formatters/color-icon';

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
	extensionFile,
	trafficLights,
	inlineStatus,
	colorIcon
};
