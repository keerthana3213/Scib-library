import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import _merge from 'lodash/merge';

@Component({
	tag: 'scib-cdk-modal-client-detail',
	styleUrl: 'cdk-modal-client-detail.scss',
	shadow: false,
	scoped: true
})
export class CDKModalClientDetail {
	@Prop({ mutable: true, reflect: true }) haveOfflineOption: boolean = true;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) literals: object | string;
	@Watch('literals') parseLiterals(newLiterals: string | any) {
		if (newLiterals) {
			try {
				this._literals = _parseProp(newLiterals);
			} catch (e) {}
		}
	}
	@State() _literals: { [key: string]: any };

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) data: any;
	@Watch('data') parseData(newdata: string) {
		if (newdata) {
			let aux = {};
			try {
				aux = _parseProp(newdata);
				_merge(this._data, aux);
				this._canEdit = this.editPermission(this._data);
				this._canDelete = this.deletePermission(this._data);
			} catch (e) {}
		}
	}

	@State() _data: { [key: string]: any } = {
		title: 'Client detail',
		legend: 'Creation group'
	};

	@State() _canEdit: boolean = false;

	@State() _canDelete: boolean = false;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ mutable: true, reflect: true }) apps: any;
	@Watch('apps') parseApps(newapps: string) {
		if (newapps) {
			let aux: any = [];
			try {
				aux = _parseProp(newapps);
			} catch (e) {}
			aux = aux.filter((item) => item.select);
			this._apps = [...aux];
		}
	}
	@State() _apps: Array<any> = [];

	@Prop({ mutable: true, reflect: true }) showApps: boolean;
	@Watch('showApps') parseShowApps(newShowApps: any) {
		if (newShowApps) {
			this._showApps = _parseProp(newShowApps);
		}
	}
	@State() _showApps: boolean = false;

	/** Descripción del evento */
	@Event() eventClick: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
		this.parseApps(this.apps);
		this.parseShowApps(this.showApps);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	editPermission(dataUser) {
		if (dataUser && dataUser.permission === false) {
			return false;
		} else if (dataUser && dataUser.permission === true && dataUser.permissionEdit === false) {
			return false;
		} else {
			return true;
		}
	}

	deletePermission(dataUser) {
		if (dataUser.permission === false) {
			return false;
		} else {
			return true;
		}
	}

	formatIndex(index) {
		return ('00' + (index + 1)).slice(-2);
	}

	render() {
		return (
			<Host>
				<scib-cdk-modal-form
					literals={JSON.stringify(this._literals)}
					data={JSON.stringify(this._data)}
					is-loading={false}
					onUserAction={() => this.eventClick.emit('close')}
				>
					<div class="cdk-modal-client-detail">
						<scib-ui-row separator>
							<scib-ui-column col-xs="3" col-lg="3">
								<scib-ui-label-data
									label={this._literals.userName ? this._literals.userName : 'UserName'}
									text={this._data.client_identifier}
								/>
							</scib-ui-column>
							<scib-ui-column col-xs="3" col-lg="3">
								<cib-ui-row>
									<div style={this._canEdit ? { display: 'block' } : { display: 'none' }}>
										<scib-ui-button
											link
											disable-min-width
											iconLeft
											icon="icon-edit-pencil"
											onEventClick={() => this.eventClick.emit('edit')}
										>
											{this._literals && this._literals.edit ? this._literals.edit : 'Edit'}
										</scib-ui-button>
									</div>
									{this._data.state !== 'I' && (
										<div>
											<scib-ui-button
												link
												disable-min-width
												icon="icon-messages_deseable"
												iconLeft
												onEventClick={() => this.eventClick.emit('resend')}
											>
												{this._literals && this._literals.resend ? this._literals.resend : 'Resend'}
											</scib-ui-button>
										</div>
									)}
								</cib-ui-row>
							</scib-ui-column>
						</scib-ui-row>
						<scib-ui-row>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.name ? this._literals.name : 'name'}
									text={this._data.name ? this._data.name : '-'}
								/>
							</scib-ui-column>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.surname ? this._literals.surname : 'surname'}
									text={this._data.surname ? this._data.surname : '-'}
								/>
							</scib-ui-column>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.phoneNumber ? this._literals.phoneNumber : 'phone Number'}
									text={this._data.phoneNumber ? this._data.phoneNumber : '-'}
								/>
							</scib-ui-column>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.idDocType ? this._literals.idDocType : 'IdDocType'}
									text={this._data.idDocType ? this._data.idDocType : '-'}
								/>
							</scib-ui-column>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.idNumber ? this._literals.idNumber : 'idNumber'}
									text={this._data.idNumber ? this._data.idNumber : '-'}
								/>
							</scib-ui-column>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.rol ? this._literals.rol : 'rol'}
									text={this._data.rol ? this._data.rol : '-'}
								/>
							</scib-ui-column>
						</scib-ui-row>
						<scib-ui-row>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.company ? this._literals.company : 'company'}
									text={this._data.company ? this._data.company : '-'}
								/>
							</scib-ui-column>
							<scib-ui-column col-lg="2">
								<scib-ui-label-data
									label={this._literals.subsidiary ? this._literals.subsidiary : 'subsidiary'}
									text={this._data.subsidiary ? this._data.subsidiary : '-'}
								/>
							</scib-ui-column>
							{this.haveOfflineOption && (
								<scib-ui-column col-lg="2">
									<scib-ui-label-data
										label={this._literals.userType ? this._literals.userType : 'user type'}
										text={this._data.state === 'A' || this._data.state === 'O' ? this._literals.active : this._literals.inactive}
									></scib-ui-label-data>
								</scib-ui-column>
							)}
							{this._data.twoFactorActivated && (
								<scib-ui-column col-lg="2">
									<scib-ui-label-data label={this._literals?.twoFactorActivated} text={this._data.twoFactorActivated} />
								</scib-ui-column>
							)}
							{this._data.frCommsActivated && (
								<scib-ui-column col-lg="2">
									<scib-ui-label-data label={this._literals?.frCommsActivated} text={this._data.frCommsActivated || '-'} />
								</scib-ui-column>
							)}
						</scib-ui-row>
						{this._data?.multiglcs_data && (
							<scib-ui-row separator class="cdk-modal-client-detail__glcs-row">
								{this._data.multiglcs_data.map((glcs, index) => (
									<scib-ui-column
										col-lg="6"
										class={{
											'cdk-modal-client-detail__glcs-column': true,
											'cdk-modal-client-detail__glcs-column--last': index === this._data.multiglcs_data.length - 1
										}}
									>
										<scib-ui-separator />
										<div>
											<h3 class="cdk-modal-client-detail__glcs-title">
												{this._literals.entity ? this._literals.entity : 'Entity'} {this.formatIndex(index)}
												<span class="cdk-modal-client-detail__glcs-primary">
													{this._data.subsidiary_id === glcs.subsidiary_id
														? this._literals.entityDefault
															? '(' + this._literals.entityDefault + ')'
															: '(Primary entity)'
														: ''}
												</span>
											</h3>
											<p class="cdk-modal-client-detail__glcs-name">
												{glcs.subsidiary_glcs && <span>{glcs.subsidiary_glcs + ' - '}</span>}
												{glcs.subsidiary.toLowerCase()}
											</p>
										</div>
									</scib-ui-column>
								))}
							</scib-ui-row>
						)}
						{this._apps && this._apps.length > 0 && (
							<scib-ui-row separator>
								{this._apps && this._apps.length > 0 && this._showApps ? (
									<scib-ui-column col-lg="6">
										<scib-ui-label-data label={this._literals.appSelection ? this._literals.appSelection : 'App Selection'} />
									</scib-ui-column>
								) : (
									''
								)}
								{this._apps &&
									this._apps.length > 0 &&
									this._showApps &&
									this._apps.map((item) => (
										<scib-ui-column style={{ display: item.select ? 'block' : 'none' }} class="no-margin" col-lg="2">
											<scib-ui-label-data text={item.name} />
										</scib-ui-column>
									))}
							</scib-ui-row>
						)}
						<scib-ui-row>
							<scib-ui-column class="no-margin" col-lg="3" offset-lg="3">
								<scib-ui-button
									link
									disable-min-width
									onEventClick={() => this.eventClick.emit('delete')}
									disabled={!this._canDelete}
								>
									{this._literals.delete}
								</scib-ui-button>
								{this._data.state === 'I' ? (
									<scib-ui-button link disable-min-width onEventClick={() => this.eventClick.emit('activateUser')}>
										{this._literals.activateUser}
									</scib-ui-button>
								) : (
									<scib-ui-button link disable-min-width onEventClick={() => this.eventClick.emit('deactivateUser')}>
										{this._literals.deactivateUser}
									</scib-ui-button>
								)}
							</scib-ui-column>
						</scib-ui-row>
					</div>
				</scib-cdk-modal-form>
			</Host>
		);
	}
}
