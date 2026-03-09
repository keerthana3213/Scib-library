import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { IListGlcs, ILiterals } from '../models/cdk-app-permission-denied.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-app-permission-denied',
	styleUrl: 'cdk-app-permission-denied.scss',
	shadow: false,
	scoped: false
})
export class CDKAppPermissionDenied {
	/** Literals for component */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	/** List of GLCS's for component */
	@Prop({ reflect: true }) listGlcs: Array<IListGlcs> | string;
	@Watch('listGlcs') parseListGlcs(newValue: Array<IListGlcs> | string) {
		this._listGlcs = _parseProp<Array<IListGlcs>>(newValue as string);
	}
	@State() _listGlcs: Array<IListGlcs>;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseListGlcs(this.listGlcs);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChangeGlcs: EventEmitter;

	render() {
		return (
			<article class="cdk-app-permission-denied">
				<figure class="cdk-app-permission-denied__figure">
					<img src={assetUrl('/assets/images/i-city-skyline.svg')} alt="City Skyline" />
				</figure>
				<div class="cdk-app-permission-denied__content">
					<h2 class="cdk-app-permission-denied__title">{this._literals.title}</h2>
					<p class="cdk-app-permission-denied__description">{this._literals.description}</p>
					<div class="cdk-app-permission-denied__list-container">
						<h3 class="cdk-app-permission-denied__list-title">{this._literals.titleList}</h3>
						<ul class="cdk-app-permission-denied__list">
							{this._listGlcs.map((glcs) => (
								<li class="cdk-app-permission-denied__list-element">
									<span class="cdk-app-permission-denied__list-element-txt">{glcs.name}</span>
									<scib-ui-button link disable-min-width onEventClick={() => this.eventChangeGlcs.emit(glcs.id)}>
										{this._literals.btnText}
									</scib-ui-button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</article>
		);
	}
}
