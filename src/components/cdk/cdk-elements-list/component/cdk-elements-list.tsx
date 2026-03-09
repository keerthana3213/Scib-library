import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKElementsListData } from '../models/cdk-elements-list.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-elements-list',
	styleUrl: 'cdk-elements-list.scss',
	shadow: false,
	scoped: true,
})
export class CDKElementsList {
	/**Actions */
	@Prop({ reflect: true }) data: string | ICDKElementsListData[];
	@Watch('data') dataChange(newVal: string | ICDKElementsListData[]) {
		this._data = _parseProp(newVal);
	}

	@State() _data: ICDKElementsListData[];

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.dataChange(this.data);
	}

	/** Delete element event */
	@Event() elementClickEvent: EventEmitter;

	/**
	 * Open modal add element to pitch
	 * @param e Event
	 * @param id
	 */
	eventClick(id, type) {
		this.elementClickEvent.emit({ id: id, type: type });
	}

	render() {
		return (
			<Host>
				{this._data &&
					this._data.map(element => (
						<div class="cdk-elements-list">
							<div role="img" class="cdk-elements-list__cell">
								{element.type == 'Tombstones' ? <span class="u-icon icon-doc-eur" /> : <scib-ui-extension-icon fileextension={element.extension}></scib-ui-extension-icon>}
							</div>
							<span class="cdk-elements-list__cell">
								{element.title}
								{element.quantity ? ' (' + element.quantity + ')' : null}
							</span>

							{this._data && (
								<div class="cdk-elements-list__cell--btn">
									{element.acciones &&
										element.acciones.map(item =>
											item.text == 'Delete' ? (
												<scib-ui-button
													icon={item.icon}
													onClick={() => this.eventClick(element.id, 'deleteItem')}
													class="cdk-elements-list__cell--action"
													hideTxt
													small
													link
												></scib-ui-button>
											) : (
												<scib-ui-button
													icon={item.icon}
													onClick={() => this.eventClick(element.id, 'editItem')}
													class="cdk-elements-list__cell--action"
													hideTxt
													small
													link
												></scib-ui-button>
											),
										)}
								</div>
							)}

							<div class="cdk-elements-list__cell">
								<span aria-label="hidden" class="c-bubble-draghandler u-icon icon-drag-hander"></span>
							</div>
						</div>
					))}
			</Host>
		);
	}
}
