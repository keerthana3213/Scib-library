export const UITableFile: any = props => {
	// Colores asociados a cada extensión del tipo "fichero"
	const fileColors: { [key: string]: string } = {
		xls: '#216f42',
		csv: '#216f42',
		doc: '#005298',
		docx: '#005298',
		ppt: '#ec4321',
		pdf: '#c31530',
	};

	// Iconos asociados a cada extensión
	const icon: { [key: string]: string } = {
		jpg: 'icon-image',
		jpeg: 'icon-image',
		png: 'icon-image',
		tif: 'icon-image',
		mov: 'icon-video',
		odt: 'icon-video',
		avi: 'icon-video',
		wmv: 'icon-video',
		mpeg: 'icon-video',
		flv: 'icon-video',
		zip: 'icon-comprimir',
		rar: 'icon-comprimir',
	};

	return (
		'<div class="c-attachedbar-item-icon-container">' +
		'<span class="c-attachedbar-item-icon u-icon ' +
		(!icon[props.value] ? 'icon-filepage' : '') +
		' ' +
		[icon[props.value]] +
		'"></span>' +
		'<span class="c-attachedbar-item-extension" style="' +
		(props.value && !icon[props.value] ? 'display:block;' : 'display:none;') +
		' border-color:' +
		fileColors[props.value] +
		'; color:' +
		fileColors[props.value] +
		'">' +
		props.value +
		'</span>' +
		'</div>'
	);
};
