import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKTopicEmptyStateLiterals } from '../models/cdk-topic-empty-state.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-topic-empty-state',
	styleUrl: 'cdk-topic-empty-state.scss',
	shadow: false,
	scoped: true
})
export class CDKTopicEmptyState {
	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKTopicEmptyStateLiterals;
	@Watch('literals') parseLiterals(newLiterals: string | ICDKTopicEmptyStateLiterals) {
		this._literals = _parseProp(newLiterals);
	}

	@State() _literals: ICDKTopicEmptyStateLiterals;

	/** Si el botón se muestra o no */
	@Prop({ mutable: true, reflect: true }) showButton: boolean = false;

	/** Si el botón se muestra o no */
	@Prop({ mutable: true, reflect: true }) disableButton: boolean = false;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
	}

	_handleNewTopic() {
		this.eventEmptyNewTopic.emit();
	}

	/** Descripción del evento */
	@Event() eventEmptyNewTopic: EventEmitter;

	render() {
		return (
			<Host>
				<section class="cdk-topic-empty-state">
					<div class="cdk-topic-empty-state__container">
						<div class="cdk-topic-empty-state__image">
							<figure class="cdk-topic-empty-state__figure">
								<img class="cdk-topic-empty-state__img" src={this._literals.imgSrc} alt="" />
							</figure>
						</div>
						<div class="cdk-topic-empty-state__content">
							<h2 class="cdk-topic-empty-state__title">{this._literals.title}</h2>
							<p class="cdk-topic-empty-state__description">{this._literals.description}</p>
							{this.showButton ? (
								<scib-ui-button
									primary
									disabled={this.disableButton}
									class="cdk-topic-empty-state__button"
									onEventClick={() => this._handleNewTopic()}
								>
									{this._literals.btnText}
								</scib-ui-button>
							) : null}
						</div>
					</div>
				</section>
			</Host>
		);
	}
}
