import { Component, Host, h, Prop } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-extension-icon',
	styleUrl: 'ui-extension-icon.scss',
	shadow: false,
	scoped: true,
})
export class UIExtensionIcon {
	@Prop() fileextension: string;

	// Colores asociados a cada extensión del tipo "fichero"
	fileColors: { [key: string]: string } = {
		'xls': '#216f42',
		'.xlsx': '#216f42',
		'xlsx': '#216f42',
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
	};

	// Iconos asociados a cada extensión
	icon: { [key: string]: string } = {
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

	render() {
		return (
			<Host>
				<div class="ui-ei-container">
					<span
						class={{
							'ui-ei-icon u-icon': true,
							'icon-filepage': !this.icon[this.fileextension],
							[this.icon[this.fileextension]]: true,
						}}
					></span>
					<span
						class="ui-ei-extension"
						style={{
							'display': this.fileextension && !this.icon[this.fileextension] ? 'block' : 'none',
							'border-color': this.fileColors[this.fileextension],
							'color': this.fileColors[this.fileextension],
							'font-size': this.fileextension.length > 3 ? '7px' : '8px',
						}}
					>
						{this.fileextension}
					</span>
				</div>
			</Host>
		);
	}
}
