import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { compact, isEmpty, merge, size } from 'lodash';
import { TinySliderInfo, tns } from 'tiny-slider/src/tiny-slider';
import { parseProp as _parseProp, assetUrl, generateRandomId } from '../../../../utils/public_api';
import {
	BodyBase,
	ConfigurationOptions,
	ConfirmationOptions,
	CurrentEnvelope,
	DocumentBackReqBodyStep2,
	DocuSignRecipient,
	DocuSignRecipientSignatureProviders,
	DocuSignSigner,
	DraftStep,
	FSECases,
	LangLiterals,
	Languages,
	Literals,
	RecipientList,
	RecipientListOnlyCC,
	RecipientListWithLabel,
	RecipientOptions,
	RecipientRoles,
	RecipientTypes,
	SignatureMessage,
	SignatureOptions,
	SignatureOptionsId,
	SignatureProviderOptions,
	SignatureStep,
	SignatureStepConfig,
	SignatureStepFiles,
	SignatureStepType,
	SignatureTypes,
	SignatureTypesBack,
	SignatureTypesEnum,
	SignatureTypesOptions,
	SignerRecipient,
	StepData,
	Subsidiary,
	Template
} from '../models/cdk-signature-modal.model';
import { defaultRadioRecipientTypes, defaultRadioSignature, defaultSteps } from '../models/defaults';
import { EnvelopeService } from '../services/envelope.service';
import { base64ToFile } from '../utils/utils';
import { mapFiles } from '../worker/cdk-signature-modal.worker';
// Literals
import * as enGB from '../i18n/en-GB.json';
import * as enUS from '../i18n/en-US.json';
import * as esES from '../i18n/es-ES.json';

import { ICDKMessagesFile } from '../../../ecmv/ecmv-modal-files/models/ecmv-modal-files.model';
import { IUIInputOption } from '../../../ui/ui-input/models/ui-input.model';

const STATIC_LITERALS = {
	'es-ES': (esES as any).default,
	'en-GB': (enGB as any).default,
	'en-US': (enUS as any).default
};

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-signature-modal',
	styleUrl: 'cdk-signature-modal.scss',
	shadow: false,
	scoped: false
})
export class CDKSignatureModal {
	$slider!: HTMLElement;
	$docusignUiHeader: HTMLElement;

	_slider: any;
	_checkSkipHelp: boolean = false;
	_initializateSlider: boolean = false;
	_orderFileEnabled: boolean = true;
	_orderRecipientsEnabled: boolean = true;
	_errorCreateEnvelope: boolean = false;
	_errorCreateEnvelopeSizeLimit: boolean = false;
	_errorAssignManager: boolean = false;
	private _notSavedEnvelope: boolean = true;
	onLoadCount = 0;
	_loadingChangeModal: boolean = false;
	existData: boolean = false;
	private envelopeDuplicationFinished = false;
	private originalTemplateRecipients;
	private loadTemplateData: boolean = true;

	/**Indicate which is the minimun value fo the expiration days input*/
	private minValueExpireDays: number = 1;

	/**Indicate which is the maximun value fo the expiration days input*/
	private maxValueExpireDays: number = 999;

	/** Indicate which is the correct format of the email*/
	private mailRegExpString: string = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$';
	private mailRegExp: RegExp = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	/* (optional) Frame rate of slider scrolling */
	private speedSlider: number = 300;

	/* (optional) Indicates if the slider starts scrolling automatically */
	private autoplaySlider: boolean = false;

	/* (optional) Indicates if the slider displacement is circular */
	private loopSlider: boolean = false;
	private stepData: Partial<StepData>;

	@State() _managerSelected: boolean = false;
	@State() _videoOpen: boolean = false;
	@State() _helpOpen: boolean = false;
	@State() _filesUploaded: Array<ICDKMessagesFile> = [];
	@State() _currentStep: number;
	@State() _validation: boolean = false;
	@State() _activeMasiveLoad: boolean = false;
	@State() _recipientsOrderCheck: boolean = false;
	@State() _recipientsList: SignerRecipient[] = [];
	@State() _daysToExpireSiganture: string = '120';
	@State() _selectedSignatureTypeIndex: number = -1;
	@State() _selectedSignatureType: SignatureTypes;
	@State() _signatureMessage: SignatureMessage;
	@State() _downloadFilesUrl: Array<string> = [];
	@State() _modalOpen: boolean = false;
	@State() _modalChangeManagerOpen: boolean = false;
	@State() _modalProcessOpen: boolean = false;
	@State() _modalCompleteOpen: boolean = false;
	@State() _hasPermissions: boolean;
	@State() _emptyPermissions: boolean;
	@State() _serviceFailed: boolean;
	@State() _serviceLoading: boolean = false;

	@State() _hasManager: boolean;
	@State() _isBlockedToCreateEnvelopes: boolean;
	@State() _defaultPhonePrefix: string = '';
	@State() _resetModal: boolean = false;
	@State() _openDocusignUI: boolean;
	@State() _docusignUrl: string;
	@State() _docusignEnvId: string;
	@State() _invalidEmail: boolean[];
	@State() _optionalConfig: boolean[];
	@State() _docAccessCode: boolean[];

	@State() asignedTemplate: Template;

	@State() _glcsOptions: Subsidiary[] = [];
	@State() _glcsInputValues: string[] = [];
	@State() _radioSignatureTypes: SignatureTypes[] = [];
	@State() _useCases: string[];

	/**It's use to say if the expire days input is valid */
	@State() validateDaysExpire: boolean;

	/** It's use to say if the email is valid */
	@State() validateEmailRegExp: boolean;

	@State() isAsignedTemplate: boolean = false;

	/**It's use to say if the checkbox's files is marked */
	@State() checkedFile: boolean = false;

	@State() recipentNameOptions: IUIInputOption[] = [];
	@State() recipentEmailOptions: IUIInputOption[] = [];

	/* (optional) Indicates if the slider can navigate with labels */
	@State() enableLabelNav: boolean = false;
	@State() checkedCheckbox: boolean;
	@State() isDisabled: boolean = true;
	@State() emailInvalid: boolean;
	/** Stops step 1 to 2 when templates dont serve the condition */
	@State() _goStep: boolean = true;

	@Prop() hasManager: boolean = false;
	@Watch('hasManager') setHasManager(newValue: boolean) {
		this._hasManager = newValue;
	}
	@Prop() downloadTemplateUrl: string;
	@Prop() acceptedFiles: string = '.doc, .docx, .pdf';
	@Prop() allowedSignatures: SignatureTypesEnum[];
	@Prop() allowedSignatureOptions: SignatureOptions[];
	@Prop() loadingImgSrc: string = assetUrl('/assets/images/i-descarga.svg');
	@Prop() asButton: boolean = false;
	@Prop() bodyLimitFile: number = 26214400;
	@Prop() useTemplates: boolean = true;

	/* Nombre de la aplicación que va a crear el envelope */
	@Prop() clientId: string;
	/* Entorno de desarrollo - local, dev, pre, pro */
	@Prop() env: string;
	@Prop() loadOnlyTemplates: boolean = false;
	@Prop() recipentsOptions: RecipientOptions[];
	@Watch('recipentsOptions') setRecipentsOptions(options: RecipientOptions[]) {
		this.recipentsOptions = options;

		this.recipentsOptions.forEach((item) => {
			if (item && (item.envelopeRecipient_name || item.envelopeRecipient_email)) {
				const newRecipentNameOption: IUIInputOption = {
					value: item.envelopeRecipient_name,
					name: item.envelopeRecipient_name,
					secondary: item.envelopeRecipient_email,
					isSelected: false
				};
				const newRecipentEmailOption: IUIInputOption = {
					value: item.envelopeRecipient_email,
					name: item.envelopeRecipient_email,
					secondary: item.envelopeRecipient_name,
					isSelected: false
				};
				this.recipentNameOptions.push(newRecipentNameOption);
				this.recipentEmailOptions.push(newRecipentEmailOption);
			}
		});
	}

	/* Indicates the language that the component will use */
	@Prop() language: Languages = 'es-ES';
	@Watch('language') setLang(language: Languages) {
		this._language = language;
		this.parseLiterals(JSON.stringify(STATIC_LITERALS));
		this.parseSteps(this.steps);
		this.parseRadioRecipientTypes();
		if (this._recipientsList && this._recipientsList.length > 0) {
			this._recipientsList.forEach((_, idx) => {
				this._recipientsList[idx]['typeLabel'] = this._radioRecipientTypes[0]['label'];
				this._recipientsList[idx]['options'] = JSON.parse(JSON.stringify(this._radioRecipientTypes));
			}, this);
		}
	}

	@State() _language: Languages;

	/** Literals used in the component */
	@Prop() literals: LangLiterals | any;

