import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKShowcaseWizardCard } from '../models/cdk-showcase.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-showcase',
	styleUrl: 'cdk-showcase.scss',
	shadow: false,
	scoped: false,
})
export class CDKShowcase {
	/** Título de la vista */
	@Prop() mainTitle: string;

	/** Cards */
	@Prop() contentCards: string | ICDKShowcaseWizardCard[];

	/** Parseo de las tarjetas */
	@Watch('contentCards') contentCardsChange(newVal: ICDKShowcaseWizardCard[] | string) {
		this._contentCards = _parseProp(newVal);
	}

	@State() _contentCards: ICDKShowcaseWizardCard[];

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.contentCardsChange(this.contentCards);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<section class="cdk-showcase">
				<div class="cdk-showcase__titles" innerHTML={this.mainTitle}></div>
				<div class="cdk-showcase__content-overflow">
					<div class="cdk-showcase__content">
						{this._contentCards.map(card => (
							<article class="cdk-showcase__article">
								<figure class="cdk-showcase__figure">
									<img class="cdk-showcase__img" src={card.imgSrc} alt={card.imgAlt} />
								</figure>
								<p class="cdk-showcase__txt" innerHTML={card.text}></p>
							</article>
						))}
					</div>
				</div>
			</section>
		);
	}
}
