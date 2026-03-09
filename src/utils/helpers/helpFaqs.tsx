/**
 *	See url and take selector for the component
 */
export function setSelector(): string {
	const windowLocationPath = setWindowLocationPath();
	if (windowLocationPath === 'home') return 'sgcb-v-home';
	else return '.app-wrapper__content__scroller';
}

/**
 *  Function to select path and the position of where it is
 */
export function setWindowLocationPath(): string {
	return window.location.pathname;
}
