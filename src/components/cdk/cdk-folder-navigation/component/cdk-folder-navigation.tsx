import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Method } from '@stencil/core';
import { isEmpty } from 'lodash';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Folder, IECMVBreadcrumb, ILiterals } from '../models/cdk-folder-navigation.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-folder-navigation',
	styleUrl: 'cdk-folder-navigation.scss',
	shadow: false,
	scoped: true
})
export class CDKFolderNavigation {
	/** */
	@Prop({ mutable: true, reflect: true }) assignedTemplateName: string;

	/** */
	@Prop({ mutable: true, reflect: true }) routeText: string;

	/** */
	@State() breadcrumb: IECMVBreadcrumb[];

	/** */
	@Prop({ mutable: true, reflect: false }) breadcrumbText: string;

	/** Cantidad de columnas que quieres tener entre 2-6 */
	@Prop({ reflect: true }) columns: number = 2;

	/**  */
	@Prop({ mutable: true, reflect: false }) emptyState: boolean;

	/** */
	@Prop({ mutable: true, reflect: false }) folder: Folder | string;
	@State() _folder: Folder;
	@Watch('folder') parseFolder(newFolder: Folder | string) {
		this._folder = _parseProp<Folder>(newFolder as string);
		this.onInitFolders();
	}

	@Prop({ mutable: true, reflect: false }) newFolders: Folder[];
	@Watch('newFolders') alocateNewolder() {
		this.alocateNewSubFolders();
	}

	@Prop({ mutable: true }) folderToNavigate: Folder;

	/** Oculta el contenido del slot */
	@Prop({ reflect: true }) hide: boolean;

	/** Propiedad no primitiva (Objeto, Array). Requiere un watch que parsee a un State interno para usarse */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	@Prop({ mutable: true, reflect: false }) clearSelection: boolean = false;
	@Watch('clearSelection') clearTemplateSelection() {
		// this.navigateBreadcrumbs([this.breadcrumb[0]])
		if (this.clearSelection === true) {
			this.assignedTemplateName = null;
		}
	}
	/** */
	@Prop({ mutable: true, reflect: false }) loading: boolean;

	@State() folderArray: string;

	@State() subfolderArray: string[];

	// @State() templateArray

	/** */
	@Prop({ mutable: true, reflect: true }) templateAssigned: boolean = false;

