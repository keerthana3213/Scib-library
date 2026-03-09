import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { IUIAsidePanelLiterals, IUIAsidePanelData } from '../models/ui-aside-panel.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-aside-panel',
	styleUrl: 'ui-aside-panel.scss',
	shadow: false,
	scoped: true
})
export class UIAsidePanel {
	/** Literales */
	@Prop({ reflect: false }) literals: IUIAsidePanelLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: IUIAsidePanelLiterals | string) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: IUIAsidePanelLiterals;

	/** Datos */
	@Prop({ reflect: false }) data: IUIAsidePanelData | string;
	@Watch('data') parseData(newData: IUIAsidePanelData | string) {
		this._data = _parseProp(newData);
	}
	@State() _data: IUIAsidePanelData;

	/** Muestra u oculta el componente */
	@Prop({ mutable: true, reflect: true }) active: boolean;

	/** Texto de la barra de navegación superior */
	@Prop({ mutable: true, reflect: true }) headerTitle: string;

	/** Imagen en la barra de navegación superior */
	@Prop({ reflect: true }) imageHeader: boolean = true;

	/** Descripción en caso de no mostrarse la imagen */
	@Prop({ reflect: true }) imageHeaderDescriptionText: string;

	/** Ruta de la imagen de la navegación superior */
	@Prop({ reflect: true }) imageHeaderSrc: string;

	/** Imagen en el body del componente */
	@Prop({ reflect: true }) imageAdditionalContentHeader: boolean;

	/** ruta de la imagen del titulo de Additional Content */
	@Prop({ reflect: true }) imageAdditionalContentSrc: string;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
	}

	_handleClose() {
		this.active = !this.active;
		this.eventAsidePanelChange.emit();
	}

	@Event() eventAsidePanelChange: EventEmitter;

	render() {
		return (
			<Host>
				<div class={{ 'ui-aside-panel': true, '--active': this.active }}>
					<div class="ui-aside-panel__header">
						<div class="aside-header__tittle-wrapper">
							{this.imageHeader && (
								<img
									alt={this.imageHeaderDescriptionText ? this.imageHeaderDescriptionText : null}
									src={this.imageHeaderSrc ? this.imageHeaderSrc : assetUrl('/assets/images/global_ico.svg')}
								/>
							)}
							<h2>
								<strong>{this._data.headerTitle}</strong>
							</h2>
						</div>
						<div class="aside-header__button-wrapper">
							<scib-ui-button onClick={() => this._handleClose()} nobackground hide-txt ultrasmall icon="icon-close"></scib-ui-button>
						</div>
					</div>
					<div class={{ 'ui-aside-panel__body': true }}>
						<div class="additional-content">
							<div
								style={{ 'background-image': this.imageAdditionalContentHeader ? `url(${this.imageAdditionalContentSrc})` : 'none' }}
								class={{ 'additional-content__header': true, 'additional-content--image': this.imageAdditionalContentHeader }}
							>
								<h1>
									<strong>{this._data.innerTitle}</strong>
								</h1>
							</div>
							<div class="additional-content__body">
								<slot></slot>
							</div>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
