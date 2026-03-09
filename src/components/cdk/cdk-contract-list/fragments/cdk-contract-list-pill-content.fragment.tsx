import { FunctionalComponent, h } from '@stencil/core';

export const CDKContractListPillContent: FunctionalComponent<{
	file: any;
}> = props => {
	const extension = props.file.split('.');
	let file = extension[extension.length - 1];
	// Colores asociados a cada extensión del tipo "fichero"
	const fileColors: { [key: string]: string } = {
		'xls': '#216f42',
		'.xlsx': '#216f42',
		'csv': '#216f42',
		'.csv': '#216f42',
		'doc': '#005298',
		'.doc': '#005298',
		'docx': '#005298',
		'.docx': '#005298',
		'ppt': '#ec4321',
		'.pptx': '#ec4321',
		'pdf': '#c31530',
		'.pdf': '#c31530',
		'zip': '',
		'.zip': '',
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

	if (fileColors[file] == undefined || !icon[file] == undefined) {
		file = '';
	}

	return (
		<div class="c-attachedbar-item-icon-container">
			<span
				class={{
					'c-attachedbar-item-icon u-icon': true,
					'icon-filepage': !icon[file],
					[icon[file]]: true,
				}}
			></span>
			<span
				class="c-attachedbar-item-extension"
				style={{
					'display': file && !icon[file] ? 'block' : 'none',
					'border-color': fileColors[file],
					'color': fileColors[file],
				}}
			>
				{file}
			</span>
		</div>
	);
};
