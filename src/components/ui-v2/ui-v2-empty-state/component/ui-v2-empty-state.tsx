import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Component, Host, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { ButtonIcon, ButtonLevel, ButtonObject } from '../models/ui-v2-empty-state.model';
import { get } from 'lodash';

@Component({
	tag: 'scib-ui-v2-empty-state',
	styleUrl: 'ui-v2-empty-state.scss',
	shadow: true
})
export class UI_V2EmptyState {
	/**
	 *
	 */
	@Prop({ reflect: true }) size: 'xl' | 'md' | 'xs';

	/**
	 *
	 */
	@Prop() image: string;
	@State() $image: string;
	@Watch('image') _imagesHandler(newValue: string) {
		this.$image = newValue;
	}

	/**
	 *
	 */
	@Prop() mainTitle: string;
	@State() $mainTitle: string;
	@Watch('mainTitle') _mainTitleHandler(newValue: string) {
		this.$mainTitle = newValue;
	}

	/**
	 *
	 */
	@Prop() description: string;
	@State() $description: string;
	@Watch('description') _descriptionHandler(newValue: string) {
		this.$description = newValue;
	}

	/**
	 * Propiedad para indicar la posicion de la imagen
	 */
	@Prop() right: boolean;
	@State() $right: boolean;
	@Watch('right') _rightHandler(newValue: boolean) {
		this.$right = !!newValue;
	}

	/**
	 * Text when its only one button
	 */
	@Prop({ mutable: true }) button: string;
	@State() $button: string;
	@Watch('button') _buttonHandler(newValue: string) {
		this.$button = newValue;
	}
	/**
	 * Type when its only one button, by default is primary
	 */
	@Prop() buttonType: ButtonLevel = 'primary';
	@State() $buttonType: ButtonLevel = 'primary';
	@Watch('buttonType') _buttonTypeHandler(newValue: ButtonLevel) {
		this.$buttonType = newValue;
	}

	/**
	 * Add an icon when its only one button
	 */
	@Prop({ mutable: true }) buttonIcon: string | ButtonIcon;
	@State() $buttonIcon: ButtonIcon;
	@Watch('buttonIcon') _buttonIconHandler(newValue: string | ButtonIcon) {
		this.$buttonIcon = _parseProp<ButtonIcon>(newValue, {});
	}
	/**
	 * This is an array where you can add up to 3 buttons for the empty state.
	 */
	@Prop() arrayButtons: string | ButtonObject[];
	@State() $arrayButtons: ButtonObject[];
	@Watch('arrayButtons') _arrayButtonsHandler(newValue: string | ButtonObject[]) {
		this.$arrayButtons = _parseProp<ButtonObject[]>(newValue, []);
	}

	@Event() eventButtonClicked: EventEmitter<string>;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._imagesHandler(this.image);
		this._mainTitleHandler(this.mainTitle);
		this._descriptionHandler(this.description);
		this._rightHandler(this.right);
		this._buttonHandler(this.button);
		this._buttonIconHandler(this.buttonIcon);
		this._arrayButtonsHandler(this.arrayButtons);
	}

	/** Maneja el click al pulsar el boton */
	handleClick(event?: string) {
		this.eventButtonClicked.emit(event);
	}
	getButtons() {
		let htmlButtons = [];
		for (let index = 0; index < (this.$arrayButtons.length > 3 ? 3 : this.$arrayButtons.length); index++) {
			htmlButtons.push(
				<scib-atoms-button
					text={this.$arrayButtons[index]?.text}
					size={this.size === 'xl' ? 'm' : 's'}
					iconPosition={get(this.$arrayButtons[index]?.iconOptions, 'position', 'leading')}
					icon={get(this.$arrayButtons[index]?.iconOptions, 'icon', '')}
					onClick={() => this.handleClick(this.$arrayButtons[index]?.event)}
					level={this.$arrayButtons[index]?.level}
				></scib-atoms-button>
			);
		}
		return htmlButtons;
	}

	render() {
		return (
			<Host>
				<div
					class={{
						emptye: true,
						'emptye--reverse': !this.$right
					}}
				>
					<div class="emptye__container">
						{(this.$mainTitle || this.$description || this.$button) && (
							<div class="emptye__title">
								{this.$mainTitle}
								<div class="emptye__desc">{this.$description}</div>
								<div class="emptye__button-area">
									{this.$button && this.$arrayButtons.length === 0 ? (
										<div class="emptye__button-area__button">
											<scib-atoms-button
												text={this.$button}
												size={this.size === 'xl' ? 'm' : 's'}
												iconPosition={get(this.$buttonIcon, 'position', 'leading')}
												icon={get(this.$buttonIcon, 'icon', '')}
												onClick={() => this.handleClick()}
												level={this.$buttonType}
											></scib-atoms-button>
										</div>
									) : (
										this.getButtons()
									)}
								</div>
							</div>
						)}

						<div class="emptye__content">
							<slot name="content" />
						</div>
					</div>
					<figure class="emptye__figure">
						<img class="emptye__img" src={this.$image} alt="" />
					</figure>
				</div>
			</Host>
		);
	}
}
