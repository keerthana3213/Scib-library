import { SignatureStepFiles } from '../models/cdk-signature-modal.model';
import { last } from 'lodash';
/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const humanFileSize = (bytes, si = false, dp = 1) => {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	return bytes.toFixed(dp) + ' ' + units[u];
};

export const base64ToFile = (item: SignatureStepFiles) => {
	const data = Uint8Array.from(atob(item.base64Data), c => c.charCodeAt(0));
	const file = new File([data], item.fileName, { type: item.type });
	let test = new FormData();
	test.append('file', file, file.name);
	let _file: any = test.get('file');
	Object.assign(_file, {
		formatedSize: humanFileSize(file.size, true, 2),
		extension: `.${last(file.name.split('.'))}`,
		...(item.category ? { category: item.category } : {}),
	});
	return {
		file: _file,
		url: URL.createObjectURL(_file),
	};
};
