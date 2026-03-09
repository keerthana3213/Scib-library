import { tailwindConfig } from './tailwind.config';
import { getPublicUrl } from './utils/public_api';
import * as luxon from 'luxon';

/**
 * Define global luxon
 */
export default () => {
	window['luxon'] = luxon;
};

/**
 * Register TailwindCSS
 */
(() => {
	const tailwindcss = document.createElement('script');
	const url = location?.host?.includes('localhost') ? 'https://cdn.tailwindcss.com' : `${getPublicUrl()}/assets/lib/tailwind.js`;
	tailwindcss.src = url;
	document.head.appendChild(tailwindcss);
	tailwindcss.addEventListener('load', function () {
		const tailwind = window['tailwind'];
		tailwind.config = tailwindConfig;
	});
})();
