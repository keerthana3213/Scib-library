export function autoHeight(dataName) {
	let container = document.querySelectorAll('[' + dataName + ']');
	let maxHeight = 0;

	container.forEach(function (el) {
		let equalClass = el.getAttribute(dataName);
		let elements = el.querySelectorAll(equalClass);
		elements.forEach(function (elem) {
			let elemHeight = elem.clientHeight;
			if (elemHeight > maxHeight) {
				maxHeight = elemHeight;
			}
		});
		if (maxHeight > 0) {
			elements.forEach(function (elem) {
				elem.setAttribute('style', 'height:' + maxHeight + 'px');
			});
		}
	});
}
