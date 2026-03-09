import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IUITapbarTap } from '../models/ui-tapbar.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-tapbar',
	styleUrl: 'ui-tapbar.scss',
	shadow: false,
	scoped: false,
})
export class UITapbar {
	/** Tap actual (por defecto, la primera) */
	@Prop({ mutable: true, reflect: true }) activeTap: string;

	/** Indicate if action menu button show */
	@Prop({ mutable: true, reflect: true }) actionMenuShow: boolean;

	/** Botones de la tapbar */
	@Prop({ mutable: true, reflect: true }) taps: string | IUITapbarTap[];
	@Watch('taps') parsetaps(newVal: string | IUITapbarTap[]) {
		if (typeof newVal === 'string') {
			try {
				this._taps = JSON.parse(newVal || '[]');
			} catch (e) {
				console.error(e);
			}
		} else {
			this._taps = newVal || [];
		}
	}
	@State() _taps: IUITapbarTap[];

	@State() _openActionMenu: any = {
		open: false,
	};

	@Listen('click', { target: 'window' }) checkClickOutside(event) {
		if (this.actionMenuShow) {
			const insideElementMenu = document.querySelector('scib-ui-options-menu');
			if (insideElementMenu && !insideElementMenu.contains(event.target) && this._openActionMenu.open) {
				const actionMenu = this._openActionMenu;
				actionMenu.open = false;
				this._openActionMenu = { ...actionMenu };
			}
		}
	}

	/** Emite al setear la tap activa (incluído al inicio si no hay una) */
	@Event() eventTapChange: EventEmitter<string>;

	/** Event emitter for click options on action menu */
	@Event() eventOptionClick: EventEmitter<any>;

	componentWillLoad() {
		this.parsetaps(this.taps);
		if (!this.activeTap && this._taps && this._taps.length > 0) {
			this.setTap(this._taps[0].id);
		}
	}

	setTap(tap: string) {
		if (tap !== this.activeTap) {
			this.activeTap = tap;
			this.eventTapChange.emit(this.activeTap);
		}
	}

	toggleActionMenu(tapId) {
		const actionMenuObject = {
			open: !this._openActionMenu.open,
			id: 'option-menu-' + tapId,
		};
		setTimeout(() => {
			this._openActionMenu = { ...actionMenuObject };
		}, 100);
	}

	handleEventOptionsClick(eventData, idTap) {
		this.eventOptionClick.emit({
			tapId: idTap,
			eventType: eventData.detail.eventId,
		});
	}

	render() {
		return (
			<div class="ui-tapbar">
				{this._taps?.map(tap => (
					<div class={{ 'ui-tapbar__container': true, 'ui-tapbar__container--active': this.activeTap === tap.id }}>
						<button onClick={() => this.setTap(tap.id)} class="ui-tapbar__item" aria-label={tap.name} disabled={tap.disabled}>
							<div
								class={{
									'ui-tapbar__icon u-icon': true,
									[tap.icon]: true,
								}}
							></div>
							<p class="ui-tapbar__text">{tap.name}</p>
							{tap.notifications && (
								<div class={{ 'ui-tapbar__bubble': true, 'ui-tapbar__bubble--more': tap.notifications?.length > 1 }}>
									<span class="ui-tapbar__notification">{tap.notifications}</span>
								</div>
							)}
						</button>
						{this.actionMenuShow && (
							<scib-ui-button
								icon="icon-menu"
								class={{ 'ui-tapbar__action': true, 'ui-tapbar__action--active': this._openActionMenu.open && 'option-menu-' + tap.id == this._openActionMenu.id }}
								hideTxt
								small
								onClick={() => {
									this.toggleActionMenu(tap.id);
									if (this.activeTap !== tap.id) {
										this.setTap(tap.id);
									}
								}}
							></scib-ui-button>
						)}
						{this.actionMenuShow && (
							<scib-ui-options-menu
								class={{ 'ui-tapbar__option-menu': true, 'ui-tapbar__option-menu--open': this._openActionMenu.open && 'option-menu-' + tap.id == this._openActionMenu.id }}
								id-elem={'option-menu-' + tap.id}
								buttons={tap.actionMenu as Array<any>}
								onEventClickOptions={data => this.handleEventOptionsClick(data, tap.id)}
							></scib-ui-options-menu>
						)}
					</div>
				))}
			</div>
		);
	}
}
