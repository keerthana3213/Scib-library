import { ICDKConfigLiterals, ICDKConfigData, ICDKConfigCheckGeneral } from '../models/cdk-config-notification.model';
import { Component, Host, h, Prop, Watch, State, EventEmitter, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-config-notification',
	styleUrl: 'cdk-config-notification.scss',
	shadow: false,
	scoped: false
})
export class CDKConfigNotification {
	@State() saveStatus: boolean = false;

	@State() checkGeneral: ICDKConfigCheckGeneral = {
		disabled: true,
		checkAll: false,
		indeterminate: false
	};

	@State() checkPlatform: boolean = false;

	@State() iconButton: string = 'icon-edit-pencil';

	/** Data form filled*/
	@Prop() dataForm: { selectedChecks: Array<string>; general: boolean } = {
		selectedChecks: [],
		general: false
	};

	/** Literals */
	@Prop({ reflect: true }) literals: ICDKConfigLiterals | string;

	@Watch('literals') literalsChange(newVal: ICDKConfigLiterals | string) {
		this._literals = _parseProp(newVal);
	}

	@State() _literals: ICDKConfigLiterals;

	@Prop({ reflect: true }) configData: ICDKConfigData[] | string;

	@Watch('configData') ICDKConfigDataChange(newVal: ICDKConfigData[] | string) {
		this._configData = _parseProp(newVal);
		this.checkAllOrIndeterminate();
	}

	@State() _configData: ICDKConfigData[];

	@Prop({ reflect: true, mutable: true }) global: boolean;

	@Watch('global') ICDKGlobalChange(newVal: boolean) {
		this.checkPlatform = newVal;
	}

	@Event() eventValuesFormEmitter: EventEmitter;

	checkAllOrIndeterminate() {
		const getCheckedArray = this._getCheckedArray();
		if (getCheckedArray.length === 0) {
			this.checkGeneral.checkAll = false;
			this.checkGeneral.indeterminate = false;
		} else {
			if (getCheckedArray.length === this._configData.length) {
				this.checkGeneral.indeterminate = false;
				this.checkGeneral.checkAll = true;
			} else {
				this.checkGeneral.indeterminate = true;
				this.checkGeneral.checkAll = false;
			}
		}
		this.checkGeneral = JSON.parse(JSON.stringify(this.checkGeneral));
	}

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.literalsChange(this.literals);
		this.ICDKConfigDataChange(this.configData);
		this.ICDKGlobalChange(this.global);
	}

	save() {
		this.saveStatus = !this.saveStatus;
		this.iconButton = this.iconButton == 'icon-edit-pencil' ? 'icon-save-24' : 'icon-edit-pencil';

		if (this.saveStatus) {
			this._configData.map((item) => {
				item.checkisDisabled = false;
			});
			this.checkGeneral.disabled = false;
		} else {
			this._configData.map((item) => {
				item.checkisDisabled = true;
			});
			this._handleFinish();
			this.checkGeneral.disabled = true;
		}
	}

	check() {
		if (this.saveStatus) {
			this.checkGeneral.indeterminate = false;
			this.checkGeneral.checkAll = !this.checkGeneral.checkAll;
			const configDataNew = [...this._configData];
			if (this.checkGeneral.checkAll) {
				configDataNew.map((item) => {
					item.checked = true;
					const index = this.dataForm.selectedChecks.indexOf(item.idCheck);
					if (index == -1) {
						this.dataForm.selectedChecks.push(item.idCheck);
					}
				});
			} else {
				configDataNew.map((item) => {
					item.checked = false;
					const index = this.dataForm.selectedChecks.indexOf(item.idCheck);
					if (index > -1) {
						this.dataForm.selectedChecks.splice(index, 1);
					}
				});
			}
			this._configData = configDataNew;
		}
	}

	_handleCheckbox(e: any, id: string) {
		if (id) {
			if (id !== 'generalPlatform') {
				this._configData.forEach((item) => {
					if (item.idCheck === id) {
						item.checked = e.detail;
					}
				});
			} else {
				this.dataForm.general = e.detail;
			}
		}
		this.dataForm.selectedChecks = this._getCheckedArray();
		this.checkAllOrIndeterminate();
	}

	/**
	 * Returns acronym values if it's checked
	 */
	_getCheckedArray() {
		let array = (this._configData || []).map((item: { [key: string]: any }) => (item.checked ? item.acronym : null));
		return array.filter((item) => item);
	}

	_imageError(itemImage: any) {
		const newConfigData = this._configData;
		newConfigData.map((item) => {
			if (item.idCheck == itemImage.idCheck) {
				item.imgEnabled = false;
			}
		});
		this._configData = newConfigData;
	}

	/** Emitter data form filled */
	_handleFinish() {
		this.dataForm.selectedChecks = this._getCheckedArray();
		this.checkAllOrIndeterminate();
		this.eventValuesFormEmitter.emit(this.dataForm);
	}

	render() {
		return (
			<Host>
				<div class="cdk-config-notifications">
					<div class="cdk-config-notifications__blockTitle">
						<h2 class="cdk-config-notifications__title">{this._literals.titleConfi}</h2>
						<div class="cdk-config-notifications__buttonRight">
							<scib-ui-button small={true} disableMinWidth={true} link={true} onClick={() => this.save()} icon={this.iconButton}>
								{this.saveStatus ? this._literals.botonSave : this._literals.boton}
							</scib-ui-button>
						</div>
					</div>
					<div class="cdk-config-notifications__blockCheckAll">
						<div class="cdk-config-notifications__checkBoxAll">
							<scib-ui-checkbox
								isDisabled={this.checkGeneral.disabled}
								checked={this.checkGeneral.checkAll}
								indeterminate={this.checkGeneral.indeterminate}
								onCheckboxChange={() => this.check()}
							></scib-ui-checkbox>
						</div>
						<div class="cdk-config-notifications__sub">
							<h3 class="cdk-config-notifications__subTitle">{this._literals.subTitle}</h3>
							<span class="cdk-config-notifications__subText">{this._literals.subText}</span>
						</div>
					</div>

					{(this._configData || []).map((item) => (
						<div class="cdk-config-notifications__rows">
							<div class="cdk-config-notifications__col2">
								<scib-ui-checkbox
									isDisabled={item.checkisDisabled}
									checked={item.checked}
									idCheck={item.idCheck}
									name={item.idCheck}
									onCheckboxChange={() => this._handleCheckbox(event, item.idCheck)}
								></scib-ui-checkbox>
							</div>

							{item.imgEnabled == true ? (
								<div class="cdk-config-notifications__col3">
									<img class="img-width" onError={() => this._imageError(item)} src={item.img}></img>
								</div>
							) : (
								''
							)}

							<div class="cdk-config-notifications__col4">
								<p class="cdk-config-notifications__name">{item.nameApp} </p>
								<p class="cdk-config-notifications__description">{item.descriptionApp}</p>
							</div>
						</div>
					))}
					<div class="cdk-config-notifications__platform">
						<div class="cdk-config-notifications__checkBoxAll">
							<scib-ui-checkbox
								isDisabled={this.checkGeneral.disabled}
								checked={this.checkPlatform}
								idCheck={'generalPlatform'}
								onCheckboxChange={() => this._handleCheckbox(event, 'generalPlatform')}
							></scib-ui-checkbox>
						</div>
						<div class="cdk-config-notifications__sub">
							<h3 class="cdk-config-notifications__subTitle">{this._literals.textPlatform}</h3>
							<span class="cdk-config-notifications__subText">{this._literals.textSubPlatform}</span>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
