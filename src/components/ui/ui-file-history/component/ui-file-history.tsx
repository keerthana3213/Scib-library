import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IUIFileHistoryLiterals, IUIFileHistoryData } from '../models/ui-file-history.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-file-history',
	styleUrl: 'ui-file-history.scss',
	shadow: false,
	scoped: true,
})
export class UIFileHistory {
	/** Literales */
	@Prop({ mutable: true, reflect: false }) literals?: IUIFileHistoryLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: IUIFileHistoryLiterals | string) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: IUIFileHistoryLiterals;

	/** Datos */
	@Prop({ mutable: true, reflect: true }) data: IUIFileHistoryData | string;
	@Watch('data') parseData(newData: IUIFileHistoryData | string) {
		this._data = _parseProp(newData);
	}
	@State() _data: IUIFileHistoryData;

	/** Evento de accion de usuario */
	@Event() userAction: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseData(this.data);
		this.parseLiterals(this.literals);
	}

	render() {
		return (
			<Host>
				<section class="ui-history">
					{(!!!this._data.dataLabelList || this._data.dataLabelList.length === 0) && this._literals.title && <span class="ui-history__label">{this._literals.title}</span>}
					<div class="ui-history__box">
						{!!!this._data.dataLabelList || this._data.dataLabelList.length === 0 ? (
							<div class="ui-history__file">
								<div class="ui-history__extension">
									<scib-ui-extension-icon fileextension={this._data.fileExtension}></scib-ui-extension-icon>
								</div>
								<div class="ui-history__group">
									<p class={`ui-history__name ${this._data.highlightedName && 'ui-history--highlighted-name'}`}>{this._data.fileName}</p>
									<p class="ui-history__meta">
										{this._data.attributeList.map((attribute, index) => (
											<span>
												{index !== 0 && ' - '}
												{attribute}
											</span>
										))}
									</p>
								</div>
							</div>
						) : (
							<div class="ui-history__file ui-history__file--datalabels">
								{this._data.dataLabelList?.map(label => (
									<div class="ui-history__data-label">
										<label class="ui-history__data-title">{label.title}</label>
										<p class={`ui-history__name ${this._data.highlightedName && 'ui-history--highlighted-name'}`}>{label.description}</p>
									</div>
								))}
							</div>
						)}
						{this._data.buttonList && this._data.buttonList.length > 0 && (
							<div class="ui-history__actions">
								{this._data.buttonList.map((button, index) => (
									<div
										class={{
											'ui-history--separator': button.separator,
										}}
									>
										<scib-ui-button
											icon={button.iconName}
											hideTxt={button.hideTxt}
											link
											class="ui-table-button"
											type="button"
											icon-left
											small
											disableMinWidth
											disabled={button.disabled}
											nobackground
											onEventClick={ev => {
												ev.stopPropagation();
												this.userAction.emit({
													type: button.eventName,
													payload: this._data.id,
												});
											}}
										>
											{this._literals.buttonLabelList[index]}
										</scib-ui-button>
									</div>
								))}
							</div>
						)}
					</div>
				</section>
			</Host>
		);
	}
}
