import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { IUIBreadcrumb } from '../models/ui-breadcrumb.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-breadcrumb',
	styleUrl: 'ui-breadcrumb.scss',
	shadow: false,
	scoped: true,
})
export class UIBreadcrumb {
	/** Opciones para los botones */
	@Prop({ mutable: true, reflect: true }) options: string | IUIBreadcrumb[];
	@Prop({ mutable: true, reflect: false }) regularFont: boolean;

	@Watch('options') parseoptions(newVal: string | IUIBreadcrumb[]) {
		this._options = _parseProp(newVal);
	}

	@State() _options: IUIBreadcrumb[];

	/** Event emitter to change view */
	@Event() eventClick: EventEmitter;

	componentWillLoad() {
		this.parseoptions(this.options);
	}

	render() {
		return (
			<Host>
				<div class="ui-breadcrumb">
					{this._options &&
						this._options.map((opc, i) =>
							this._options.length - 1 == i ? (
								<div>
									<span class="ui-breadcrumb__actual">{opc.label}</span>{' '}
								</div>
							) : (
								<div onClick={() => this.eventClick.emit(opc)} class={`ui-breadcrumb__link ${this.regularFont ? 'ui-breadcrumb__link--regular-text' : ''}`}>
									{opc.label}
									{this._options.length - 2 != i ? <span class="ui-breadcrumb__slash ">/</span> : <span class="ui-breadcrumb__slash-grey">/</span>}
								</div>
							),
						)}
				</div>
			</Host>
		);
	}
}
