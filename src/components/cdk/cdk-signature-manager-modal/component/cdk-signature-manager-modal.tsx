import { Component, Host, h, Prop, Watch, State, Event, EventEmitter, Listen } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { ManagerService } from '../services/manager.service';
import { isEmpty } from 'lodash';
import { Literals, Manager, ManagersBack, SelectedManagerInfo } from '../models/cdk-signature-manager-modal.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-signature-manager-modal',
	styleUrl: 'cdk-signature-manager-modal.scss',
	shadow: false,
	scoped: false
})
export class CDKSignatureManagerModal {
	private _autocomplete: HTMLScibMoleculesAutocompleteTextFieldElement;
	private mailRegExp: RegExp = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	/**
	 * Environment
	 */
	@Prop() env: string;

	@Prop() openModalManager: boolean = false;
	@Watch('openModalManager') async handleOpenModalManager(newValue: boolean) {
		this._openModalManager = newValue;
		if (!this._openModalManager) {
			this.manager = { id: '', name: '', email: '' };
			this.managerSelected = undefined;
			this._filteredManagers = [...this._managers];
			this.checkedCheckbox = false;
			this.isDisabled = true;
		} else {
			await this.getManagersList();
		}
	}
	@State() _openModalManager: boolean;

	/** Literals used in the component */
	@Prop() literals: Literals | string;
	@Watch('literals') parseLiterals(newLiterals: Literals | string) {
		this._literals = _parseProp(newLiterals) as Literals;
	}
	@State() _literals: Literals;

	/**
	 * Selected manager
	 */
	@State() managerSelected: Manager;

	/**
	 * Mapped manager
	 */
	@State() manager: SelectedManagerInfo = { id: '', name: '', email: '' };

	/**
	 * Option managers combo
	 */
	@State() _managers: Manager[] = [];
	@State() _filteredManagers: Manager[] = [];

	/**
	 * Checkbox add new manager
	 */
	@State() checkedCheckbox: boolean;

	/**
	 * Disabled confirm button
	 */
	@State() isDisabled: boolean = true;

	/**
	 * Control if the email input field format is correct
	 */
	@State() emailInvalid: boolean;

	/**
	 * Input search manger
	 */
	@State() _searchManager: string = '';

	@State() _invalidManager: boolean = false;

	/**
	 * Events
	 */
	@Event() closeSignatureManagerModal: EventEmitter<void>;
	@Event() eventManagerHasChanged: EventEmitter<boolean>;
	@Event() eventLoadingManagers: EventEmitter<boolean>;
	@Event() eventManagerSelected: EventEmitter<boolean>;
	/**
	 * Listen focus search
	 */
	@Listen('deactivateFocus', { target: 'body' })
	disableLoadingOutfocus() {
		this._loadedList('manager');
	}

	@Listen('activateFocus', { target: 'body' })
	disableLoadingOnfocus() {
		this._loadedList('manager');
	}

	/** Life cycle executed before the first render */
	async componentWillLoad() {
		this.parseLiterals(this.literals);
		this.handleOpenModalManager(this.openModalManager);
	}

	componentDidLoad() {
		this._loadedList('manager');
	}

	async getManagersList(): Promise<void> {
		if (this._openModalManager) {
			this.eventLoadingManagers.emit(true);
			const managers: ManagersBack[] | any = await ManagerService.getManagers(this.env);

			const managers_aux: Manager[] = [];
			managers.forEach((manager) => {
				if (manager.avatar && manager.avatar !== '{}') {
					const avatarObject = JSON.parse(manager.avatar);
					if (avatarObject.mimetype && avatarObject.base64) {
						manager.avatar = `data:${avatarObject.mimetype};base64, ${avatarObject.base64}`;
					}
				} else {
					manager.avatar = assetUrl('/assets/images/i-avatar--small.png');
				}
				managers_aux.push({
					id: manager.clave,
					email: manager.email,
					name: manager.clave + ' - ' + manager.name,
					avatar: {
						src: manager.avatar,
						alt: manager.name
					}
				});
			});
			this._managers = [...managers_aux];
			this._filteredManagers = [...managers_aux];
			this._autocomplete.loaded();
			this.eventLoadingManagers.emit(false);
		}
	}