	@Watch('literals') parseLiterals(newLiterals: LangLiterals | string) {
		const literals = _parseProp(newLiterals) as LangLiterals;
		const mergedLiterals = merge({}, STATIC_LITERALS, literals || {});
		this._literals = mergedLiterals[this._language] as Literals;
	}

	@State() _literals: Literals;

	/* Indicates if component is loading */
	@State() _loading: boolean;

	/**@deprecated */
	@Prop() skipHelp: boolean = false;

	/**@deprecated */
	@Prop() helpData: any;

	/** Wizard steps */
	@Prop() steps: string | SignatureStepConfig;

	@Watch('steps') parseSteps(newData: string | SignatureStepConfig) {
		let customSteps: Partial<SignatureStep>[] = defaultSteps;
		const config: SignatureStepConfig = _parseProp(newData);

		if (this.loadOnlyTemplates) {
			customSteps = [];
			customSteps = JSON.parse(newData as string);
		}
		this._steps = customSteps
			.map((step) => {
				const key: SignatureStepType = step.type;
				if (!this.loadOnlyTemplates) {
					const customConfig = config && config[key];
					if (customConfig) {
						merge(step, customConfig);
					}
				}
				if (!this.enableLabelNav && (step.skip || step.block)) {
					this.enableLabelNav = true;
				}
				step['name'] = this._literals.steps[step.type];
				return step;
			})
			.sort((a, b) => a.order - b.order);
	}

	@State() _steps: Partial<SignatureStep>[];

	/** Recipient types options */

	@State() _radioRecipientTypes: RecipientListWithLabel[];
	@State() _radioRecipientTypeCC: RecipientListWithLabel[];

	/* Open modal */
	@Prop() openSignatureModal: boolean;
	@Watch('openSignatureModal') openModal(newData: boolean) {
		if (newData) this._openModal();
	}

	@Prop() currentEnvelope: CurrentEnvelope;
	@Watch('currentEnvelope') getCurrentEnvelope() {
		this.isAsignedTemplate = false;
	}

	/* Open Change Manager Modal */
	@Prop() openManagerModal: boolean;
	@Watch('openManagerModal') openSigManagerModal(newData: boolean) {
		if (newData) {
			this._openSigManagerModal = true;
			this.isDisabled = true;
			this._modalChangeManagerOpen = true;
		}
	}

	@Prop({ reflect: false, mutable: true }) _openSigManagerModal: boolean = false;

	@Listen('eventCancelProcess')
	closeFromModal() {
		if ((this._modalChangeManagerOpen || !this._hasManager) && !this.loadOnlyTemplates) {
			this._handleCloseManagerModal();
		} else {
			this._handleClose();
		}
	}

	@Event() resetSelectInputValue: EventEmitter;
	@Event() resetInputValue: EventEmitter;
	@Event() eventCloseModalFunctionRef: EventEmitter;
	@Event() eventManagerChanged: EventEmitter;
	/** Evento cuando se termina el proceso de la firma */
	@Event() eventFinishSignature: EventEmitter;

	/** Evento cuando se comienza el proceso de la firma */
	@Event() eventStartSignature: EventEmitter;

	/** Evento cuando se cancela el proceso de la firma */
	@Event() eventCloseSignature: EventEmitter;

	@Event() eventManagerModal: EventEmitter;

