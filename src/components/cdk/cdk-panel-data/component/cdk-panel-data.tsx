import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKPanelData, ICDKRequestLabel } from '../models/cdk-panel-data.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 * @slot iconBtns - IconBtns slot content
 */
@Component({
	tag: 'scib-cdk-panel-data',
	styleUrl: 'cdk-panel-data.scss',
	shadow: false,
	scoped: false,
})
export class CDKPanelData {
	/** Datos de la petición */
	@Prop({ reflect: false }) data: ICDKPanelData | string;

	/** Indica si el usuario que visualiza la petición es empleado */
	@Prop({ reflect: false }) employee: boolean;

	/** Indica el estado de la petición */
	@Prop({ reflect: false }) status: string;

	/** Labels de los datos de la petición */
	@Prop({ reflect: false }) requestLabels: string;

	/** Message indicator */
	@Prop({ reflect: false }) haveMessage: boolean;

	@Watch('data') dataChange(newVal: ICDKPanelData | string) {
		this._data = _parseProp(newVal);
	}
	@State() _data: ICDKPanelData;

	@Watch('requestLabels') requestLabelsChange(newVal: string | ICDKRequestLabel) {
		this._requestLabels = _parseProp(newVal);
	}
	@State() _requestLabels: ICDKRequestLabel;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.dataChange(this.data);
		this.requestLabelsChange(this.requestLabels);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	render() {
		return (
			<Host>
				<div class={{ 'cdk-panel-data': true, '--employee': this.employee }}>
					<div class="cdk-table-data">
						<span class="cdk-label">{this._requestLabels.status}</span>
						<span class="cdk-text">{this._data.status}</span>
					</div>
					{this.employee ? (
						<div class="cdk-table-data">
							<span class="cdk-label">{this._requestLabels.client}</span>
							<span class="cdk-text">{this._data.client}</span>
						</div>
					) : (
						''
					)}
					<div class="cdk-table-data">
						<span class="cdk-label">{this._requestLabels.id}</span>
						<span class="cdk-text">{this._data.id}</span>
					</div>
					<div class="cdk-table-data">
						<span class="cdk-label">{this._requestLabels.creationDate}</span>
						<span class="cdk-text">{this._data.creationDate}</span>
					</div>
					<div class="cdk-btns-container">{this.status !== 'done' && this.status !== 'canceled' && this.status !== 'in progress' && <slot name="textBtns" />}</div>
					<div class={{ 'cdk-icons-container': true, 'cdk-icons-container--message': this.haveMessage }}>
						<slot name="iconBtns" />
					</div>
				</div>
			</Host>
		);
	}
}
