import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IUILoadingLiterals } from '../models/ui-loading.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-loading',
	styleUrl: 'ui-loading.scss',
	shadow: false,
	scoped: true,
})
export class UILoading {
	@Prop() button: boolean;

	@Prop() literals: IUILoadingLiterals | string;
	@Watch('literals') literalsChange(newVal: IUILoadingLiterals | string) {
		this._literals = _parseProp(newVal);
	}
	@State() _literals: IUILoadingLiterals;

	@Prop() show: boolean = true;
	@Watch('show') showChange(newVal: boolean) {
		this._show = newVal;
	}
	@State() _show: boolean;

	@Prop() animation: boolean;
	@Watch('animation') animationChange(newVal: boolean) {
		this._animation = newVal;
	}
	@State() _animation: boolean;

	@Prop() bottom: boolean;

	@Prop() secondary: boolean;
	@Watch('secondary') secondaryChange(newVal: boolean) {
		this._secondary = newVal;
	}
	@State() _secondary: boolean;

	@Event() userAction: EventEmitter;

	componentWillLoad() {
		this.showChange(this.show);
		this.animationChange(this.animation);
		this.secondaryChange(this.secondary);
		this.literalsChange(this.literals);
	}

	render() {
		return (
			this._show && (
				<Host>
					{this.button ? (
						<div
							class={{
								'c-btnloading': true,
								'c-btnloading__bottom': this.bottom,
							}}
						>
							<scib-ui-button
								icon-left
								secondary={this._secondary}
								small
								onEventClick={event => {
									this.userAction.emit({
										type: 'loadMore',
									});
									event.stopPropagation();
								}}
								loading={this._animation}
								icon="icon-retry"
								disabled={this._animation}
							>
								{this._literals.buttonText}
							</scib-ui-button>
						</div>
					) : (
						<div class="c-loading">
							<svg class="c-loading__circular">
								<circle
									class={{
										'c-loading__path': true,
										'--secondary': this._secondary,
									}}
									fill="none"
									r="20"
									cx="50"
									cy="50"
									stroke-width="4"
									stroke-miterlimit="10"
								/>
							</svg>
						</div>
					)}
				</Host>
			)
		);
	}
}
