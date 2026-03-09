import { Component, Host, Prop, h } from '@stencil/core';

@Component({
	tag: 'scib-atoms-extension-icon',
	styleUrl: './extension-icon.scss',
	shadow: true
})
export class AtomsExtensionIcon {
	@Prop() fileextension: string;

	// Colores asociados a cada extensión del tipo "fichero"
	fileColors: { [key: string]: string } = {
		xls: '#216f42',
		'.xlsx': '#216f42',
		xlsx: '#216f42',
		csv: '#216f42',
		'.csv': '#216f42',
		doc: '#005298',
		'.doc': '#005298',
		docx: '#005298',
		'.docx': '#005298',
		ppt: '#ec4321',
		'.pptx': '#ec4321',
		pdf: '#c31530',
		'.pdf': '#c31530'
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
		rar: 'icon-comprimir'
	};

	render() {
		return (
			<Host>
				<div class="atoms-ei-container">
					<i
						class={{
							icon: true,
							'atoms-ei-icon': true
						}}
						style={{
							'--icon-content': !this.icon[this.fileextension]
								? `var(--theme-scib-icon-filepage)`
								: `var(--theme-scib-${this.icon[this.fileextension]})`
						}}
					></i>
					<span
						class="atoms-ei-extension"
						style={{
							display: this.fileextension && !this.icon[this.fileextension] ? 'block' : 'none',
							'border-color': this.fileColors[this.fileextension],
							color: this.fileColors[this.fileextension],
							'font-size': this.fileextension.length > 3 ? '0.4375rem' : '0.5rem'
						}}
					>
						{this.fileextension}
					</span>
				</div>
			</Host>
		);
	}
}