	/** Evento emitido al crear un envelope */
	@Event() createdEnvelope: EventEmitter;
	/** Evento emitido al enviar correo */
	@Event() sentEnvelope: EventEmitter;
	/** Evento emitido al cerrar la modal */
	@Event() closeSignatureModal: EventEmitter;
	/** Evento emitido para guardar los datos al pasar de step */
	@Event() saveStepEvent: EventEmitter;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		if (!this.asButton) {
			this._openModal();
		}
		// this._modalOpen = !this.asButton;
		this.setLang(this.language);
		this.parseLiterals(this.literals);
		this.parseSteps(this.steps);
		this.setHasManager(this.hasManager);
		this._currentStep = 1;
		this._signatureMessage = {
			subject: undefined,
			message: undefined
		};
		this.validateDaysExpire = false;
		this.validateEmailRegExp = false;
		this._validationRequired();
		this._invalidEmail = new Array(this._recipientsList.length || 0).fill(false);
		this._optionalConfig = new Array(this._recipientsList.length || 0).fill(false);
		this._docAccessCode = new Array(this._recipientsList.length || 0).fill(false);
		if (this.loadOnlyTemplates) {
			this.stepData = {
				signatureType: this._selectedSignatureType,
				recipients: this._recipientsList,
				daysToExpire: this._daysToExpireSiganture,
				template: this.asignedTemplate,
				message: this._signatureMessage
			};
		}
	}
	@Event() eventCreateEnvelopeSuccess: EventEmitter;
	/** Life cycle executed before the first render */
	async componentWillRender() {
		this.eventCloseModalFunctionRef.emit(this.closeModal.bind(this));
		this._isBlockedToCreateEnvelopes = !this.loadOnlyTemplates
			? await EnvelopeService.getIfBlockedCreationOfEnvelopeForCurrentUser(this.env)
			: false;
	}

	componentDidRender() {
		if (this._currentStep === 2 && !this.useTemplates && !this.existData && !this.envelopeDuplicationFinished) {
			this.setEnvelopeDataWhenDuplicateEnvelope();
			this.envelopeDuplicationFinished = true;
		}
	}

	/** Life cycle executed after the first render after loading */
	async componentDidLoad() {
		if (!this._initializateSlider && this._modalOpen) {
			this.initializeSlider();
			this._initializateSlider = true;
		}
	}

	/** Life cycle executed after each render update */
	async componentDidUpdate() {
		if (!this._initializateSlider && this._modalOpen) {
			this.initializeSlider();
			this._initializateSlider = true;
		}

		this._validationRequired();
	}

	parseRadioRecipientTypes(newData?: string | RecipientList[]) {
		const recipients = merge([], defaultRadioRecipientTypes, _parseProp(newData));
		this._radioRecipientTypes = recipients.map((recipient) => {
			recipient['label'] = this._literals.radioRecipientList[recipient.id];
			return recipient;
		});
	}

	closeModal(): void {
		this._openDocusignUI = false;
	}

	getUseCasesFSE(): void {
		/**
		 *!TODO: Añadir una interfaz para las response y que no sean de tipo any
		 * */
		this._useCases = [];
		this._serviceLoading = true;
		EnvelopeService.getUseCasesFSE(this.env)
			.then((res: FSECases[]) => {
				try {
					res.forEach((useCase) => {
						if (useCase.what.includes('CREATEENVELOP')) {
							useCase.how.map((signType) => {
								if (signType.key.search(/\bHOWDPSIGNATURE\b/) >= 0) {
									const createUseCase: string = signType.value;
									this._useCases.push(createUseCase);
								}
							});
							// return true;
						}
					});
				} catch (error) {
					this._emptyPermissions = true;
					throw error;
				}
				if (this._useCases.length > 0) {
					this.getSignatureTypes(this.clientId);
				} else {
					this._emptyPermissions = true;
				}
			})
			.catch((err) => {
				this._serviceLoading = false;

				if (err.code == 100) {
					this._emptyPermissions = true;
				} else {
					this._serviceFailed = true;
				}
				console.error('The fse use cases service has failed. ', err);
			});
	}

	getSignatureTypes(clientId: string): void {
		this._radioSignatureTypes = [];
		EnvelopeService.getSignatureTypes(clientId, this.env)
			.then((res: SignatureTypesBack[]) => {
				try {
					// const allSignaturesAllowed = isEmpty(this.allowedSignatures);
					if (res.length === 0) {
						this._emptyPermissions = true;
					} else {
						this._hasPermissions = false;

						const enableSignature: string[] = [];
						res.map((signature) => {
							if (signature.enabled === true) enableSignature.push(signature.code);
						});
						const useCaseAllowed: boolean[] = this._useCases.map((useCase) => enableSignature.includes(useCase));

						if (!isEmpty(useCaseAllowed) && useCaseAllowed.includes(true)) {
							this._emptyPermissions = false;
							res.forEach((signature) => {
								// const signatureAllowed = (this.allowedSignatures || []).find(item => item === signature.provider_name) !== undefined;

								this._hasPermissions = true;
								(signature.options || []).forEach((option) => {
									option.id = option.key;
									option.label = option.name;
									option.value = option.key;
								});

								const mapped: SignatureTypes = {
									id: signature.id,
									type: signature.provider_name,
									label: this._literals.radioSignatureTypes[signature.provider_name] || signature.name,
									value: signature.id,
									disabled: this._useCases.includes(signature.code) === false || !signature.enabled,
									options: signature.options || []
								};
								if (signature.options) {
									const allOptionsAllowed: boolean = isEmpty(this.allowedSignatureOptions);
									signature.options.forEach((option: SignatureTypesOptions) => {
										if (option.name.toLowerCase() === 'access code') {
											option.label = 'Signature access code';
										}
										const optionAllowed: boolean =
											(this.allowedSignatureOptions || []).find((item) => item === option.key) !== undefined;
										if (allOptionsAllowed || optionAllowed) {
											this._recipientsList.map((recipient) => {
												recipient[option.key] = null;
												recipient.selectedOption = null;
											});
										}
									});
								}
								this._radioSignatureTypes.push(mapped);
							});
							this._selectedSignatureTypeIndex = -1;
						} else {
							this._emptyPermissions = true;
						}
					}
					this._selectedSignatureType = this._radioSignatureTypes[this._selectedSignatureTypeIndex];
				} catch (e) {
					this._serviceFailed = true;
					throw e;
				}
			})
			.catch((err) => {
				this._serviceFailed = true;
				this._radioSignatureTypes.push({
					...defaultRadioSignature,
					label: this._literals.radioSignatureTypes[defaultRadioSignature.type]
				});
				console.error(err);
			})
			.finally(() => {
				this._serviceLoading = false;
				this._loadingChangeModal = false;
				this._recipientsList = [
					{
						id: 0,
						name: '',
						email: '',
						typeId: this._radioRecipientTypes[0]?.id,
						type: this._radioRecipientTypes[0]?.value,
						typeLabel: this._radioRecipientTypes[0]?.label,
						showForm: true,
						options: this._radioRecipientTypes,
						glcs: null,
						cardId: generateRandomId()
					}
				];
				// if (this._selectedSignatureType.type === SignatureTypesEnum.ADEVANCED) {
				// 	this._recipientsList = (this._recipientsList || []).map((recipient) => {
				// 		recipient.selectedOption = 'sms';
				// 		recipient.selectedOption = this._selectedSignatureType.options[0].key;
				// 		recipient.options = this._selectedSignatureType.options;
				// 	});
				// }
				if (this._selectedSignatureType?.type === SignatureTypesEnum.ADEVANCED) {
					(this._recipientsList || []).map((recipient) => {
						recipient.selectedOption = +this._selectedSignatureType.options[0].key;
					});
				}
			});
	}

	async getTemplateById(templateId: string): Promise<void> {
		this._serviceLoading = true;
		this._selectedSignatureTypeIndex = -1;
		if (this.loadOnlyTemplates) {
			this._goStep = false;
		}
		await EnvelopeService.getTemplateById(templateId, this.env)
			.then((res: DocuSignRecipient) => {
				// cambiar por la respuesta de la llamada
				//Hay que tener en cuenta que el template tiene docs vinculados que se van a mostrar en el paso 3
				this._goStep = true;
				const templateSigners: DocuSignSigner[] = res.signers;
				const templateCarbonC: DocuSignSigner[] = res.carbonCopies;

				const signatureEnvelope = this.getSignatureByRecipients(templateSigners);
				this._selectedSignatureTypeIndex = signatureEnvelope === -1 ? 0 : signatureEnvelope;
				this._selectedSignatureType = this._radioSignatureTypes[signatureEnvelope === -1 ? 0 : signatureEnvelope];

				this._radioSignatureTypes.forEach((item) => {
					item.disabled = false;
				});

				if (!isEmpty(templateSigners) || !isEmpty(templateCarbonC)) {
					this._recipientsList = [];
					let recipientToPush: SignerRecipient;

					templateSigners.map((signer) => {
						const signerSubType: DocuSignRecipientSignatureProviders[] = signer.recipientSignatureProviders;

						let selectedOption: number = SignatureOptionsId.SMS;

						if (signerSubType) {
							if (signerSubType[0]?.signatureProviderOptions.oneTimePassword) {
								selectedOption = SignatureOptionsId.ONE_TIME_PASSWORD;
							}

							if (signerSubType[0]?.signatureProviderName == SignatureTypesEnum.ADVANCED_CERTIFICADE) {
								selectedOption = SignatureOptionsId.CERTIFICATED;
							}
						}

						recipientToPush = {
							id: signer.recipientId,
							name: signer.name,
							email: signer.email,
							typeId: RecipientTypes.SIGNER,
							type: 'recipientType01',
							typeLabel: !signer.roleName || signer.roleName === '' ? this._radioRecipientTypes[0].label : signer.roleName,
							showForm: true,
							selectedOption: selectedOption,
							recipientId: this._recipientsList.length,
							oneTimePassword:
								signerSubType && signerSubType[0].signatureProviderOptions.oneTimePassword
									? signerSubType[0].signatureProviderOptions.oneTimePassword
									: '',
							sms:
								signerSubType && signerSubType[0].signatureProviderOptions.sms ? signerSubType[0].signatureProviderOptions.sms : null,
							isTemplate: true,
							position: this._recipientsList.length,
							options: this._radioRecipientTypes,
							cardId: generateRandomId(),
							accessCode: signer.accessCode,
							roleName: signer.roleName
						};
						if (this._selectedSignatureType.id === 4) {
							const qualifiedTypes: string[] = [
								SignatureTypesEnum.QUALIFIED,
								SignatureTypesEnum.QUALIFIED_ID_NOW,
								SignatureTypesEnum.QUALIFIED_SIGNER_HELD_MEXICO
							];

							if (qualifiedTypes.some((item) => item.includes(signer.recipientSignatureProviders[0].signatureProviderName))) {
								recipientToPush.qualifiedType = signer.recipientSignatureProviders[0].signatureProviderName;
							}
						}
						this._recipientsList.push(recipientToPush);
					});
					if (templateCarbonC.length > 0) {
						let carbonCToPush: SignerRecipient;
						templateCarbonC.map((carbonC) => {
							carbonCToPush = {
								id: carbonC.recipientId,
								name: carbonC.name,
								email: carbonC.email,
								typeId: RecipientTypes.CC,
								type: 'recipientType02',
								typeLabel: !carbonC.roleName || carbonC.roleName === '' ? this._radioRecipientTypes[1].label : carbonC.roleName,
								showForm: true,
								isTemplate: true,
								position: this._recipientsList.length,
								options: this._radioRecipientTypes,
								cardId: generateRandomId(),
								accessCode: carbonC.accessCode,
								roleName: carbonC.roleName
							};
							this._recipientsList.push(carbonCToPush);
						});
					}
					this._recipientsList.map((recipient, index) => {
						if (recipient.accessCode && !isEmpty(recipient.accessCode)) {
							this._docAccessCode[index] = true;
						} else {
							this._docAccessCode[index] = false;
						}

						if (
							this._selectedSignatureType.id === 4 &&
							recipient.qualifiedType &&
							recipient.qualifiedType !== SignatureTypesEnum.QUALIFIED
						) {
							this._optionalConfig[index] = true;
						} else {
							this._optionalConfig[index] = false;
						}
					});
					this._docAccessCode = [...this._docAccessCode];
					this._optionalConfig = [...this._optionalConfig];
					this.originalTemplateRecipients = this._recipientsList;
				}

				if (isEmpty(templateSigners)) {
					this.defaultRecipient();
				}

				if (this.loadOnlyTemplates) {
					const filteredRecipients = this._recipientsList.filter((recipient) =>
						recipient.roleName.toLowerCase().includes(RecipientRoles.EMPLOYEE)
					);
					this._recipientsList = [...filteredRecipients];
				}
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				this._serviceLoading = false;
				if (this._goStep && this.loadOnlyTemplates) {
					this.saveStep();
					this._handleNext();
				}
			});
	}

	setEnvelopeDataWhenDuplicateEnvelope(): void {
		if (this._recipientsList[0].name === '' || this._recipientsList[0].email === '') {
			this._recipientsList.shift();

			const { envelopeRecipient } = this.currentEnvelope;
			let recipientToPush: SignerRecipient;
			const radioRecipientOnlyCC: RecipientListOnlyCC[] = [
				{
					id: 'recipient_signer',
					label: 'Signer',
					value: 'recipientType01',
					isChecked: false
				},
				{
					id: 'recipient_cc',
					label: 'Only CC',
					value: 'recipientType02',
					isChecked: true
				}
			];

			envelopeRecipient.forEach((envelope) => {
				if (envelope.type === 'cc') {
					recipientToPush = {
						id: envelope.id,
						name: envelope.name,
						email: envelope.email,
						typeId: RecipientTypes.CC,
						type: 'recipientType02',
						typeLabel: 'Only CC',
						showForm: true,
						isTemplate: false,
						selectedOption: 0,
						position: this._recipientsList.length,
						order: envelope.order,
						options: radioRecipientOnlyCC,
						cardId: generateRandomId()
					};
				} else {
					recipientToPush = {
						id: envelope.id,
						name: envelope.name,
						email: envelope.email,
						typeId: RecipientTypes.SIGNER,
						type: 'recipientType01',
						typeLabel: 'Signer',
						showForm: true,
						isTemplate: false,
						selectedOption: 0,
						glcs: envelope.subsidiary,
						position: this._recipientsList.length,
						order: envelope.order,
						sms: envelope.sms ? envelope.sms : null,
						options: this._radioRecipientTypes,
						cardId: generateRandomId()
					};
				}
				this._recipientsList.push(recipientToPush);
			});
			this._daysToExpireSiganture = this.currentEnvelope.expirationDays;
		}

		const signatureType: string = this.currentEnvelope.signatureTypeId.name;
		let signatureToSelect: number;

		switch (signatureType) {
			case 'Simple':
				signatureToSelect = 0;
				break;
			case 'Advanced':
				signatureToSelect = 1;
				break;
			case 'Qualified':
				signatureToSelect = 2;
				break;
		}
		if (this._recipientsList.length > 1 && this._recipientsList.some((recipient) => recipient.order !== '1')) {
			this._recipientsOrderCheck = true;
		}
		this._selectedSignatureTypeIndex = signatureToSelect;
		this._selectedSignatureType = this._radioSignatureTypes[signatureToSelect];

		this._radioSignatureTypes.forEach((item) => {
			item.disabled = false;
		});
		this._signatureMessage.subject = this.currentEnvelope.emailSubject;
		this._signatureMessage.message = this.currentEnvelope.emailBody;
	}

	defaultRecipient(): void {
		this._radioSignatureTypes.forEach((item) => {
			item.disabled = false;
		});

		this._recipientsList = [
			{
				id: 0,
				name: '',
				email: '',
				typeId: RecipientTypes.SIGNER,
				type: 'recipientType01',
				typeLabel: 'Signer',
				showForm: true,
				selectedOption: 0,
				oneTimePassword: '',
				sms: null,
				isTemplate: false,
				options: this._radioRecipientTypes,
				position: this._recipientsList.length,
				glcs: null,
				cardId: generateRandomId()
			}
		];

		this._selectedSignatureTypeIndex = -1;
		this._selectedSignatureType = this._radioSignatureTypes[0];
		this._glcsInputValues = [];
		this._glcsInputValues = new Array(this._recipientsList.length || 0).fill(null);
		this._glcsOptions = [];
		this._optionalConfig = new Array(this._recipientsList.length || 0).fill(false);
		this._docAccessCode = new Array(this._recipientsList.length || 0).fill(false);
		this._daysToExpireSiganture = '120';
	}

	private getSignatureByRecipients(templateSigners: DocuSignSigner[]): number {
		const listSignature: { name: string; options: SignatureProviderOptions | null }[] = templateSigners.map((item) => {
			const recipientSignatureProviders: DocuSignRecipientSignatureProviders[] = item?.recipientSignatureProviders;
			let signatureProviderName = {
				name: '',
				options: null
			};
			if (recipientSignatureProviders && recipientSignatureProviders.length) {
				signatureProviderName = {
					name: recipientSignatureProviders[0].signatureProviderName,
					options: recipientSignatureProviders[0].signatureProviderOptions
				};
			}
			return signatureProviderName;
		});

		let isCertificate: boolean = listSignature.map((item) => item.name).includes(SignatureTypesEnum.ADVANCED_CERTIFICADE);
		let isAdvanced: boolean = listSignature.map((item) => item.name).includes(SignatureTypesEnum.ADEVANCED);
		let isQualified: boolean = listSignature.map((item) => item.name).includes(SignatureTypesEnum.QUALIFIED);
		let isSimple: boolean = listSignature.map((item) => item.name).includes(SignatureTypesEnum.SIMPLE);
		if (isQualified) {
			return 2;
		}

		if (isAdvanced || isCertificate) {
			return 1;
		}

		if (isSimple) {
			return 0;
		}

		return -1;
	}

	initializeSlider(): void {
		this._slider = tns({
			container: this.$slider,
			items: 1,
			slideBy: 'page',
			controls: false,
			touch: false,
			mouseDrag: false,
			speed: this.speedSlider,
			nav: false,
			autoplay: this.autoplaySlider,
			loop: this.loopSlider
		});
		this._slider.events.on('transitionEnd', () => {
			this._currentStep = this._slider?.getInfo()?.displayIndex;
		});
		this._autoSkipSteps();
		this._loading = false;
	}

	_autoSkipSteps(): void {
		let initialStepIndex: number = 1;
		(this._steps || []).forEach((step) => {
			let skipStep: boolean = false;
			switch (step.type) {
				case SignatureStepType.DOCUMENTATION:
					const files: SignatureStepFiles[] = step.files || [];
					skipStep = (step.skip || step.block) && size(files) > 0;
					if (size(files) === 0) {
						this.enableLabelNav = false;
						step.skip = false;
						step.block = false;
					}
					files.forEach((item) => {
						const { file, url } = base64ToFile(item);
						this._filesUploaded = [...this._filesUploaded, ...[file]];
						this._downloadFilesUrl = [...this._downloadFilesUrl, ...[url]];
					});
					break;
				case SignatureStepType.CONFIGURATION:
					const data = step.data || {};
					skipStep = (step.skip || step.block) && size(data) > 0;
					if (size(data) === 0) {
						step.skip = false;
						step.block = false;
					}
					this._setConfigurationDefaultValues(step.data);
					break;
				case SignatureStepType.CONFIRMATION:
					this._setConfirmationDefaultValues(step.data);
					break;
			}
			if (skipStep) {
				initialStepIndex++;
			}
		});
		this._goToStep(initialStepIndex);
	}

	_setConfigurationDefaultValues(data: ConfigurationOptions): void {
		if (data) {
			const { signatureType, daysToExpire, recipients } = data;
			this._radioSignatureTypes.map((signature) => {
				if (signature.type === signatureType) {
					signature['isChecked'] = true;
					this._selectedSignatureType = signature;
				}
			});
			this._daysToExpireSiganture = (daysToExpire || this._daysToExpireSiganture).toString();
			(recipients || []).forEach((recipient, index) => {
				const { name, email, type } = recipient;
				if (index > 0) {
					this._handleAddRecipient();
				}
				const recipientId: number = (this._recipientsList || []).length - 1;
				if (recipientId > -1) {
					this._recipientsList[recipientId].name = name;
					this._recipientsList[recipientId].email = email;
					const recipientType: RecipientListWithLabel = this._radioRecipientTypes.find((recipient) => recipient.id === type);
					if (recipientType) {
						(this._recipientsList[recipientId].typeId = recipientType.id),
							(this._recipientsList[recipientId].type = recipientType.value),
							(this._recipientsList[recipientId].typeLabel = recipientType.label),
							(this._recipientsList[recipientId].options = this._radioRecipientTypes.map((recipient) => ({
								...recipient,
								isChecked: recipient.id === type
							})));
					}
				}
			});
			this._validationRequired();
		}
	}

	_setConfirmationDefaultValues(data: ConfirmationOptions): void {
		if (data) {
			if (this.asignedTemplate) {
				this._signatureMessage.subject = this.asignedTemplate.subject;
				this._signatureMessage.message = this.asignedTemplate.description;
			} else {
				const { subject, message } = data;
				this._signatureMessage.subject = subject;
				this._signatureMessage.message = message;
			}
		}
	}

	_openModal(): void {
		this._orderRecipientsEnabled = true;
		this._loadingChangeModal = true;
		this._modalOpen = true;
		this._validation = false;
		this._recipientsOrderCheck = false;
		this._resetModal = false;
		this.getUseCasesFSE();
	}

	_handleNext(): void {
		this._doNav('next');
	}

	_handlePrev(): void {
		this._doNav('prev');
	}

	_doNav(direction: string): void {
		const targetStep: number = direction === 'next' ? this._currentStep : this._currentStep - 1;
		const availableSteps: Partial<SignatureStep>[] =
			direction === 'next' ? this._steps.slice(targetStep) : this._steps.slice(0, targetStep).reverse();
		let stepId: number = null;
		availableSteps.some((step) => {
			const canActivate: boolean = this._canActiveStep(step.order);
			stepId = canActivate && step.order;
			return !!stepId;
		});
		if (stepId) {
			if (stepId == 1 && direction == 'prev') {
				this._selectedSignatureTypeIndex = -1;
				this._glcsInputValues = [];
				this._glcsOptions = [];
			}
			this._slider?.goTo(stepId - 1);
		}
		if (this._currentStep === 1) {
			this._invalidEmail = [];
			this.loadTemplateData = true;
		}
	}

	_disableGoBackButton(): boolean {
		let currentStepps: number = this._currentStep;
		const steps: number[] = Array(currentStepps - 1)
			.fill(0)
			.map((_item, index) => index + 1)
			.reverse();
		const hasPreviousStep: boolean = steps.some((step) => this._canActiveStep(step));
		return !hasPreviousStep;
	}

	async _handleFinish(): Promise<void> {
		if (!this.loadOnlyTemplates) {
			this.eventFinishSignature.emit();
			await this.createEnvelopeDraft();
		} else {
			this.saveStep();
			this._resetModal = true;
			this._modalOpen = false;
			this._modalProcessOpen = false;
			this._modalCompleteOpen = false;
			this._serviceFailed = false;
			this.checkedCheckbox = false;
			this._handleAfterCloseReset();
			this.eventCloseSignature.emit();
		}
	}

	_handleClose(): void {
		this.emailInvalid = false;
		if (!this.loadOnlyTemplates) {
			if (this._notSavedEnvelope) {
				this.validateDaysExpire = false;
				this.validateEmailRegExp = false;
				if (this.openManagerModal) {
					this._modalProcessOpen = false;
					this._modalChangeManagerOpen = false;
					this.closeSignatureModal.emit();
					this.checkedCheckbox = false;
					this.resetSelectInputValue.emit();
					this.resetInputValue.emit({ reset: true });
				} else {
					this._modalProcessOpen = true;
				}
			} else {
				this._modalOpen = false;
				this._modalChangeManagerOpen = false;
				this._notSavedEnvelope = true;
				this.checkedCheckbox = false;
				this.resetSelectInputValue.emit();
				this.resetInputValue.emit({ reset: true });
				this._handleAfterCloseReset();
			}
		} else {
			if (this._notSavedEnvelope) {
				this._modalProcessOpen = true;
			}
		}
	}

	_handleCloseManagerModal(): void {
		if (!this._managerSelected) {
			this._modalProcessOpen = false;
			this._modalChangeManagerOpen = false;
			this._managerSelected = false;
			this.eventManagerModal.emit(false);
			this.closeSignatureModal.emit();
		} else {
			this._modalProcessOpen = true;
			this.eventManagerModal.emit(true);
		}
	}

	_handleAfterCloseReset(): void {
		if (this.asButton) {
			this.resetInputValue.emit({ reset: true });
			this._daysToExpireSiganture = '120';
			this._currentStep = 1;
			this._signatureMessage = {
				subject: undefined,
				message: undefined
			};
			this._filesUploaded = [];
			this._downloadFilesUrl = [];
			this.parseSteps(this.steps);
			this._recipientsList = [
				{
					id: 0,
					name: '',
					email: '',
					typeId: this._radioRecipientTypes[0]?.id,
					type: this._radioRecipientTypes[0]?.value,
					typeLabel: this._radioRecipientTypes[0]?.label,
					showForm: true,
					selectedOption: 0,
					sms: null,
					options: this._radioRecipientTypes,
					position: 0,
					glcs: null,
					cardId: generateRandomId()
				}
			];
			this._accordionRecipient(0, false, true);
			this._slider && this._slider.goTo(0);
			this.asignedTemplate = undefined;
			this._modalChangeManagerOpen = false;
			this._openSigManagerModal = false;
			this.isAsignedTemplate = false;
			this.checkedFile = null;
			this._orderRecipientsEnabled = false;
			this._loadingChangeModal = false;
			this._invalidEmail = [];
			this._selectedSignatureTypeIndex = -1;
			this.existData = false;
			this._recipientsOrderCheck = true;
			this._managerSelected = false;
			this._resetModal = true;
			this.loadTemplateData = true;
		}
	}

	async _handleStart(): Promise<void> {
		if (this._openSigManagerModal || !this._hasManager) {
			if (this._openSigManagerModal) {
				this._hasManager = true;
				this._openSigManagerModal = false;
				this._modalChangeManagerOpen = false;
				this._modalOpen = false;
				this.closeSignatureModal.emit();
			} else {
				this._hasManager = true;
				this.initializeSlider();
				this._initializateSlider = true;
				this._modalOpen = true;
			}
			this.resetSelectInputValue.emit();
			this.eventManagerChanged.emit(true);
		} else {
			this.eventStartSignature.emit({ skipHelp: this._checkSkipHelp });
			this._loading = true;
		}
	}

	_handleCheckbox(ev): void {
		this._checkSkipHelp = ev.detail;

		this.checkedCheckbox = ev.detail;
		if (!this.checkedCheckbox) {
			this.isDisabled = true;
		}
	}

	_handleVideoHelp(): void {
		this._helpOpen = false;
		this._videoOpen = !this._videoOpen;
	}

	_handleHelp(): void {
		this._videoOpen = false;
		this._helpOpen = !this._helpOpen;
	}

	_handleCloseAllHelp(): void {
		this._helpOpen = false;
		this._videoOpen = false;
	}

	_handleAddRecipient(): void {
		const index: number = this._recipientsList.length;
		const listRecipient: SignerRecipient[] = [...this._recipientsList];
		const clonedRecipient: SignerRecipient = this._cloneObj(listRecipient[0]);
		clonedRecipient.id = index;
		clonedRecipient.typeId = this._radioRecipientTypes[0].id;
		clonedRecipient.type = this._radioRecipientTypes[0].value;
		clonedRecipient.typeLabel = this._radioRecipientTypes[0].label;
		clonedRecipient.options = this._radioRecipientTypes;
		clonedRecipient.sms = null;
		clonedRecipient.selectedOption = SignatureOptionsId.SMS;
		clonedRecipient.cardId = generateRandomId();
		/*if (this._selectedSignatureType && (this._selectedSignatureType.options || []).length > 0) {
			const option = this._selectedSignatureType.options[0];
			clonedRecipient.selectedOption = option.key;
			clonedRecipient['oneTimePassword'] = null;
			clonedRecipient['sms'] = this._defaultPhonePrefix;
		}*/
		clonedRecipient.showForm = true;
		listRecipient.push(clonedRecipient);
		this._recipientsList = listRecipient;
		this._glcsInputValues.push(null);
		this._hideAccordionRecipient(index);
		this._validationRequired();
		clonedRecipient.isValid = true;
		this._invalidEmail.push(false);
	}

	_cloneObj(obj) {
		if (null == obj || 'object' != typeof obj) {
			return obj;
		}
		if (obj.isQualifiedIDNow) delete obj.isQualifiedIDNow;
		const copy = obj.constructor();
		for (const attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				const t = typeof obj[attr];
				copy[attr] = t == 'object' ? this._cloneObj(obj[attr]) : { string: '', number: 0, boolean: false }[t];
			}
		}
		return copy;
	}

	_handleInputFileType(ev, index): void {
		const filesArray: ICDKMessagesFile[] = [...this._filesUploaded];
		filesArray[index].category = ev.detail;
		this._filesUploaded = filesArray;
	}

	_handleMasiveLoad(): void {
		this._activeMasiveLoad = !this._activeMasiveLoad;
	}

	_hideAccordionRecipient(newRecipientIndex): void {
		this._recipientsList.map((recipient) => {
			if (recipient.id !== newRecipientIndex) {
				this._accordionRecipient(recipient.id, true, true);
			}
		});
	}

	_accordionRecipient(index, all, forceOpen?: boolean): void {
		const recipientArray: SignerRecipient[] = [...this._recipientsList];
		const element = document.getElementById('recipient-content-' + index) as HTMLElement;
		if (forceOpen) {
			recipientArray[index].showForm = true;
			if (element && element.style) {
				element.style.display = 'block';
			}
		} else if (all) {
			recipientArray[index].showForm = false;
			element.style.display = 'none';
		} else {
			if (element.style.display === 'none') {
				recipientArray[index].showForm = true;
				element.style.display = 'block';
			} else {
				recipientArray[index].showForm = false;
				element.style.display = 'none';
			}
		}
		this._recipientsList = recipientArray;
	}

	/** Comprueba si se encuentra en el último paso */
	_isWizardFinish(): boolean {
		const sliderInfo: TinySliderInfo = this._slider?.getInfo();
		return this._currentStep === sliderInfo?.slideCount;
	}

	_goToStep(stepNum): void {
		if (this.enableLabelNav && this._canActiveStep(stepNum)) {
			this._slider.goTo(stepNum - 1);
		}
	}

	_canActiveStep(stepId: number): boolean {
		const step: Partial<SignatureStep> = this._steps.find((step: SignatureStep) => step.order === stepId);
		return step && !step.block;
	}

	_validationRequired(detail?): void {
		if ((this._currentStep === 1 && this._filesUploaded.length > 0) || (this._currentStep === 1 && this.loadOnlyTemplates)) {
			if (!this.loadOnlyTemplates) {
				this._validation = true;
				if (this.isAsignedTemplate) {
					this._signatureMessage.subject = this.asignedTemplate?.subject;
					this._signatureMessage.message = this.asignedTemplate?.description;
				} else if (!this._signatureMessage.subject) {
					this._signatureMessage.subject = `New to sign at Santander CIB - ${this._filesUploaded.length} Document${
						this._filesUploaded.length > 1 ? 's' : ''
					}`;
				}
			} else {
				if (this.asignedTemplate) {
					this._signatureMessage.subject = this.asignedTemplate.subject;
					this._signatureMessage.message = this.asignedTemplate.description;
				}
				this._validation = this.isAsignedTemplate;
			}
		} else if (this._currentStep === 2) {
			if (detail) {
				this._selectedSignatureType = detail.signatureType;
				this._recipientsList = detail.recipientList;
				this._glcsInputValues = detail.glcsList;
				this._daysToExpireSiganture = detail.daysToEspire;
				this._docAccessCode = detail.docAccessCode;

				if (this.loadOnlyTemplates) {
					this.stepData = {
						signatureType: this._selectedSignatureType,
						recipients: this._recipientsList,
						daysToExpire: this._daysToExpireSiganture,
						template: this.asignedTemplate,
						message: this._signatureMessage
					};
				}
			}
			let validateStatus: boolean = true;
			let atLeastOneSigner: boolean = false;
			// let glcsValid = [];
			const _currentSignatureType: SignatureTypesEnum = this._selectedSignatureType?.type;
			if (this._recipientsList?.length > 0) {
				this._recipientsList.map((recipient, _index) => {
					if (
						validateStatus &&
						parseInt(this._daysToExpireSiganture) >= this.minValueExpireDays &&
						parseInt(this._daysToExpireSiganture) <= this.maxValueExpireDays &&
						!isEmpty(recipient.email) &&
						recipient.email.match(this.mailRegExp) &&
						!isEmpty(recipient.name) &&
						(_currentSignatureType === SignatureTypesEnum.ADEVANCED
							? recipient.typeId != RecipientTypes.CC
								? (recipient.selectedOption === SignatureOptionsId.SMS &&
										!isEmpty(recipient.sms) &&
										recipient.sms.length > 4 &&
										recipient.sms != null) ||
								  (recipient.selectedOption === SignatureOptionsId.ONE_TIME_PASSWORD && !isEmpty(recipient.oneTimePassword)) ||
								  recipient.selectedOption === SignatureOptionsId.CERTIFICATED
								: true
							: true) &&
						((this._docAccessCode[_index] && recipient.accessCode) || !this._docAccessCode[_index])
					) {
					} else {
						validateStatus = false;
					}

					if (recipient.typeId === 'recipient_signer') {
						atLeastOneSigner = true;
					}
				});
			} else if (this.loadOnlyTemplates) {
				validateStatus = true;
				atLeastOneSigner = true;
			}

			this._validation = validateStatus && atLeastOneSigner; //&& !glcsValid.some(elem => elem === false);
		} else if (this._currentStep === 3 && this._signatureMessage.subject && this._signatureMessage.subject !== '') {
			if (this._signatureMessage.subject.length > 100 && !this.loadOnlyTemplates) {
				this._validation = false;
			} else {
				this._validation = true;
			}
		} else {
			this._validation = false;
		}
	}

	getRedirectUrl(): string {
		// let url = '';
		// url += (window.location.protocol || 'https:') + '//';
		// url += window.location.host;
		// url += window.location.pathname;
		// url += window.location.search || '';
		// return url;
		return 'https://nodejs.org/dist/latest-v13.x/';
	}

	/** Crear envelope */
	async createEnvelopeDraft(): Promise<void> {
		this.validateDaysExpire = false;
		this.validateEmailRegExp = false;
		this._loading = true;

		let closeFlag: boolean = false;
		this._filesUploaded.forEach((file) => {
			if (Number(file.size) > this.bodyLimitFile) {
				this._errorCreateEnvelopeSizeLimit = true;
				closeFlag = true;
			}
		});

		if (!closeFlag) {
			const docs = await mapFiles(compact(this._filesUploaded || [])).then((res) => {
				res.forEach((it, i) => {
					it.extension = this._filesUploaded[i].extension.replace('.', '');
					it.size = this._filesUploaded[i].formatedSize;
					it.category = this._filesUploaded[i].category;
				});
				return res;
			});

			const document: DocumentBackReqBodyStep2[] = compact(this._filesUploaded || []).map((document, index) => {
				if (document.templateId) {
					return {
						documentId: index + 1,
						templateId: document.templateId
					};
				}
			});

			const body: BodyBase = {
				// status: BackEnvelopeType.Created,
				redirectUrl: this.getRedirectUrl(),
				clientId: this.clientId,
				signatureTypeId: typeof this._selectedSignatureType?.id === 'number' ? this._selectedSignatureType.id : null,
				email: {
					subject: this._signatureMessage.subject || '',
					body: this._signatureMessage.message || ''
				},
				expiresIn: this._daysToExpireSiganture.toString(),
				docs: compact(docs),
				recipients: compact(this._recipientsList),
				//envelopeId, //-> LO DEVUELVE EL SERVICIO DEL STEP1,
				document: compact(document),
				originalTemplateRecipients: this.originalTemplateRecipients,
				recipientsOrderCheck: this._recipientsOrderCheck,
				idTemplate: this.asignedTemplate?.templateId || null
			};

			if (body.docs.length && body.email.subject && body.redirectUrl && body.clientId) {
				await EnvelopeService.createDraftStep(body, this.env)
					.then((res: DraftStep) => {
						this._docusignUrl = res.redirectUrl;
						this._docusignEnvId = res.envelopeId;
						this.eventCloseModalFunctionRef.emit(this.closeModal.bind(this));
						this.createdEnvelope.emit(this._docusignEnvId);
						this._openDocusignUI = true;
						this._notSavedEnvelope = false;
					})
					.catch((err) => {
						this._selectedSignatureTypeIndex = -1;
						if (JSON.parse(err).code !== 120109) {
							this._errorCreateEnvelope = true;
						} else {
							this._serviceFailed = true;
						}
						console.error(err);
					})
					.finally(() => {
						this._loading = false;
					});
			} else {
				this._errorCreateEnvelope = true;
				this._loading = false;
			}
		} else {
			this._loading = false;
		}
	}
	handleIframeReload(): void {
		this.onLoadCount++;
		if (this.onLoadCount > 1) {
			this.closeDocusignUI(true);
			this.eventCloseModalFunctionRef.emit(this.closeModal.bind(this));
			this.createdEnvelope.emit(this._docusignEnvId);
			this.sentEnvelope.emit(true);
			this._modalCompleteOpen = true;
			this.closeSignatureModal.emit();
		}
		// let ifr = document.getElementById('ds_ifr');
		// ifr = (ifr as any).contentWindow || (ifr as any).contentDocument.document || (ifr as any).contentDocument;
		// if (ifr && (ifr as any).location) {
		// 	if (window.location.origin.indexOf((ifr as any).location.hostname)) {
		// 		this.closeDocusignUI(true);
		// 		this.eventCloseModalFunctionRef.emit(this.closeModal.bind(this));
		// 		this.createdEnvelope.emit(this._docusignEnvId);
		// 		this._modalCompleteOpen = true;
		// 	}
		// }
	}

	closeDocusignUI(instant: boolean): void {
		this.onLoadCount = 0;
		this._openDocusignUI = false;
		if (instant) {
			this._docusignUrl = null;
		} else {
			setTimeout(() => {
				this._docusignUrl = null;
			}, 200);
		}
	}

	private _setDataStep2(): void {
		const element = document.getElementById('configuration-step') as HTMLScibCdkSignatureModalConfigurationElement;
		element.sendData();
	}

	private saveStep(): void {
		let id;
		switch (this._currentStep) {
			case 1:
				id = 'iniciation';
				break;
			case 2:
				id = 'development';
				break;
			case 3:
				id = 'finish';
				break;
			default:
				id = 'nonStep';
				break;
		}
		this.saveStepEvent.emit({
			step: this._currentStep,
			idStep: id,
			data: this.stepData
		});
	}

	render() {
		return (
			<Host>
				{this._modalChangeManagerOpen && (
					<scib-cdk-signature-manager-modal
						openModalManager={this._openSigManagerModal && this._modalChangeManagerOpen}
						literals={this._literals.managerModal}
						env={this.env}
						onCloseSignatureManagerModal={() => {
							this._handleCloseManagerModal();
						}}
						onEventManagerHasChanged={({ detail }: CustomEvent) => {
							if (detail) {
								this._handleStart();
								this._errorAssignManager = false;
							} else {
								this._errorAssignManager = true;
								this.closeSignatureModal.emit();
							}
						}}
						onEventLoadingManagers={({ detail }: CustomEvent) => (this._serviceLoading = detail)}
						onEventManagerSelected={($event) => (this._managerSelected = $event.detail)}
					></scib-cdk-signature-manager-modal>
				)}

				{this._isBlockedToCreateEnvelopes && this._hasManager && !this.loadOnlyTemplates ? (
					<scib-molecules-status-modal
						title-modal={this._literals.dialog.noTeamTitle}
						message={this._literals.dialog.noTeamText}
						status="information"
						open={this._modalOpen && this._hasPermissions === true && this._emptyPermissions === false}
						disable-close="true"
					>
						<div slot="actions" class="button-block--modal">
							<scib-atoms-button
								text={this._literals.dialog.noTeamUnderstand}
								type="button"
								size="s"
								onClick={() => {
									this._modalOpen = false;
									this.closeSignatureModal.emit();
								}}
							></scib-atoms-button>
						</div>
					</scib-molecules-status-modal>
				) : !this._hasManager && this._modalOpen && !this._modalChangeManagerOpen && !this.loadOnlyTemplates ? (
					<scib-cdk-signature-manager-modal
						openModalManager={!this._hasManager && this._modalOpen && this.openSignatureModal}
						literals={this._literals.managerModal}
						env={this.env}
						onCloseSignatureManagerModal={() => {
							this._handleCloseManagerModal();
						}}
						onEventManagerHasChanged={($event) => {
							if ($event.detail) {
								this._handleStart();
								this._errorAssignManager = false;
							} else {
								this._errorAssignManager = true;
								this.closeSignatureModal.emit();
							}
						}}
						onEventLoadingManagers={({ detail }: CustomEvent) => (this._serviceLoading = detail)}
						onEventManagerSelected={($event) => (this._managerSelected = $event.detail)}
					></scib-cdk-signature-manager-modal>
				) : (
					<scib-ui-dialog
						is-emitter
						absolute
						mobile-fullscreen
						open={
							(this._modalOpen && this._hasPermissions === true && this._emptyPermissions === false) ||
							(this._modalOpen && this.loadOnlyTemplates)
						}
						style={{ visibility: this._modalOpen ? 'show' : 'hidden' }}
					>
						<div
							class={{
								'cdk-docusign-ui': true,
								'cdk-docusign-ui--active': this._openDocusignUI,
								'cdk-docusign-ui--inactive': this._openDocusignUI != undefined && !this._openDocusignUI
							}}
							style={{ display: this._openDocusignUI ? 'block' : 'none', zIndex: '100' }}
						>
							<div class="cdk-docusign-ui__header" ref={(el) => (this.$docusignUiHeader = el as HTMLElement)}>
								<p>Graphio Envelope Configuration</p>
								<scib-atoms-button
									icon="close"
									size="s"
									level="tertiary"
									variant="icon"
									type="button"
									onClick={() => this.closeDocusignUI(false)}
								></scib-atoms-button>
							</div>
							{this._docusignUrl ? (
								<iframe
									id="ds_ifr"
									src={this._docusignUrl}
									frameborder="0"
									class="cdk-docusign-ui__iframe"
									style={{ height: `calc(100% - ${this.$docusignUiHeader.clientHeight}px)` }}
									onLoad={() => this.handleIframeReload()}
								></iframe>
							) : null}
						</div>
						<section class="cdk-signature-modal">
							{this._loading && (
								<div class="cdk-signature-modal__loading">
									<figure class="cdk-signature-modal__loading-fig">
										<img class="cdk-signature-modal__loading-img" src={assetUrl(this.loadingImgSrc)} alt="Loading..." />
									</figure>
								</div>
							)}
							{((this._hasManager && !this._isBlockedToCreateEnvelopes) || this.loadOnlyTemplates) && (
								<section class="cdk-signature-modal__content">
									<div class="cdk-signature-modal__steps">
										{this._steps.map((step) => (
											<button
												onClick={() => this._goToStep(step.order)}
												class={{
													'cdk-signature-modal__step': true,
													'cdk-signature-modal__step--active': step.order === this._currentStep,
													'cdk-signature-modal__step--back': this._currentStep > step.order
												}}
											>
												{step.order}. {step.name}
											</button>
										))}
									</div>
									<div ref={(el) => (this.$slider = el as HTMLElement)}>
										<div
											class={{
												'cdk-signature-modal__step-container': true,
												'cdk-signature-modal__step-container--min': this._filesUploaded.length > 0,
												'cdk-signature-modal__step-container--active': this._currentStep === 1
											}}
										>
											<scib-cdk-signature-modal-documentation
												literals={this._literals}
												loadOnlyTemplates={this.loadOnlyTemplates}
												acceptedFiles={this.acceptedFiles}
												useTemplates={this.useTemplates}
												// env={this.env}
												filesUploaded={this._filesUploaded}
												downloadFilesUrl={this._downloadFilesUrl}
												reset={this._resetModal}
												onValidationRequiredEvent={() => {
													this._validationRequired();
												}}
												onDocumentationDataEvent={({ detail }: CustomEvent) => {
													this._filesUploaded = detail.filesUploaded;
													this._downloadFilesUrl = detail.downloadFilesUrl;
													this.isAsignedTemplate = detail.isAsignedTemplate;
													this.asignedTemplate =
														detail.asignedTemplate && detail.isAsignedTemplate ? detail.asignedTemplate : null;
													this.checkedFile = detail.checkedFile;

													this.stepData = {
														template: this.asignedTemplate
													};
												}}
											></scib-cdk-signature-modal-documentation>
										</div>

										<div
											class={{
												'cdk-signature-modal__step-container cdk-signature-modal__step-container--min': true,
												'cdk-signature-modal__step-container--active': this._currentStep === 2
											}}
										>
											<scib-cdk-signature-modal-configuration
												id="configuration-step"
												loadOnlyTemplates={this.loadOnlyTemplates}
												downloadTemplateUrl={this.downloadTemplateUrl}
												minValueExpireDays={this.minValueExpireDays}
												maxValueExpireDays={this.maxValueExpireDays}
												mailRegExpString={this.mailRegExpString}
												validateDaysExpire={this.validateDaysExpire}
												validateEmailRegExp={this.validateEmailRegExp}
												isAsignedTemplate={this.isAsignedTemplate}
												asignedTemplate={this.asignedTemplate}
												recipentNameOptions={this.recipentNameOptions}
												recipentEmailOptions={this.recipentEmailOptions}
												modalOpen={this._modalOpen}
												recipentsOptions={this.recipentsOptions}
												emailInvalid={this.emailInvalid}
												validation={this._validation}
												selectedSignatureType={this._selectedSignatureType}
												selectedSignatureTypeIndex={this._selectedSignatureTypeIndex}
												radioRecipientTypes={this._radioRecipientTypes}
												radioSignatureTypes={this._radioSignatureTypes}
												recipientsList={this._recipientsList}
												daysToExpireSiganture={this._daysToExpireSiganture}
												env={this.env}
												language={this._language}
												literals={this._literals}
												glcsInputValues={this._glcsInputValues}
												glcsOptions={this._glcsOptions}
												recipientsOrderCheck={this._recipientsOrderCheck}
												reset={this._resetModal}
												optionalConfig={this._optionalConfig}
												docAccessCode={this._docAccessCode}
												loadTemplateData={this.loadTemplateData}
												onValidationRequiredEvent={(event) => {
													this._validationRequired(event.detail);
												}}
												onConfigurationDataEvent={({ detail }: CustomEvent) => {
													this.recipentNameOptions = detail.recipentNameOptions;
													this.recipentEmailOptions = detail.recipentEmailOptions;
													this._recipientsOrderCheck = detail.recipientsOrderCheck;
													this.emailInvalid = detail.emailInvalid;
													this._selectedSignatureType = detail.selectedSignatureType;
													this.recipentsOptions = detail.recipentsOptions;
													this._radioRecipientTypes = detail.radioRecipientTypes;
													this._radioSignatureTypes = detail.radioSignatureTypes;
													this._recipientsList = detail.recipientsList;
													this._daysToExpireSiganture = detail.daysToExpireSiganture;
													this._selectedSignatureTypeIndex = detail.selectedSignatureTypeIndex;
													this.existData = true;
													this.loadTemplateData = detail.loadTemplateData;
													this.stepData = {
														signatureType: this._selectedSignatureType,
														recipients: this._recipientsList,
														daysToExpire: this._daysToExpireSiganture,
														template: this.asignedTemplate,
														message: this._signatureMessage
													};
													if (this.loadOnlyTemplates) {
														this.saveStep();
													}
												}}
												onResetInputValue={(event) => this.resetInputValue.emit(event)}
											></scib-cdk-signature-modal-configuration>
										</div>
										<div
											class={{
												'cdk-signature-modal__step-container cdk-signature-modal__step-container--min': true,
												'cdk-signature-modal__step-container--active': this._currentStep === 3
											}}
										>
											<scib-cdk-signature-modal-mailing
												loadOnlyTemplates={this.loadOnlyTemplates}
												selectedSignatureType={this._selectedSignatureType}
												daysToExpireSiganture={this._daysToExpireSiganture}
												filesUploaded={this._filesUploaded}
												recipientsList={this._recipientsList}
												literals={this._literals}
												signatureMessage={this._signatureMessage}
												reset={this._resetModal}
												onMailingDataEvent={(ev) => {
													this._signatureMessage = { ...ev.detail };
													this.stepData = {
														message: this._signatureMessage
													};
												}}
												onValidationRequiredEvent={() => {
													this._validationRequired();
												}}
											></scib-cdk-signature-modal-mailing>
										</div>
									</div>

									<footer class="cdk-signature-modal__footer">
										<span class="cdk-signature-modal__require-txt">{this._literals.dialog.requiredLabel}</span>
										<div class="cdk-signature-modal__footer-btns">
											{this._currentStep > 1 ? (
												<scib-atoms-button
													size="m"
													level="secondary"
													variant="icon"
													icon="chevron-left"
													disabled={this._disableGoBackButton()}
													onClick={() => {
														if (!this.isAsignedTemplate) {
															this._setDataStep2();
														}

														this._handlePrev();
													}}
												></scib-atoms-button>
											) : (
												<scib-atoms-button
													class="cdk-signature-modal__footer-btns text-btn"
													text={this._literals.dialog.btnCancel}
													level="secondary"
													variant="basic"
													onClick={() => this._handleClose()}
												></scib-atoms-button>
											)}
											{this._isWizardFinish() ? (
												<scib-atoms-button
													class="cdk-signature-modal__btn-finish text-btn"
													size="m"
													text={
														!this.loadOnlyTemplates
															? (!this.useTemplates && this._literals.dialog.btnDuplicate) ||
															  this._literals.dialog.btnFinish ||
															  '[[btnFinish]]'
															: this._literals.dialog.saveConfig
													}
													disabled={!this._validation}
													onClick={() => this._handleFinish()}
												></scib-atoms-button>
											) : (
												<scib-atoms-button
													class={{
														'cdk-signature-modal__btn-mobile': this._currentStep > 1,
														'text-btn': true
													}}
													size="m"
													text={this._literals.dialog.btnNext || '[[btnNext]]'}
													disabled={!this._validation || (this.checkedFile && !this.isAsignedTemplate)}
													onClick={() => {
														if (this._currentStep === 1 && this.isAsignedTemplate && this.useTemplates) {
															this.getTemplateById(this.asignedTemplate.templateId);
														}

														if (
															this._currentStep === 1 &&
															!this.isAsignedTemplate &&
															this.useTemplates &&
															!this.existData
														) {
															this.defaultRecipient();
														}

														if (this._currentStep === 1 && !this.useTemplates) {
															this.setEnvelopeDataWhenDuplicateEnvelope();
														}
														if (this._currentStep === 2) {
															this._setDataStep2();
														}
														if (this._goStep) {
															this._handleNext();
														}
													}}
												></scib-atoms-button>
											)}
										</div>
									</footer>
								</section>
							)}
						</section>
					</scib-ui-dialog>
				)}
				{(this._serviceLoading ||
					this._modalProcessOpen ||
					this._modalCompleteOpen ||
					this._errorCreateEnvelope ||
					this._errorCreateEnvelopeSizeLimit ||
					this._errorAssignManager ||
					this._emptyPermissions ||
					this._hasPermissions === false ||
					this._serviceFailed === true ||
					this._loadingChangeModal) && (
					<scib-molecules-status-modal
						class="cdk-signature-modal__messages-modal"
						title-modal={
							this._serviceLoading || this._loadingChangeModal
								? this._literals.dialog.modalLoadingMainTitle
								: this._modalCompleteOpen
								? this._literals.dialog.modalCompleteMainTitle
								: this._modalProcessOpen
								? this._literals.dialog.modalProcessMainTitle
								: this._serviceFailed === true
								? this._literals.dialog.modaldownServicesMainTitle
								: this._hasPermissions === false
								? this._literals.dialog.modalAppPermissionsMainTitle
								: this._emptyPermissions
								? this._literals.dialog.modalUserPermissionsMainTitle
								: this._errorCreateEnvelopeSizeLimit
								? this._literals.dialog.modalErrorMainTitleSizeLimit
								: this._errorAssignManager
								? this._literals.dialog.modalErrorMainTitleAssignManager
								: this._errorCreateEnvelope
								? this._literals.dialog.modalErrorMainTitle
								: ''
						}
						message={
							this._serviceLoading || this._loadingChangeModal
								? this._literals.dialog.modalLoadingMessage
								: this._modalCompleteOpen
								? this._literals.dialog.modalCompleteMessage
								: this._modalProcessOpen
								? this._literals.dialog.modalProcessMessage
								: this._serviceFailed === true
								? this._literals.dialog.modaldownServicesMessage
								: this._hasPermissions === false
								? this._literals.dialog.modalAppPermissionsMessage
								: this._emptyPermissions
								? this._literals.dialog.modalUserPermissionsMessage
								: this._errorCreateEnvelopeSizeLimit
								? this._literals.dialog.modalErrorMessageSizeLimit
								: this._errorAssignManager
								? this._literals.dialog.modalErrorMessageAssignManager
								: this._errorCreateEnvelope
								? this._literals.dialog.modalErrorMessage
								: ''
						}
						status={
							this._serviceLoading || this._loadingChangeModal
								? 'loading'
								: this._modalCompleteOpen
								? 'success'
								: this._modalProcessOpen
								? 'attention'
								: this._serviceFailed === true ||
								  this._hasPermissions === false ||
								  this._emptyPermissions ||
								  this._errorCreateEnvelopeSizeLimit ||
								  this._errorAssignManager ||
								  this._errorCreateEnvelope
								? 'error'
								: 'attention'
						}
						open={
							this._serviceLoading ||
							this._modalProcessOpen ||
							this._modalCompleteOpen ||
							this._errorCreateEnvelope ||
							this._errorCreateEnvelopeSizeLimit ||
							this._errorAssignManager ||
							this._emptyPermissions ||
							this._hasPermissions === false ||
							this._serviceFailed === true ||
							this._loadingChangeModal
						}
						disable-close="true"
					>
						{!this._serviceLoading && !this._loadingChangeModal && (
							<div slot="actions" class="cdk-signature-modal__messages-modal--actions">
								<scib-atoms-button
									text={
										this._modalCompleteOpen
											? this._literals.dialog.modalCompleteOnlyBtn || '[[btnClose]]'
											: this._modalProcessOpen
											? this._literals.dialog.modalProcessBtnLeft || '[[btnBack]]'
											: this._serviceFailed === true
											? this._literals.dialog.modaldownServicesBtn
											: this._hasPermissions === false
											? this._literals.dialog.modalAppPermissionsBtn || '[[btnClose]]'
											: this._emptyPermissions || this._errorCreateEnvelopeSizeLimit || this._errorAssignManager
											? this._literals.dialog.modalUserPermissionsBtn || '[[btnClose]]'
											: this._errorCreateEnvelope
											? this._literals.dialog.modalErrorBtn || '[[btnClose]]'
											: ''
									}
									level={this._modalProcessOpen ? 'secondary' : 'primary'}
									onClick={() => {
										if (this._modalCompleteOpen) {
											this.eventCreateEnvelopeSuccess.emit();
										}
										if (!this._modalProcessOpen) {
											if (!this._errorCreateEnvelopeSizeLimit && !this._errorCreateEnvelope) {
												this._modalOpen = false;
											}
											this._modalChangeManagerOpen = false;
											this._modalProcessOpen = false;
											this._modalCompleteOpen = false;
											this._errorCreateEnvelope = false;
											this._errorCreateEnvelopeSizeLimit = false;
											this._errorAssignManager = false;
											this._serviceFailed = false;
											this._handleAfterCloseReset();
											this.eventCloseSignature.emit();
										} else {
											this._modalProcessOpen = false;
											this._modalCompleteOpen = false;
											this._errorCreateEnvelope = false;
											this._errorCreateEnvelopeSizeLimit = false;
											this._errorAssignManager = false;
											this._serviceFailed = false;
											this.eventManagerModal.emit(true);
										}
									}}
								></scib-atoms-button>
								{this._modalProcessOpen && (
									<scib-atoms-button
										text={this._literals.dialog.modalProcessBtnRight || '[[btnClose]]'}
										size="m"
										onClick={() => {
											this.eventManagerModal.emit(false);
											this.closeSignatureModal.emit();
											this._modalOpen = false;
											this._modalChangeManagerOpen = false;
											this._modalProcessOpen = false;
											this._modalCompleteOpen = false;
											this._errorCreateEnvelope = false;
											this._errorCreateEnvelopeSizeLimit = false;
											this._errorAssignManager = false;
											this._serviceFailed = false;
											this.checkedCheckbox = false;
											this.resetSelectInputValue.emit();
											this.resetInputValue.emit({ reset: true });

											this._handleAfterCloseReset();
											this.eventCloseSignature.emit();
										}}
									></scib-atoms-button>
								)}
							</div>
						)}
					</scib-molecules-status-modal>
				)}
			</Host>
		);
	}
}
