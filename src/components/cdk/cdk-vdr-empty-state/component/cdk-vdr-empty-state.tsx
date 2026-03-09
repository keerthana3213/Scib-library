import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKVdrEmptyStateLiterals } from '../models/cdk-vdr-empty-state.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-vdr-empty-state',
	styleUrl: 'cdk-vdr-empty-state.scss',
	shadow: false,
	scoped: true,
})
export class CDKVdrEmptyState {
	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKVdrEmptyStateLiterals;
	@Watch('literals') parseLiterals(newLiterals: string | ICDKVdrEmptyStateLiterals) {
		this._literals = _parseProp(newLiterals);
	}

	/** Si el botón se muestra o no */
	@Prop({ mutable: true, reflect: true }) showButton: boolean = false;

	@State() _literals: ICDKVdrEmptyStateLiterals;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
	}

	_handleNewVdr() {
		this.eventEmptyNewVdr.emit();
	}

	/** Descripción del evento */
	@Event() eventEmptyNewVdr: EventEmitter;

	render() {
		return (
			<Host>
				<section class="cdk-vdr-empty-state">
					<div class="cdk-vdr-empty-state__container">
						<div class="cdk-vdr-empty-state__content">
							<h2 class="cdk-vdr-empty-state__title">{this._literals.title}</h2>
							<p class="cdk-vdr-empty-state__description">{this._literals.description}</p>
							{this.showButton ? (
								<scib-ui-button primary class="cdk-vdr-empty-state__button" onEventClick={() => this._handleNewVdr()}>
									{this._literals.btnText}
								</scib-ui-button>
							) : null}
						</div>
						<div class="cdk-vdr-empty-state__image">
							<figure class="cdk-vdr-empty-state__figure">
								<img class="cdk-vdr-empty-state__img" src={this._literals.imgSrc} alt="" />
							</figure>
						</div>
					</div>
				</section>
			</Host>
		);
	}
}