	_handleCheckbox(): void {
		this.checkedCheckbox = !this.checkedCheckbox;
		if (!this.checkedCheckbox) {
			this.manager.name = '';
			this.manager.email = '';
			this.isDisabled = true;
			this.emailInvalid = false;
			this.eventManagerSelected.emit(false);
		}
	}

	_updateManagerSelected(ev): void {
		if (ev === null) {
			this.isDisabled = true;
		} else {
			this.isDisabled = false;
		}
		this.manager.name = '';
		this.manager.email = '';
		this.checkedCheckbox = false;
		this.emailInvalid = false;
		this.managerSelected = ev;
		this.manager.id = this.managerSelected.id;
		this._filteredManagers = [...this._managers];

		const indexSelectManager: number = this._filteredManagers.findIndex((manager) => manager.id === this.managerSelected.id);
		this._filteredManagers.splice(indexSelectManager, 1);
		this._filteredManagers = [...this._filteredManagers];
		this._searchManager = '';
		this.eventManagerSelected.emit(true);
	}

	_handleFilterManagerInput({ detail }: CustomEvent<string>, id: string): void {
		const managerOptions: Manager[] = [...this._managers];
		this._searchManager = detail;
		if (detail) {
			const filterManagerOptions: Manager[] = managerOptions.filter(
				(manager) =>
					manager.id.toLocaleLowerCase().includes(detail.toLocaleLowerCase()) ||
					manager.name.toLocaleLowerCase().includes(detail.toLocaleLowerCase())
			);
			this._filteredManagers = [...filterManagerOptions];
			this._loadedList(id);
		} else {
			this._filteredManagers = [...managerOptions];
		}
	}

	resetSelectedManager(): void {
		this.managerSelected = undefined;
		this._filteredManagers = [...this._managers];
		this.isDisabled = true;
		this.eventManagerSelected.emit(false);
	}

	_handleInputName({ detail }: CustomEvent): void {
		this.manager.name = detail;
		this.validateManager();
	}

	_handleInputEmail({ detail }: CustomEvent): void {
		if (detail) {
			this.emailInvalid = detail.match(this.mailRegExp) ? false : true;
		} else {
			this.emailInvalid = false;
		}
		this.manager.email = detail;
		this.validateManager();
	}

	async _handleSetManager(): Promise<void> {
		const managers: ManagersBack[] | any = await ManagerService.getManagers(this.env);
		if (managers) {
			this._invalidManager = managers.map((manager) => manager.email).some((item) => item == this.manager.email);
		}

		if (!this._invalidManager) {
			await ManagerService.setManager(this.manager, this.env)
				.then(async () => {
					this.checkedCheckbox = false;
					this.emailInvalid = false;
					this.resetSelectedManager();
					this.manager = { id: '', name: '', email: '' };
					this.eventManagerHasChanged.emit(true);
				})
				.catch(() => {
					this.eventManagerHasChanged.emit(false);
				});
		}
	}

	validateManager(): void {
		if (this.manager.name !== '' && this.manager.name !== null && this.manager.email !== '' && this.manager.name !== null && !this.emailInvalid) {
			this.manager.id = null;
			this.isDisabled = false;
		} else {
			this.isDisabled = true;
		}

		if (!this.manager.name && !this.manager.email) {
			this.eventManagerSelected.emit(false);
		} else {
			this.eventManagerSelected.emit(true);
		}
	}

	private _loadedList(id: string): void {
		const element = document.getElementById(id) as HTMLScibMoleculesAutocompleteTextFieldElement;
		element.loaded();
	}

