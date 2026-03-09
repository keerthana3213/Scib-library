import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKEmptyStateLiterals } from '../models/cdk-empty-state-one.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-empty-state-one',
	styleUrl: 'cdk-empty-state-one.scss',
	shadow: false,
	scoped: false,
})
export class CDKEmptyStateOne {
	/**Literales */
	@Prop({ reflect: true }) literals: ICDKEmptyStateLiterals | string;

	@Watch('literals') literalsChange(newVal: ICDKEmptyStateLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	@State() _literals: ICDKEmptyStateLiterals;

	/** Cards */
	@Prop() contentCards: string | ICDKEmptyStateLiterals[];

	/** Parseo de las tarjetas */
	@Watch('contentCards') contentCardsChange(newVal: ICDKEmptyStateLiterals[] | string) {
		this._contentCards = _parseProp(newVal);
	}

	@State() _contentCards: ICDKEmptyStateLiterals[];

	/** Evento cuando se clicka en el botón */
	@Event() eventGoStore: EventEmitter;

	_handleGoStore() {
		this.eventGoStore.emit();
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this.contentCardsChange(this.contentCards);
	}

	render() {
		return (
			<section class="cdk-empty-state-one__container">
				<section class="cdk-empty-state-one">
					<figure class="cdk-empty-state-one__figure">
						<img class="cdk-empty-state-one__img" src={this._literals?.imgLeftSrc} alt="" />
					</figure>
					<div class="cdk-empty-state-one__header">
						<h2 class="cdk-empty-state-one__title" innerHTML={this._literals?.mainTitle}></h2>
						<p class="cdk-empty-state-one__txt" innerHTML={this._literals?.text}></p>
						<footer class="cdk-empty-state-one__footer">
							<scib-ui-button primary icon="icon-apps" class="c-sendbar-footer-button --right" onEventClick={() => this._handleGoStore()}>
								{this._literals?.btn}
							</scib-ui-button>
						</footer>
					</div>
					<figure class="cdk-empty-state-one__figure">
						<img class="cdk-empty-state-one__img" src={this._literals?.imgRightSrc} alt="" />
					</figure>
				</section>
				<section class="cdk-empty-state-one__listcards">
					{this._contentCards?.map(card => (
						<article class="cdk-empty-state-one__card">
							<figure class="cdk-empty-state-one__figure">
								<img class="cdk-empty-state-one__img" src={card.imgSrc} alt="" />
							</figure>
							<div class="cdk-empty-state-one__group">
								<h3 class="cdk-empty-state-one__title" innerHTML={card.smallTitle}></h3>
								<p class="cdk-empty-state-one__desc" innerHTML={card.desc}></p>
							</div>
						</article>
					))}
				</section>
			</section>
		);
	}
}
