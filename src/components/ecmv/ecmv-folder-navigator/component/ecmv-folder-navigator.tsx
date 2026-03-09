import { Component, h, Prop, EventEmitter, Event } from '@stencil/core';
import { IECMVNavigation } from '../models/ecmv-folder-navigator.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ecmv-folder-navigator',
	styleUrl: 'ecmv-folder-navigator.scss',
	shadow: false,
	scoped: true,
})
export class ECMVFolderNavigator {
	/*Folder name*/
	@Prop() name: string;

	/*Parameter to change the folder icon to the folio icon*/
	@Prop() changeIcon: boolean;

	/*Parameter to change the folder icon to custom icon*/
	@Prop() customIcon: string;

	/*Parameter to change size and color to custom icon*/
	@Prop() styleIcon: boolean;

	/** Emite el bus de eventos */
	@Event() navigatorEvents: EventEmitter<IECMVNavigation>;

	/** Maneja el para accedet */
	_handleClick(item: string) {
		this.navigatorEvents.emit({ itemName: item });
	}

	private iconRender(): any {
		return this.customIcon ? (
			<span class={`u-icon ${this.customIcon} ${this.styleIcon ? 'ecmv-folder__icon' : ''}`}></span>
		) : (
			<span class={{ 'u-icon': true, 'icon-folder': !this.changeIcon, 'icon-filepage': this.changeIcon }}></span>
		);
	}

	render() {
		return (
			<section class="ecmv-folder__section" onClick={() => this._handleClick(this.name)}>
				{this.iconRender()}
				<span class="ecmv-folder__name">{this.name}</span>
				<span class="u-icon icon-chrevron-right"></span>
			</section>
		);
	}
}
