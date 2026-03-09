/**
 * Fuerza el reflow del elemento para resetear las animation
 * @param: listado de elementos HTML a resetear
 */
export function triggerAnimations(listOfElements?: HTMLElement[]) {
	listOfElements?.forEach(element => {
		if (element) {
			element.style.animation = 'none';
			setTimeout(() => {
				element.style.animation = null;
			});
		}
	});
}