	render() {
		return (
			<Host>
				<scib-ui-dialog
					is-emitter
					absolute
					mobile-fullscreen
					open={this._openModalManager} // && this._hasPermissions === true && this._emptyPermissions === false
					style={{ visibility: this._openModalManager ? 'show' : 'hidden' }}
				>
					<section class="cdk-signature-manager">
						<div class="cdk-signature-manager__title-container">
							<h2 class="cdk-signature-manager__title">{this._literals.selectManager}</h2>
						</div>
						<article class="cdk-signature-manager__text-container" innerHTML={this._literals.textManager}></article>
						<div class="cdk-signature-manager__finder">
							<scib-molecules-autocomplete-text-field
								ref={(element) => (this._autocomplete = element)}
								class="c-header-form-field"
								variant="white"
								icon="search-2"
								id={'manager'}
								name={'manager-list'}
								label={this._literals.selectManager}
								loading={false}
								selected-value={this._searchManager}
								minChars={0}
								onValueChange={(event) => {
									if (event && event.detail && !isEmpty(event.detail)) {
										this._handleFilterManagerInput(event, 'manager');
									}
								}}
								onClick={() => {
									this._loadedList('manager');
								}}
							>
								<div slot="content-list">
									<ul>
										{this._filteredManagers?.length ? (
											this._filteredManagers.map((option) => {
												return (
													<li
														class="content-list__item"
														onClick={() => {
															this.managerSelected = option;
															this._updateManagerSelected(option);
														}}
													>
														<scib-atoms-avatar variant="white" img={option.avatar.src}></scib-atoms-avatar>
														<span>{option.name}</span>
													</li>
												);
											})
										) : (
											<li>
												<span>{this._literals.noResultsText}</span>
											</li>
										)}
									</ul>
								</div>
							</scib-molecules-autocomplete-text-field>
						</div>
						{this.managerSelected ? (
							<div>
								<div class="cdk-signature-manager__section">
									<img
										class="cdk-signature-manager__avatar"
										src={this.managerSelected.avatar.src}
										alt={this.managerSelected.avatar.alt}
									/>
									<div class="cdk-signature-manager__contact-info">
										<div>
											<span class="name">{this.managerSelected.name}</span>
										</div>
										<span onClick={() => this.resetSelectedManager()} class="icon-style u-icon icon-delete"></span>
									</div>
								</div>
							</div>
						) : (
							<div
								class={{
									'cdk-signature-manager__checkbox': true,
									'cdk-signature-manager__checkbox--cheched': this.checkedCheckbox
								}}
							>
								<div class="cdk-signature-manager__above">
									<scib-ui-v2-checkbox
										uid="manager-check"
										value={this.checkedCheckbox ? 'checked' : 'unchecked'}
										label={this._literals.notListAbove}
										onValueChange={() => this._handleCheckbox()}
									></scib-ui-v2-checkbox>
								</div>
								{this.checkedCheckbox && (
									<div class="cdk-signature-manager__inputs">
										<div>
											<scib-ui-v2-text-field
												variant="white"
												label={this._literals.nameManager}
												onValueChange={($event) => this._handleInputName($event)}
											></scib-ui-v2-text-field>
											<scib-ui-v2-text-field
												variant="white"
												label={this._literals.emailManager}
												invalid={this.emailInvalid}
												helperText={this.emailInvalid ? this._literals.emailMessageError : undefined}
												type="email"
												onValueChange={($event) => this._handleInputEmail($event)}
											></scib-ui-v2-text-field>
										</div>

										{this._invalidManager && <p class="cdk-signature-manager__error"> {this._literals.errorManager}</p>}
									</div>
								)}
							</div>
						)}
						<div class="cdk-signature-manager__footer">
							<span class="required-text">{this._literals.requiredInputs}</span>
							<div class="cdk-signature-manager__footer-btns">
								<scib-atoms-button
									text={this._literals.buttonCancel}
									size="s"
									level="secondary"
									onClick={() => {
										this.closeSignatureManagerModal.emit();
									}}
								></scib-atoms-button>
								<scib-atoms-button
									text={this._literals.buttonConfirm}
									size="s"
									disabled={this.isDisabled}
									onClick={() => {
										this._handleSetManager();
									}}
								></scib-atoms-button>
							</div>
						</div>
					</section>
				</scib-ui-dialog>
			</Host>
		);
	}
}
