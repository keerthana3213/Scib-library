import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { IUIOperationData } from '../models/ui-toast.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-toast',
	styleUrl: 'ui-toast.scss',
	shadow: false,
	scoped: true
})
export class UIToast {
	backgroundColor: string;
	color: string;
	image: string;

	/** Estado y mensaje de la operación */
	@Prop({ mutable: true, reflect: true }) data: string | IUIOperationData;

	@Watch('data') dataChange(newVal: string | IUIOperationData) {
		if (typeof newVal === 'string') {
			try {
				this._data = JSON.parse(newVal || '');
			} catch (e) {
				console.error(e);
			}
		} else {
			this._data = newVal;
		}
	}

	@State() _data: IUIOperationData;

	@Event() closeToast: EventEmitter;

	componentWillLoad() {
		this.dataChange(this.data);
		setTimeout(
			() => {
				this.deleteToast();
			},
			this._data.time ? this._data.time : 1200
		);
	}

	deleteToast() {
		this.closeToast.emit();
		let toast = document.getElementById('toast');
		if (toast) {
			toast.style.animation = '1.2s linear animation';
			toast.style.opacity = '0';
		}
	}

	render() {
		return (
			<Host>
				<div
					id="toast"
					class={{
						'ui-toast': true,
						'--success': this._data.state === 'success',
						'--warning': this._data.state === 'warning',
						'--error': this._data.state === 'error',
						'--info': this._data.state === 'info'
					}}
				>
					<span role="img" class={{ 'u-icon ui-toast__icon': true, ['icon-circle-'.concat(this._data.state)]: true }}></span>
					<div class="ui-toast__text">
						{!!this._data?.message && <p>{this._data?.message}</p>}
						{this._data?.messageExtraLines &&
							this._data?.messageExtraLines.length > 0 &&
							this._data.messageExtraLines.map((message) => <p>{message}</p>)}
					</div>
					<button class="u-icon icon-close" title="Close toast" onClick={() => this.deleteToast()}></button>
				</div>
			</Host>
		);
	}
}
