import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals } from '../models/cdk-ism-contracts-card.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-ism-contracts-card',
	styleUrl: 'cdk-ism-contracts-card.scss',
	shadow: false,
	scoped: true,
})
export class CDKIsmContractsCard {
	/** Oculta el contenido del slot */
	@Prop({ reflect: true }) hide: boolean;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
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

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<Host>
				<div class="cdk-ism-contracts-card">
					<header class="cdk-ism-contracts-card__header">
						<div class="cdk-ism-contracts-card__header--title">
							{this._literals.icon && <span role="img" class={{ 'u-icon': true, [this._literals.icon]: true }}></span>}
							<h2>{this._literals.title}</h2>
						</div>
						<h3>{this._literals.module}</h3>
					</header>

					<div class="cdk-ism-contracts-card__content" style={{ marginBottom: this._literals.leyend ? '16px' : '0px' }}>
						{this._literals.content.title && <span class="cdk-ism-contracts-card__content--title">{this._literals.content.title}</span>}
						<p class="cdk-ism-contracts-card__content--description" style={{ margin: this._literals.content.subtitle ? '8px 0px 0px 16px' : '0px' }}>
							{this._literals.content.description}
						</p>
					</div>
					{this._literals.leyend ? (
						<div class="cdk-ism-contracts-card__leyend">
							<div class="cdk-ism-contracts-card__frequency">
								<span class={{ 'u-icon': true, [this._literals.leyend.icon]: true }}></span>
								<span>{this._literals.leyend.frequency}</span>
							</div>
							<div class="cdk-ism-contracts-card__measure">
								<span>{this._literals.leyend.title}</span>
								{this._literals.leyend.values.map(item => (
									<span class="cdk-ism-contracts-card__measure--values" style={{ backgroundColor: item.color }}>
										{item.value}
									</span>
								))}
							</div>
						</div>
					) : (
						''
					)}
				</div>
			</Host>
		);
	}
}
