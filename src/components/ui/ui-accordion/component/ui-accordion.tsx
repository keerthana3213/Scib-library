import { Component, Host, h, Prop, Watch, State, EventEmitter, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals, HeaderIcon } from '../models/ui-accordion.model';
import { Colors } from '../../../../utils/helpers/styling-settings';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-accordion',
	styleUrl: 'ui-accordion.scss',
	shadow: false,
	scoped: true,
})
export class UIAccordion {
	/** Opens the accordion showing its content */
	@Prop({ mutable: true, reflect: true }) open: boolean;

	/** Show error message */
	@Prop({ mutable: true, reflect: true }) showError: boolean;

	/** Title text */
	@Prop({ mutable: true, reflect: true }) titleText: string;

	/** Show the information label */
	@Prop({ mutable: true, reflect: true }) showInfoLabel: boolean;

	/** Summary text */
	@Prop({ mutable: true, reflect: true }) summary: string;

	/** Icon displayed at the end of the header */
	@Prop({ reflect: true }) headerIcon: HeaderIcon | string;
	@Watch('headerIcon') headerIconChange(newVal: HeaderIcon | string) {
		this._headerIcon = _parseProp(newVal);
	}
	@State() _headerIcon: HeaderIcon;

	/** Text displayed after the icon */
	@Prop({ mutable: true, reflect: true }) headerText: string;

	/** Add transparent  background to content  when accordeon is open */
	@Prop({ mutable: true, reflect: true }) transparentBg: boolean;

	/** Change font size title */
	@Prop({ mutable: true, reflect: true }) large: boolean;

	/** Show the number of elements that contains */
	@Prop({ mutable: true, reflect: true }) quantity: boolean;

	/** Literals */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.headerIconChange(this.headerIcon);
	}

	_handleClick() {
		this.open = !this.open;
		this.eventAccordionChange.emit();
	}

	@Event() eventAccordionChange: EventEmitter;
	render() {
		return (
			<Host style={{ backgroundColor: this.transparentBg ? 'transparent' : 'var(--_ui-accordion-bg-color)' }}>
				<section class="ui-accordion">
					<div class="ui-accordion__header">
						<h3 class={{ 'ui-accordion__header--large': this.large }}>
							{`${this.titleText}`}
							{this.showInfoLabel && this.quantity ? (
								<strong class="ui-accordion__header--quantity">{this._literals.textInfoLabel}</strong>
							) : (
								this.showInfoLabel && <strong class="ui-accordion__header--new">{this._literals.textInfoLabel}</strong>
							)}
						</h3>
						<scib-ui-button
							icon="icon-chevron-down"
							disable-min-width
							hide-txt
							nobackground
							onClick={() => {
								this._handleClick();
							}}
							class={{
								'ui-accordion__btn': true,
								'ui-accordion__btn--open': this.open,
							}}
						></scib-ui-button>
						{this._headerIcon?.active &&
							(this._headerIcon.color ? (
								<span
									class={{
										'ui-accordion__header--icon': true,
										'u-icon': true,
										[this._headerIcon.icon]: true,
									}}
									style={{
										color: Colors[this._headerIcon.color.split('.')[0]][this._headerIcon.color.split('.')[1]],
									}}
								></span>
							) : (
								<span
									class={{
										'ui-accordion__header--icon': true,
										'u-icon': true,
										[this._headerIcon.icon]: true,
									}}
								></span>
							))}
						{this.headerText && <span class="ui-accordion__header--icontext">{this.headerText}</span>}
					</div>
					{!this.open && !!this.summary && <span class="ui-accordion__content">{this.summary}</span>}
					{!this.open && this.showError && <span class="ui-accordion__content ui-accordion__content--error">{this._literals.errorText}</span>}
					<div class={{ 'ui-accordion__content': true, 'ui-accordion__content--hidden': !this.open }}>
						<slot />
					</div>
				</section>
			</Host>
		);
	}
}
