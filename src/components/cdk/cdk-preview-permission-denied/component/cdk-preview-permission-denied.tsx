import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { ILiterals } from '../models/cdk-preview-permission-denied.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-preview-permission-denied',
	styleUrl: 'cdk-preview-permission-denied.scss',
	shadow: false,
	scoped: true
})
export class CDKPreviewPermissionDenied {
	/** Literals for component */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}
	@State() _literals: ILiterals;

	/** List of GLCS's for component */
	@Prop({ reflect: true }) listGlcs: Array<string> | string;
	@Watch('listGlcs') parseListGlcs(newValue: Array<string> | string) {
		this._listGlcs = _parseProp<Array<string>>(newValue as string);
	}
	@State() _listGlcs: Array<string>;

	@State() _maxElementsOnList: boolean = false;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseListGlcs(this.listGlcs);

		if (this._listGlcs.length > 4) {
			this._maxElementsOnList = true;
		}
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	render() {
		return (
			<Host>
				<div
					class="cdk-preview-permission-denied"
					style={{ '--container-bg-image-url': `url(${assetUrl('/assets/images/i-city-skyline.svg')})` }}
				>
					<h3 class="cdk-preview-permission-denied__title">
						<span class="u-icon icon-awarness cdk-preview-permission-denied__icon"></span>
						{this._literals.title}
					</h3>
					<div class="cdk-preview-permission-denied__list-container">
						<div class="cdk-preview-permission-denied__container-bg">
							<h4 class="cdk-preview-permission-denied__list-title">{this._literals.listTitle}</h4>
							<ul class="cdk-preview-permission-denied__list">
								{this._listGlcs.slice(0, this._maxElementsOnList ? 3 : 4).map((glcsName) => (
									<li class="cdk-preview-permission-denied__list-element">{glcsName}</li>
								))}
								{this._maxElementsOnList && (
									<li class="cdk-preview-permission-denied__list-element cdk-preview-permission-denied__list-element--more">...</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
