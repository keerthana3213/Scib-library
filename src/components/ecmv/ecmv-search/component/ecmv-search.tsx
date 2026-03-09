import { Component, h, Prop, EventEmitter, State, Event, Listen } from '@stencil/core';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ecmv-search',
	styleUrl: 'ecmv-search.scss',
	shadow: false,
	scoped: false,
})
export class ECMVSearch {
	@Prop() label: string = '';
	@Prop() button_text: string = '';
	@Prop() placeholder: string = '';
	@Prop() defaultValue: string = '';
	@Prop({ reflect: false }) debouncetime: number = 1000;
	@Prop() pattern: string = '';
	@Event() navigatorEvents: EventEmitter;
	@Event() closeEvent: EventEmitter;
	@State() showMagnifying = true;

	_debouncer: any;

	handleInput(event: any) {
		this.showMagnifying = event.target.value === '';
		if (this._debouncer) {
			clearTimeout(this._debouncer);
		}
		this._debouncer = setTimeout(() => {
			this.defaultValue = event.target.value;
			this.navigatorEvents.emit(event.target.value);
		}, this.debouncetime);
	}

	getCurrentInput(event: any) {
		this.showMagnifying = event.target.value === '';
		this.defaultValue = event.target.value;
	}

	handleInputSend() {
		this.navigatorEvents.emit(this.defaultValue);
	}

	removeData(event: any) {
		this.defaultValue = '';
		this.showMagnifying = true;
		this.closeEvent.emit(event);
	}

	@Listen('keypress') handleKeyDown(ev) {
		if (this.pattern && this.pattern !== '') {
			let regex = new RegExp(this.pattern);
			let key: string = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
			const keyCode = ev.charCode ? ev.which : ev.charCode;
			if (!regex.test(key)) {
				ev.preventDefault();
				return false;
			}

			if (ev.key === 'Enter' || keyCode === 13) {
				this.handleInputSend();
			}
		}
	}

	render() {
		return (
			<section class="ecmv-search">
				<h2 class="ecmv-search__title">{this.label}</h2>
				<div class="ecmv-search__box">
					<input
						class="ecmv-search__input"
						type="text"
						name="search"
						value={this.defaultValue}
						placeholder={this.placeholder}
						onInput={event => this.getCurrentInput(event)}
					></input>
					{this.defaultValue ? (
						<i class="c-tab-icon u-icon icon-close iconitem-glass" onClick={() => this.removeData(event)}></i>
					) : null}
				</div>
				<div class="ecmv-search__button">
					<scib-ui-button
						type="button"
						primary
						ultrasmall
						disabled={!this.defaultValue || this.defaultValue?.length < 3 ? true : false}
						data-cy="ecm-search-buttonSearch"
						onClick={() => this.handleInputSend()}
					>
						{this.button_text}
					</scib-ui-button>
				</div>
			</section>
		);
	}
}
