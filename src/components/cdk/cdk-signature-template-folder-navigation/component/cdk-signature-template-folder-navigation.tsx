import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element, Method } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Folder, Literals, SelectedTemplate, Template } from '../models/cdk-signature-template-folder-navigation.model';
import { EnvelopeService } from '../services/envelope.service';
import { isEmpty } from 'lodash';

/**
 * Get docusign template.
 *
 */
@Component({
	tag: 'scib-cdk-signature-template-folder-navigation',
	styleUrl: 'cdk-signature-template-folder-navigation.scss',
	shadow: false,
	scoped: false
})
export class CdkSignatureTemplateFolderNavigation {
	$folderNav: HTMLScibCdkFolderNavigationElement;

	@Element() _hostRef: HTMLElement;

	@Prop({ reflect: true }) literals: Literals | any;
	@State() _literals: Literals;
	@Watch('literals') parseLiterals(newLiterals: Literals | any) {
		this._literals = newLiterals;
	}

	@State() _routeText: string = '';
	@State() _newFolders: Folder[] = [];
	@State() _clearFolderSelection: boolean = false;
	@State() _asignedTemplate: Template;
	@State() _isFolderEmpty: boolean = true;
	@State() _loadingFolder: boolean;
	@State() _serviceFailed: boolean;

	@State() _folder: Folder;
	@Event() selectedTemplateEvent: EventEmitter<SelectedTemplate>;

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.resetNavigation();
	}

	@Method() async reset(): Promise<void> {
		this.clearFolder(true);
		this._newFolders = [];
		this._isFolderEmpty = true;
		this.resetNavigation();
	}

	@Method() async clearFolder(clear: boolean): Promise<void> {
		if (clear) {
			this._clearFolderSelection = true;
			this._routeText = '';
			this._asignedTemplate = null;
		} else {
			this._clearFolderSelection = false;
		}
	}

	@Method() async resetNavigation(): Promise<void> {
		this.setInitFolder();
		this.initStateBreadcrumbs();
		this.getFolders();
	}

	initStateBreadcrumbs() {
		if (this.$folderNav) {
			this.$folderNav.navigateBreadcrumbs([
				{
					name: this._folder.nameFolder,
					id: this._folder.idFolder,
					tooltip: this._folder.nameFolder,
					active: true,
					position: 1,
					indexPosition: [0]
				}
			]);
		}
	}

	getFolders(): void {
		this._loadingFolder = true;
		EnvelopeService.getFolderList()
			.then((res: Folder[]) => {
				this._isFolderEmpty = isEmpty(res);
				this.setInitFolder();
				this._folder.subFolders = res;
				this._folder = { ...this._folder };
			})
			.catch((err) => {
				this._serviceFailed = true;
				console.error(err);
			})
			.finally(() => {
				this._loadingFolder = false;
			});
	}

	getFolderById(id: string): void {
		this._loadingFolder = true;
		EnvelopeService.getFolderById(id)
			.then((res: Folder[]) => {
				this._isFolderEmpty = isEmpty(res);
				this._newFolders = res;
			})
			.catch((err) => {
				this._serviceFailed = true;
				console.error(err);
			})
			.finally(() => {
				this._loadingFolder = false;
			});
	}

	emitTemplate() {
		this.selectedTemplateEvent.emit({
			asignedTemplate: this._asignedTemplate
		});
	}

	private setInitFolder() {
		this._folder = {
			idFolder: '0',
			nameFolder: 'Apps',
			subFolders: [],
			templates: null
		};
	}

	render() {
		return (
			<Host>
				<scib-cdk-folder-navigation
					class="cdk-signature-folder-navigation"
					ref={(el) => (this.$folderNav = el as HTMLScibCdkFolderNavigationElement)}
					literals={this._literals}
					clearSelection={this._clearFolderSelection}
					columns={2}
					assignedTemplateName={this._asignedTemplate ? this._asignedTemplate.name : null}
					routeText={this._routeText}
					loading={this._loadingFolder}
					emptyState={this._isFolderEmpty}
					folder={this._folder}
					newFolders={this._newFolders}
					onEventStructureFoldersChanges={(event: CustomEvent) => {
						this.getFolderById(event.detail);
					}}
					onEventAssignedTemplate={(e: CustomEvent) => {
						this._asignedTemplate = e.detail.template;
						this._routeText = e.detail.routeText;
						this._clearFolderSelection = false;
						this.emitTemplate();
					}}
				></scib-cdk-folder-navigation>
			</Host>
		);
	}
}
