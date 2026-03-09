import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKForsetiPreviewData, ICDKForsetiPreviewLiterals } from '../models/cdk-forseti-preview.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-forseti-preview',
	styleUrl: 'cdk-forseti-preview.scss',
	shadow: false,
	scoped: false
})
export class CDKForsetiPreview {
	@Prop() isLoading: boolean = false;

	@Prop() errorOnLoading: boolean = false;

	/** Oculta el contenido del slot */
	// @Prop({ reflect: true }) hide: boolean;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	// @Prop({mutable: true, reflect: true}) text: string;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */

	@Prop({ mutable: true, reflect: true }) literals: string | ICDKForsetiPreviewLiterals;
	@Watch('literals') parseLiterals(newLiterals: string | ICDKForsetiPreviewLiterals) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: ICDKForsetiPreviewLiterals;

	@Prop({ mutable: true, reflect: true }) data: string | ICDKForsetiPreviewData;
	@Watch('data') parseData(newData: string | ICDKForsetiPreviewData) {
		this._data = _parseProp(newData);
		if (!this._data) {
			this._data = {
				totalContracts: '',
				totalPending: '',
				ilustration: '',
				loadingImgSrc: ''
			};
		}
	}
	@State() _data: ICDKForsetiPreviewData;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	// componentDidLoad() {

	// }

	/** Ciclo de vida al eliminar la instancia del componente */
	// disconnectedCallback() {

	// }

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<Host>
				{this.errorOnLoading && !this.isLoading ? (
					<div class="cdk-forseti-preview__error">
						<span class="u-icon icon-hide-eye"></span>
						<span class="cdk-forseti-preview__error-title">{this._literals.errorTilte}</span>
						<span class="cdk-forseti-preview__error-desc">{this._literals.errorDesc}</span>
					</div>
				) : this.isLoading ? (
					<div class="cdk-forseti-preview__loading">
						<figure class="cdk-forseti-preview__loading-fig">
							<img class="cdk-forseti-preview__loading-img" src={this._data.loadingImgSrc} alt="Loading..." />
						</figure>
					</div>
				) : (
					<article class="cdk-forseti-preview">
						<span class="cdk-forseti-preview__txt">
							{this._data.totalContracts}
							<span class="cdk-forseti-preview__txt cdk-forseti-preview__txt--normal">{this._literals.contractsLeyend}</span>
						</span>
						<div class="cdk-forseti-preview__box">
							<figure class="cdk-forseti-preview__figure">
								<img class="cdk-forseti-preview__img" src={this._data.ilustration} alt="" />
							</figure>
							<div class="cdk-forseti-preview__group">
								<span class="cdk-forseti-preview__subtilte">{this._literals.subMessage}</span>
								<span class="cdk-forseti-preview__title">{this._literals.titleStatus}</span>
							</div>
							<div
								class={{
									'cdk-forseti-preview__counter': true,
									'cdk-forseti-preview__counter--light':
										Number(this._data.totalPending) > 9 && Number(this._data.totalPending) < 21,
									'cdk-forseti-preview__counter--dark': Number(this._data.totalPending) > 20
								}}
							>
								<span class="cdk-forseti-preview__number">{this._data.totalPending}</span>
							</div>
						</div>
					</article>
				)}
			</Host>
		);
	}
}
