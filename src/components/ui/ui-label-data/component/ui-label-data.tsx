import { Component, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { copyToClipboard } from '../../../../utils/helpers/common';
import { Colors } from '../../../../utils/helpers/styling-settings';
import { DataIcon } from '../models/ui-label-data.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-label-data',
	styleUrl: 'ui-label-data.scss',
	shadow: false,
	scoped: false
})
export class UILabelData {
	/** Label text */
	@Prop() label: string;

	/** Data text */
	@Prop() text: string;
	@Watch('text') requiredChange(newVal: boolean | string) {
		this.eventFormChange.emit({
			name: this.label,
			value: newVal,
			required: this.required
		});
	}

	/** Margin bottom 24px instead of 8px */
	@Prop() marginHight: boolean;

	/** Displays copy button after the label */
	@Prop() copyButton: boolean;

	/** Required to work with the modal form as an input */
	@Prop() required?: boolean | string;

	/**This boolean, activates the class to reduce the lower space of the ui-label with respect to the separator line of the row*/
	@Prop() separator: boolean;

	/** Icon displayed before data text */
	@Prop({ reflect: true }) dataIcon: DataIcon | string;
	@Watch('dataIcon') dataIconChange(newVal: DataIcon | string) {
		this._dataIcon = _parseProp(newVal);
	}
	@State() _dataIcon: DataIcon;

	$buttonCopy!: HTMLElement;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventFormChange: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.dataIconChange(this.dataIcon);
		if (this.required) {
			this.eventFormChange.emit({
				name: this.label,
				value: this.text,
				required: this.required
			});
		}
	}

	render() {
		return (
			<div class={{ 'ui-labeldata': true, 'ui-labeldata--mb': this.marginHight, 'ui-labeldata--separator': this.separator }}>
				<div class="ui-labeldata__wrapper">
					<label class="ui-labeldata__label">{this.label}</label>
					{this.copyButton && (
						<scib-ui-button
							class="ui-labeldata__copy"
							link
							disableMinWidth
							labelSize
							disabled={!this.text}
							ref={(el) => (this.$buttonCopy = el as HTMLElement)}
							onClick={() => {
								let copied = copyToClipboard(this.text);
								if (copied) {
									let notcopy = this.$buttonCopy.querySelector('.icon-copy') as HTMLElement;
									let copy = this.$buttonCopy.querySelector('.icon-doc_ok') as HTMLElement;
									notcopy.style.display = 'none';
									copy.style.display = 'inline';
									setTimeout(function () {
										copy.style.display = 'none';
										notcopy.style.display = 'inline';
									}, 2000);
								}
							}}
						>
							{this.text ? (
								<span class="u-icon icon-copy ui-labeldata__copy--enabled"></span>
							) : (
								<span class="u-icon icon-copy ui-labeldata__copy--disabled"></span>
							)}
							<span class="u-icon icon-doc_ok"></span>
						</scib-ui-button>
					)}
				</div>
				<div class="ui-labeldata__wrapper">
					{this._dataIcon?.active &&
						(this._dataIcon.color ? (
							<span
								class={{
									'ui-labeldata__icon': true,
									'u-icon': true,
									[this._dataIcon.icon]: true
								}}
								style={{
									color: Colors[this._dataIcon.color.split('.')[0]][this._dataIcon.color.split('.')[1]]
								}}
							></span>
						) : (
							<span
								class={{
									'ui-labeldata__icon': true,
									'u-icon': true,
									[this._dataIcon.icon]: true
								}}
							></span>
						))}
					<span class="ui-labeldata__data">{this.text}</span>
				</div>
			</div>
		);
	}
}
