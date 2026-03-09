import { Component, h, Prop } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-content',
	styleUrl: 'cdk-content.scss',
	shadow: false,
	scoped: false,
})
export class CDKContent {
	/** Título de la vista */
	@Prop() mainTitle: string;

	/** Texto de la vista (htmlString) */
	@Prop() text: string;

	/** Ruta de la imagen */
	@Prop() imgSrc: string;

	/** Texto alternativo de la imagen */
	@Prop() imgAlt: string;

	render() {
		return (
			<section class="cdk-content">
				<div class="cdk-content__titles" innerHTML={this.mainTitle}></div>
				<div class="cdk-content__group">
					<figure class="cdk-content__figure">
						<img class="cdk-content__img" src={this.imgSrc} alt={this.imgAlt} />
					</figure>
					<p class="cdk-content__txt" innerHTML={this.text}></p>
				</div>
			</section>
		);
	}
}