	/** Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente */
	@Prop({ mutable: true, reflect: true }) text: string;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseFolder(this.folder);
	}

	/** Se llama al inicio del componente para recoger las carpetas */
	//llamar al sercicio antes del init folder
	onInitFolders() {
		if (!this._folder && isEmpty(this.folder)) {
			this.emptyState = true;
		} else {
			this.folderToNavigate = this._folder;
			// this.folderArray = JSON.stringify(this._folder);
			this.breadcrumb = [
				{
					name: this.folderToNavigate.nameFolder,
					id: this.folderToNavigate.idFolder,
					tooltip: this.folderToNavigate.nameFolder,
					active: true,
					position: 1,
					indexPosition: [0]
				}
			];
			this.breadcrumbText = JSON.stringify(this.breadcrumb);
			// this.breadcrumbText = `[{"name":"graphio","id":"01","tooltip":"graphio","active":true,"position":1}]`;
			// this.breadcrumb = JSON.parse(this.breadcrumbText);
		}
	}

	addBreadCrumb(idFolder: string, nameFolder: string, indexPosition: number) {
		let isAllReadyInside = false;
		const indexPos: number[] = this.breadcrumb[this.breadcrumb.length - 1].indexPosition;
		indexPos.push(indexPosition);
		this.breadcrumb.some((route: IECMVBreadcrumb) => {
			if (route.id == idFolder) {
				isAllReadyInside = true;
				return true;
			}
			return false;
		});
		if (!isAllReadyInside) {
			this.breadcrumb.forEach((element: IECMVBreadcrumb) => {
				element.active = false;
			});
			const nextPosition: number = this.breadcrumb[this.breadcrumb.length - 1].position + 1;
			const newRoute: IECMVBreadcrumb = {
				name: nameFolder,
				id: idFolder,
				tooltip: nameFolder,
				active: true,
				position: nextPosition,
				indexPosition: indexPos
			};
			this.breadcrumb.push(newRoute);
			this.breadcrumbText = JSON.stringify(this.breadcrumb);
		}
	}

	/**
	 *
	 * @param folderName
	 */
	@Method() async navigateBreadcrumbs(event?: IECMVBreadcrumb[]) {
		const breadcrumbArray: IECMVBreadcrumb[] = event;
		let folders: string[] = [];
		let folderTo: string;
		breadcrumbArray.forEach((folder: IECMVBreadcrumb) => {
			folders.push(folder.id);
			if (folder.active === true) {
				folderTo = folder.id;
			}
		});
		this.breadcrumb = breadcrumbArray;
		this.breadcrumbText = JSON.stringify(this.breadcrumb);
		this.redirectToFolder(folders, folderTo, this._folder);
	}

	/**
	 * Función que navega entre carpetas
	 * @param folderID Id del folder a buscar
	 */
	redirectToFolder(foldersRouter: string[], folderTo: string, folders: Folder) {
		let redirectedFolder: Folder;
		if (this.emptyState) {
			this.emptyState = false;
		}
		if (this._folder.idFolder === folderTo) {
			this.folderToNavigate = this._folder;
		} else {
			redirectedFolder = folders;
			redirectedFolder.subFolders.find((subFolder: Folder) => {
				foldersRouter.some((folderId: string) => {
					if (subFolder.idFolder === folderId) {
						redirectedFolder = subFolder;
						if (redirectedFolder.idFolder !== folderTo) {
							foldersRouter.shift();
							this.redirectToFolder(foldersRouter, folderTo, subFolder);
						} else {
							this.folderToNavigate = subFolder;
						}
						return true;
					}
					return false;
				});
			});
		}
	}

	/**
	 * Función que se encarga de navegar entre el objeto de _folders para encontrar y pintar las carpetas y templates
	 * @param folderName Nombre de la carpeta al que se quiere navegar, ya sea desde la ventana de navegación o desde los breadcrums
	 */
	goToFolder(folderId?: string) {
		const filteredFolderIndex: number = this.folderToNavigate.subFolders.findIndex((folder: Folder) => folder.idFolder === folderId);
		const filteredFolder: Folder = this.folderToNavigate.subFolders[filteredFolderIndex];
		if (filteredFolder && !isEmpty(filteredFolder)) {
			if (filteredFolder.subFolders !== null) {
				if (filteredFolder.subFolders.length === 0) {
					if (filteredFolder.templates === null) {
						//llamar a la función de buscar templates
						this.loading = true;
						this.eventStructureTemplateChanges.emit(filteredFolder.idFolder);
						this.addBreadCrumb(filteredFolder.idFolder, filteredFolder.nameFolder, filteredFolderIndex);
					} else if (filteredFolder.templates.length > 0) {
						this.folderToNavigate = filteredFolder;
						this.addBreadCrumb(filteredFolder.idFolder, filteredFolder.nameFolder, filteredFolderIndex);
					} else {
						this.folderToNavigate = filteredFolder;
						this.emptyState = true;
						this.addBreadCrumb(filteredFolder.idFolder, filteredFolder.nameFolder, filteredFolderIndex);
					}
				} else {
					this.folderToNavigate = filteredFolder;
					this.addBreadCrumb(filteredFolder.idFolder, filteredFolder.nameFolder, filteredFolderIndex);
				}
			} else if (filteredFolder.subFolders === null) {
				//llamar a la función de buscar carpetas
				this.loading = true;
				this.eventStructureFoldersChanges.emit(filteredFolder.idFolder);
				this.addBreadCrumb(filteredFolder.idFolder, filteredFolder.nameFolder, filteredFolderIndex);
			} else {
				this.folderToNavigate = filteredFolder;
				this.emptyState = true;
				this.addBreadCrumb(filteredFolder.idFolder, filteredFolder.nameFolder, filteredFolderIndex);
			}
		} else {
			this.folderToNavigate = filteredFolder;
			this.emptyState = true;
		}
	}

	/**
	 *
	 */
	alocateNewSubFolders() {
		this.recursion(this._folder, 1);
	}

	recursion(folder: Folder, indx: number) {
		const mainFolder = { ...folder };
		const newobj = this.checkAndChange(mainFolder, indx);
		if (!newobj && indx !== this.breadcrumb[this.breadcrumb.length - 1].indexPosition.length)
			this.recursion(mainFolder.subFolders[this.breadcrumb[this.breadcrumb.length - 1].indexPosition[indx]], indx + 1);
		return mainFolder;
	}

	checkAndChange(folder: Folder, indx: number) {
		const arr = this.breadcrumb[this.breadcrumb.length - 1].indexPosition;
		if (arr.length === indx && folder) {
			folder.subFolders = this.newFolders;
			this.goToFolder(folder.idFolder);
			return folder;
		}
		return false;
	}

	/** Descripción del evento */
	@Event() eventStructureFoldersChanges: EventEmitter;
	@Event() eventStructureTemplateChanges: EventEmitter;
	@Event() eventAssignedTemplate: EventEmitter;

	render() {
		return (
			<Host class="cdk-folder-navigation">
				{this.breadcrumb && !this.assignedTemplateName && !this.loading && this.folderToNavigate && (
					<scib-ecmv-breadcrumb
						smallTxt={true}
						tertiary={true}
						breadcrumb={this.breadcrumbText}
						onNavigatorEvents={(e) => {
							const breadcrumbsArray: IECMVBreadcrumb[] = e.detail.breadcrumbArray as IECMVBreadcrumb[];
							this.navigateBreadcrumbs(breadcrumbsArray);
						}}
					></scib-ecmv-breadcrumb>
				)}
				<scib-ui-row
					class={{
						'cdk-folder-navigation--container': true,
						'cdk-folder-navigation--container__loading': this.loading,
						'cdk-folder-navigation--container__assigned': this.assignedTemplateName ? true : false
					}}
				>
					{this.loading ? (
						<scib-ui-loading show={true} animation={true}></scib-ui-loading>
					) : this.emptyState ? (
						<section class="cdk-folder-navigation--empty-state">
							<h3>{this._literals.mainTitle}</h3>
							<p>{this._literals.desc}</p>
						</section>
					) : this.assignedTemplateName ? (
						<section>
							<h3>{this.assignedTemplateName}</h3>
							<p class="breadcrumb">{this.routeText}</p>
						</section>
					) : (
						this.folderToNavigate &&
						(this.folderToNavigate.subFolders.length > 0
							? this.folderToNavigate.subFolders.map((folder) => (
									<scib-ui-column
										colXs={6}
										colMd={6 / this.columns}
										colLg={6 / this.columns}
										class="cdk-folder-navigation--item"
										onClick={() => {
											this.folderToNavigate.subFolders !== null && this.goToFolder(folder.idFolder);
										}}
									>
										<div class="folder--wrapper">
											<div class="folder--wrapper__icon">
												<span role="icon" class="u-icon c-icon icon-folder"></span>
												<span class="icon-text">{folder.nameFolder}</span>
											</div>
											<scib-ui-button
												id={'folder' + folder.idFolder}
												small
												nobackground
												disableMinWidth
												link
												iconLeft={false}
												class="chrevron-button"
											>
												<span role="icon" class="u-icon c-icon icon-chrevron-right"></span>
											</scib-ui-button>
										</div>
									</scib-ui-column>
							  ))
							: this.folderToNavigate.templates &&
							  this.folderToNavigate.templates.length > 0 &&
							  this.folderToNavigate.templates.map((template) => (
									<scib-ui-column
										colXs={6}
										colMd={6 / this.columns}
										colLg={6 / this.columns}
										class="cdk-folder-navigation--item"
										onClick={() => {
											this.clearSelection = false;
											this.assignedTemplateName = template.name;
											const itemHolder: string[] = [];
											this.breadcrumb.map((item) => {
												itemHolder.push(item.name);
											});
											this.routeText = itemHolder.toString().split(',').join(' / ');
											this.eventAssignedTemplate.emit({
												template: template,
												routeText: this.routeText
											});
										}}
									>
										<div class="folder--wrapper">
											<div class="folder--wrapper__icon">
												<span role="icon" class="u-icon c-icon icon-doc"></span>
												<span class="icon-text">{template.name}</span>
											</div>
											<scib-ui-button
												id={template.templateId}
												small
												nobackground
												disableMinWidth
												link
												iconLeft={false}
												class="chrevron-button"
											></scib-ui-button>
										</div>
									</scib-ui-column>
							  )))
					)}
				</scib-ui-row>
			</Host>
		);
	}
}
