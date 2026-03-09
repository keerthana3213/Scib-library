import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { ILiterals } from '../models/ecmv-empty-state.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ecmv-empty-state',
	styleUrl: 'ecmv-empty-state.scss',
	shadow: false,
	scoped: true
})
export class ECMVEmptyState {
	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	@Prop({ reflect: true }) isEmptyMessage: boolean = false;
	@State() _isEmptyMessage: boolean;
	@Watch('isEmptyMessage') parseShowButton(isEmptyMessage: boolean) {
		this._isEmptyMessage = isEmptyMessage;
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseShowButton(this.isEmptyMessage);
	}

	render() {
		return (
			<Host>
				<section class="cdk-ecmv-empty-state">
					<div
						class={{
							'cdk-ecmv-empty-state__container': !this._isEmptyMessage,
							'cdk-ecmv-empty-state__message': this._isEmptyMessage
						}}
					>
						<div class="cdk-ecmv-empty-state__image">
							<figure class="cdk-ecmv-empty-state__figure">
								<img
									class="cdk-ecmv-empty-state__img"
									src={this._literals.imgSrc ? this._literals.imgSrc : assetUrl('/assets/images/i-laptop-coffee-alt.svg')}
									alt=""
								/>
							</figure>
						</div>
						<div class="cdk-ecmv-empty-state__content">
							<h2 class="cdk-ecmv-empty-state__title">{this._literals.title}</h2>
							<p class="cdk-ecmv-empty-state__description">{this._literals.description}</p>
						</div>
					</div>
				</section>
			</Host>
		);
	}
}
