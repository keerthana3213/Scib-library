import { Component, Host, h, Prop, EventEmitter, Watch, Event, State, Listen } from '@stencil/core';
import { ECheckboxValue } from '../../../ui-v2/ui-v2-checkbox/models/ui-v2-checkbox.model';
import { UISelectOption } from '../../ui-select/fragments/ui-select-option.fragment';
import { IDetailCheckboxSelected } from '../models/ui-list.model';

@Component({
	tag: 'scib-ui-list',
	styleUrl: 'ui-list.scss',
	shadow: false,
	scoped: true
})
export class UIList {
	@Prop({ reflect: true }) label: string;

	@Prop({ mutable: true, reflect: false }) hiddenLabel: boolean;

	@Prop({ mutable: true, reflect: false }) tooltip: string;

	@Prop({ reflect: true }) idList: string;

	@Prop({ mutable: true, reflect: true }) owners;
	@Watch('owners') parseOwners() {
		this._owners = typeof this.owners === 'string' ? JSON.parse(this.owners) : this.owners;
	}
	@State() _owners;

	@Prop() showCheckbox: boolean = false;

	@Prop() hasInfoData: boolean = false;

	@Prop({ mutable: true, reflect: false }) items;
	@Watch('items') parseItems() {
		this._items = typeof this.items === 'string' ? JSON.parse(this.items) : this.items;
	}

	@State() _items;

	/** Id del usuario logado. */
	@Prop({ mutable: true, reflect: true }) loggedUser: string;

	/** Valor por defecto del campo. */
	@Prop({ reflect: true }) value: string | string[];

	/** Evento emitido al cambiar el valor de array de elementos @multiselectOnly */
	@Event() updateOwners: EventEmitter;

	/** Evento emitido al cambiar el valor de array de elementos @multiselectOnly */
	@Event() updateItems: EventEmitter;

	@Event() checkboxClicked: EventEmitter;

	@Listen('valueChange') onValueChange(e: CustomEvent & { detail: IDetailCheckboxSelected }) {
		this.checkboxClicked.emit({ id: e.detail.checkboxId, value: e.detail.checkboxValue });
	}

	/*** Custom Methods ***/

	handleRemoveItem(elementIndex) {
		if (this._owners) {
			let removedOwner = this._owners[elementIndex];
			this.updateOwners.emit(removedOwner);
			return;
		}
		let removedItem = this._items[elementIndex];
		this.updateItems.emit(removedItem);
	}

	/** LifeCycle methods */

	componentWillLoad() {
		if (this.owners) this.parseOwners();
		if (this.items) this.parseItems();
	}

	render() {
		return (
			<Host>
				<label class={{ 'ui-list__label': true, accessibility: this.hiddenLabel }} htmlFor={this.idList}>
					{this.label}
				</label>
				<ul class={{ 'ui-list__list': true, 'ui-list__list--items': this._items }} id={this.idList}>
					{this._owners?.length > 0 &&
						this._owners?.map((selectedItem, index) => (
							<li class="ui-list__item">
								<div class="ui-items-header">
									<UISelectOption option={selectedItem} optionDetail={this.hasInfoData} />
									{selectedItem.value !== this.loggedUser && !this.hasInfoData && (
										<button
											type="button"
											class="ui-list__btn ui-list__btn--mrgb"
											onClick={() => this.handleRemoveItem(index)}
											arial-label="remove-item"
										>
											<span class="u-icon icon-delete"></span>
										</button>
									)}
								</div>
								{this.showCheckbox && (
									<div class="ui-items-checkbox">
										<scib-ui-v2-checkbox
											label={selectedItem.labelCheckbox}
											uid={index}
											name={index}
											value={
												selectedItem.optionDefaultCheckbox === ECheckboxValue.disabled
													? ECheckboxValue.indeterminate
													: selectedItem.optionDefaultCheckbox
											}
											disabled={selectedItem.optionDefaultCheckbox === ECheckboxValue.disabled}
										/>
									</div>
								)}
							</li>
						))}

					{this._items?.length > 0 &&
						this._items?.map((selectedItem, index) => (
							<li class="ui-list__element">
								<span class="ui-list__value">{selectedItem}</span>
								<button
									class="ui-list__btn ui-list__btn"
									type="button"
									title={this.tooltip + ': ' + selectedItem}
									onClick={() => this.handleRemoveItem(index)}
									arial-label="remove-item"
								>
									<span class="u-icon icon-fill-clear"></span>
								</button>
							</li>
						))}
				</ul>
			</Host>
		);
	}
}
