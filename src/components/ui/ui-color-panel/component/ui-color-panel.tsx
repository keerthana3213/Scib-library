import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { isBoolean } from 'lodash';

/**
 * Component description
 *
 * @slot dataContent - Parent content slot
 * @slot child - Child content slot
 */
@Component({
	tag: 'scib-ui-color-panel',
	styleUrl: 'ui-color-panel.scss',
	shadow: false,
	scoped: false
})
export class UIColorPanel {
	$childContainer: HTMLElement;
	$expandedContainer: HTMLElement;
	_accordionHeight: string;

	/**
	 * Request status
	 * @type {('pending'|'requested'|'progress'|'done'|'canceled')}
	 */
	@Prop() status: string;

	/** Add a title for the case of the cards */
	@Prop() topLabel: string;

	/** Indicates if the request is blocked */
	@Prop({ reflect: false }) locked: boolean;

	/** Indicates if the request has sub-requests */
	@Prop({ reflect: true }) haveChilds: boolean = false;

	/** Indicates if the panel will have a shadow when hovering over it */
	@Prop({ reflect: true }) hoverEffect: boolean = false;

	/** Indicates if legend type is filter or readonly */
	@Prop({ reflect: false, mutable: true }) isFilter: boolean;

	/* id Request to toggle  */
	@Prop({ reflect: true }) idRequest: string;

	@Prop({ reflect: false, mutable: true }) isActive: boolean;

	/** Estado previo del botón antes de refrescar */
	@Prop({ reflect: true, mutable: true }) isPrevActive: boolean;

	/** Setea los estados previos al refresco de la página */
	_setPreviousFilter() {
		if (this.isFilter && isBoolean(this.isPrevActive)) {
			let element = document.querySelector('#button' + this._status);
			if (this.isPrevActive) {
				element.classList.add('ui-color-panel--active');
				element.classList.remove('ui-color-panel--notactive');
			} else {
				element.classList.remove('ui-color-panel--active');
				element.classList.add('ui-color-panel--notactive');
			}
		}
	}

	@Watch('status') statusChange(newVal: string) {
		if (!newVal) {
			return;
		}
		newVal = newVal.split(' ')[1] ? newVal.split(' ')[1] : newVal;
		this._status = '--' + newVal.toLowerCase();
	}

	@Listen('toggleChild', { target: 'window' })
	_handleOnSelect(e: any) {
		e.preventDefault();
		if (e.detail === this.idRequest) {
			this._expanded = !this._expanded;
			this._setAccordionHeight();
			return;
		}
		this._expanded = false;
		this._setAccordionHeight();
	}

	@State() _status: string;
	@State() _expanded: boolean = false;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		if (!!this.status) {
			this.statusChange(this.status.toLowerCase());
		}
	}

	/** Life cycle executed after the first render after loading */
	componentDidLoad() {
		if (this.$childContainer) this._setAccordionHeight();
		this._setPreviousFilter(); // FIRST TIME
	}

	/* Close child´s not selected*/
	@Event() toggleChild: EventEmitter;

	_toggleChilds() {
		this.toggleChild.emit(this.idRequest);
	}

	@Event() emitHeaderSelection: EventEmitter;
	@Listen('click', { capture: true })
	handleClickInSummarySelection(ev) {
		const eventClick = ev.currentTarget;
		if (eventClick.id === 'scib-ui-color-panel') {
			this.emitHeaderSelection.emit(ev.currentTarget.status);
			this._handleFilterLegend(ev);
		}
	}

	_handleFilterLegend(ev) {
		let buttonsList = document.querySelectorAll('#scib-ui-color-panel');

		if (ev.currentTarget.firstElementChild.classList.contains('ui-color-panel--active')) {
			buttonsList.forEach((element) => {
				element.firstElementChild.classList.remove('ui-color-panel--active');
				element.firstElementChild.classList.remove('ui-color-panel--notactive');
			});
		} else {
			buttonsList.forEach((element) => {
				element.firstElementChild.classList.add('ui-color-panel--notactive');
				element.firstElementChild.classList.remove('ui-color-panel--active');
			});
			ev.currentTarget.firstElementChild.classList.add('ui-color-panel--active');
			ev.currentTarget.firstElementChild.classList.remove('ui-color-panel--notactive');
		}
	}
	_setAccordionHeight() {
		this._accordionHeight = this._expanded ? (this.$childContainer?.clientHeight || 0) + 'px' : '0px';
		if (this.$expandedContainer && this.$expandedContainer.style) {
			this.$expandedContainer.style.height = this._accordionHeight;
		}
	}

	render() {
		return (
			<Host>
				{this.topLabel && (
					<div class="ui-color-panel-top-label" title={this.topLabel}>
						{this.topLabel}
					</div>
				)}
				{this.isFilter && (
					<button
						class={{
							'ui-color-panel': true,
							'ui-color-panel--btn': true,
							[this._status]: true,
							'--hover': this.hoverEffect,
							'--locked': this.locked
						}}
						type="button"
						id={['button'] + this._status}
						onClick={() => {
							event.stopPropagation();
						}}
					>
						<div class={{ 'ui-data-container': true, '--without-childs': !this.haveChilds }}>
							<slot name="dataContent" />
						</div>
					</button>
				)}
				{!this.isFilter && (
					<div
						class={{
							'ui-color-panel': true,
							[this._status]: true,
							'--hover': this.hoverEffect,
							'--locked': this.locked
						}}
						onClick={() => {
							if (this.haveChilds) this._toggleChilds();
							event.stopPropagation();
						}}
					>
						<div
							class={{
								'ui-data-container': true,
								'--without-childs': !this.haveChilds
							}}
						>
							<slot name="dataContent" />
						</div>
						{this.haveChilds && (
							<button
								onClick={() => {
									this._toggleChilds();
									event.stopPropagation();
								}}
								aria-label="expand"
								class={{
									'ui-expand-btn': true,
									'--expanded': this._expanded
								}}
							>
								<span class="u-icon icon-chrevron-right"></span>
							</button>
						)}
					</div>
				)}

				{this.haveChilds && (
					<div aria-hidden={!this._expanded} class="ui-childs-expand" ref={(el) => (this.$expandedContainer = el as HTMLElement)}>
						<div class="ui-color-panel-childs-container" ref={(el) => (this.$childContainer = el as HTMLElement)}>
							<slot name="child" />
						</div>
					</div>
				)}
			</Host>
		);
	}
}
