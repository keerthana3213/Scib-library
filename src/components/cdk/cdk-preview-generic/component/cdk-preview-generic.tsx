import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals } from '../models/cdk-preview-generic.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-preview-generic',
	styleUrl: 'cdk-preview-generic.scss',
	shadow: false,
	scoped: true,
})
export class CDKPreviewGeneric {
	/** Image url to show on preview */
	@Prop() image: string;

	/** Set up the preview to show inverted disposition from "text/image" (default) to "image/text" */
	@Prop() inverted: boolean;

	/** Literals for preview */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	render() {
		return (
			<Host>
				<article class={{ 'cdk-preview-generic': true, 'cdk-preview-generic--inverted': this.inverted }}>
					<div class="cdk-preview-generic__information">
						<p class="cdk-preview-generic__title">{this._literals?.title}</p>
						<p class="cdk-preview-generic__description">{this._literals?.description}</p>
					</div>
					<figure class="cdk-preview-generic__image">
						<img src={this.image} alt="Generic image" />
					</figure>
				</article>
			</Host>
		);
	}
}
