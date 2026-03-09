import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKIborMobile } from '../models/cdk-ibor-mobile.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-ibor-mobile',
	styleUrl: 'cdk-ibor-mobile.scss',
	shadow: false,
	scoped: false,
})
export class CDKIborMobile {
	/** Link de la imagen */
	@Prop({ mutable: true, reflect: true }) imgSrc: string;

	/** Literales para el mensaje de error de no disponibilidad en movil */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKIborMobile;
	@Watch('literals') parseLiterals(newLiterals: string | ICDKIborMobile) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: ICDKIborMobile;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
	}

	render() {
		return (
			<Host>
				<div class="cdk-ibor-mobile">
					<figure class="cdk-ibor-mobile__figure">
						<img class="cdk-ibor-mobile__img" src={this.imgSrc} alt={this._literals.title} />
					</figure>
					<span class="cdk-ibor-mobile__title">{this._literals.title}</span>
					<span class="cdk-ibor-mobile__subtitle">{this._literals.subtitle}</span>
				</div>
			</Host>
		);
	}
}
