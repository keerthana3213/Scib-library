import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { MCDKChildsTable } from '../models/cdk-childs-table.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-childs-table',
	styleUrl: 'cdk-childs-table.scss',
	shadow: false,
	scoped: false,
})
export class CDKChildsTable {
	/**
	 * Request STATES:
	 * @type {('pending'|'requested'|'in-progress'|'done'|'canceled'|'disabled'|'locked')}
	 */

	/* Define if all or one checkBox are selected */
	@Event() selectAllInstructions: EventEmitter;
	@Event() selectInstruction: EventEmitter;
	@Event() viewDetailInstruction: EventEmitter;

	/** Identification number of the request */
	@Prop() idRequest: string;

	/** Indicates if the request is blocked or not */
	@Prop({ reflect: false }) locked: boolean;

	/** Indicates if the instruction is blocked or not */
	@Prop({ reflect: false }) isLocked: boolean;

	/** Data of the sub-requests of the main request*/
	@Prop({ reflect: false }) childs: string | MCDKChildsTable;

	/**Labels column literals */
	@Prop({ mutable: true, reflect: false }) labels: string | string[];

	@Watch('labels') labelsChange(newVal: string | string[]) {
		this._labels = _parseProp(newVal);
	}

	@State() _labels: string[];

	/** Store children in locked */
	@Prop({ reflect: false }) childsLocked: boolean[];

	@Watch('childs') childsChange(newVal: MCDKChildsTable | string) {
		this._childs = _parseProp(newVal);
	}

	@State() _childs: MCDKChildsTable;

	// private changeCheckBoxStatus(event, dataInstrtucction): void {
	// 	this.selectAllInstructions.emit(event);
	// 	if (event.detail) {
	// 		const data = this.getStatusMultipleSelections();
	// 		this.onSelect.emit({...data,...dataInstrtucction.idRequest});
	// 		return
	// 	}
	// 	const data = this._childs.data.map(el =>{
	// 		return{...el,...{selected:false}};
	// 	});
	// 	this.onSelect.emit(data);
	// }
	// private getStatusMultipleSelections() {
	// 	return this._childs.data.map(el => {
	// 		if (el.status === 'Pending' || el.status === 'Requested') {
	// 			return { ...el, ...{ selected: true } };
	// 		}
	// 		return { ...el, ...{ selected: false } };
	// 	});
	// }

	/** Event emitted when changing the checkbox value */
	private onSelectElement(event, element): void {
		if (event.detail) {
			const data = [{ ...element, selected: true, idRequest: this.idRequest }];
			this.selectInstruction.emit(data);
			return;
		}
		const data = [{ ...element, selected: false }];
		this.selectInstruction.emit(data);
	}

	/*Function that emits the click of the eye button*/
	_handleOpenDetail(element) {
		this.viewDetailInstruction.emit(element);
	}

	/*Function that checks for blocked items and updates them*/
	public isLockedRequest(_childs) {
		this.childsLocked = [];
		for (let index = 0; index < _childs.data.length; index++) {
			const element = _childs.data[index];
			this.childsLocked[index] = element.status === 'Pending (Locked)' || element.status === 'Requested (Locked)';
		}
	}

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.childsChange(this.childs);
		this.labelsChange(this.labels);
		this.isLockedRequest(this._childs);
	}

	render() {
		return (
			<div class="cdk-childs-table" role="table" aria-label="List-request-table">
				<div class="cdk-childs-table__thead" role="rowgroup">
					<div class="cdk-childs-table__tr" role="row">
						<div class="cdk-childs-table__th" role="columnheader" aria-sort="none">
							{/* <scib-ui-checkbox idCheck={`mandatory`} name={`mandatory`} onCheckboxChange={(event) => this.changeCheckBoxStatus(event,this._childs.data)}></scib-ui-checkbox> */}
						</div>
						{this._labels.map(element => (
							<div class="cdk-childs-table__th" role="columnheader" aria-sort="none">
								{element}
							</div>
						))}
					</div>
				</div>
				<div class="cdk-childs-table__tbody" role="rowgroup">
					{this._childs.data.map((element, i) => (
						<div class="cdk-childs-table__tr" role="row">
							<div class={{ 'cdk-childs-table__td': true }} role="cell">
								{element.status === 'Pending' || element.status === 'Requested' || element.status === 'Requested (Locked)' || element.status === 'Pending (Locked)' ? (
									<scib-ui-checkbox checked={false} idCheck={`${i}`} name={`${i}`} onCheckboxChange={event => this.onSelectElement(event, element)}></scib-ui-checkbox>
								) : (
									''
								)}
							</div>
							<div class={{ 'cdk-childs-table__td': true, 'ui-color-panel': true, ['--' + element.status.toLowerCase()]: true, '--locked': this.childsLocked[i] }} role="cell">
								<span class="cdk-childs-table__label">{this.labels[0]}</span>
								<span>{element.status}</span>
							</div>
							<div class={{ 'cdk-childs-table__td': true, 'ui-color-panel': true, ['--' + element.status.toLowerCase()]: true, '--locked': this.childsLocked[i] }} role="cell">
								<span class="cdk-childs-table__label">{this.labels[1]}</span>
								<span>{this.getProduct(element.product)}</span>
							</div>
							<div class={{ 'cdk-childs-table__td': true, 'ui-color-panel': true, ['--' + element.status.toLowerCase()]: true, '--locked': this.childsLocked[i] }} role="cell">
								<span class="cdk-childs-table__label">{this.labels[2]}</span>
								<span>{element.currency}</span>
							</div>
							<div class={{ 'cdk-childs-table__td': true, 'ui-color-panel': true, ['--' + element.status.toLowerCase()]: true, '--locked': this.childsLocked[i] }} role="cell">
								<span class="cdk-childs-table__label">{this.labels[3]}</span>
								<span>{element.bicCorresponsal}</span>
							</div>
							<div class={{ 'cdk-childs-table__td': true, 'ui-color-panel': true, ['--' + element.status.toLowerCase()]: true, '--locked': this.childsLocked[i] }} role="cell">
								<span class="cdk-childs-table__label">{this.labels[4]}</span>
								<span>{element.cuentaCorresponsal}</span>
							</div>
							<div class={{ 'cdk-childs-table__td': true, 'ui-color-panel': true, ['--' + element.status.toLowerCase()]: true, '--locked': this.childsLocked[i] }} role="cell">
								<scib-ui-button
									disable-min-width
									hide-txt
									no-background
									small
									no-event-propagation
									onEventClick={() => this._handleOpenDetail(element)}
									icon="icon-open-eye"
								></scib-ui-button>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	getProduct(product) {
		if (Array.isArray(product)) {
			return product.join(', ');
		}
		return product;
	}
}
