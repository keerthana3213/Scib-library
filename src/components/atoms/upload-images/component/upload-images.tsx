import { ImageFiles, ImageData, ImagesData, ALLOWED_FILE_TYPES } from '../models/upload-images.model';
import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { first, get } from 'lodash';

/**
 * Component description
 *
 * @slot content - Header title slot
 */
@Component({
	tag: 'scib-atoms-upload-images',
	styleUrl: 'upload-images.scss',
	shadow: true
})
export class AtomsUploadImages {
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ attribute: 'id' }) _id: string;

	/**
	 *
	 */
	@Prop() maxItems: number = 1;

	/**
	 *
	 */
	@Prop() shape: 'round' | 'square' = 'square';

	/**
	 * Max size in bytes
	 */
	@Prop() maxSize: number = 3145728;

	/**
	 *
	 */
	@Prop() errorFormatMessage: string;

	/**
	 *
	 */
	@Prop() errorMaxSizeMessage: string;

	/**
	 *
	 */
	@Prop() defaultImages: string;

	/**
	 *
	 */
	@State() _images: ImagesData = [];

	/**
	 *
	 */
	@State() _inputFields: boolean[];

	/**
	 *
	 */
	@State() _errorSize: boolean;

	/**
	 *
	 */
	@State() _errorFile: boolean;

	/**
	 *
	 */
	@State() _loading: boolean;

	/**
	 *
	 */
	@State() _counter: number = 0;

	/***
	 *
	 */
	@Watch('_images') emitImages(images: any[]) {
		this.loadedImages.emit(images);
	}

	/**
	 *
	 */
	@Event() loadedImages: EventEmitter<any>;

	/**
	 *
	 */
	@Event() uploadClick: EventEmitter<ImageFiles>;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._inputFields = new Array(this.maxItems || 0).fill(false);
		if (this.defaultImages) {
			let externalImages: ImagesData | any;
			try {
				externalImages = JSON.parse(this.defaultImages);
			} catch (error) {
				externalImages =
					this.defaultImages.includes('https://') || this.defaultImages.includes('http://') ? [{ base64: this.defaultImages }] : [];
			}

			if (externalImages && externalImages.length) {
				this._images = [...externalImages];
			}
		}
	}

	/**
	 *
	 */
	componentDidRender() {
		this._previewImage();
	}

	/**
	 *
	 * @param file
	 */
	private _getBase64(file: Blob): Promise<any> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	/**
	 *
	 */
	private _previewImage() {
		if ((this._images || []).length) {
			this._images.forEach((image: ImageData | any, index) => {
				const targetElement = this._hostRef.shadowRoot.getElementById(`${this._id}-image-${index}`) as HTMLImageElement;
				targetElement['src'] = get(image, 'base64');
			});
		}
	}

	/**
	 *
	 * @param index
	 */
	handleDeleteImage(index: number) {
		this._inputFields[index] = false;
		this._images.splice(index, 1);
		this._images = [...this._images];
	}

	/**
	 *
	 * @param files
	 * @param index
	 */
	async onSelectFile(files: File[], index: number) {
		this._loading = true;
		this._errorFile = false;
		this._errorSize = false;
		this._inputFields[index] = true;
		this._counter++;
		const errorMessageDuration = 7000;
		const file = first(files);
		if (file) {
			if (!this._checkFileType(get(file, 'type'))) {
				this._errorFile = true;
				setTimeout(() => (this._errorFile = false), errorMessageDuration);
				this._loading = false;
				return false;
			}
			if (this._checkFileSize(get(file, 'size'))) {
				this._errorSize = true;
				setTimeout(() => (this._errorSize = false), errorMessageDuration);
				this._loading = false;
				return false;
			}
			const base64File = await this._getBase64(file);
			if (files && !this._errorFile && !this._errorSize) {
				const images: ImageData = {
					fieldname: 'image-' + this._counter,
					originalname: get(file, 'name'),
					lastmodified: get(file, 'lastModified'),
					mimetype: get(file, 'type'),
					size: get(file, 'size'),
					base64: base64File
				};
				const images_ = [...this._images, images];
				this._images = images_;
				this._inputFields[index] = false;
				this._loading = false;
			}
		}
		this._loading = false;
	}

	/**
	 *
	 * @param size
	 */
	private _checkFileSize(size: number): boolean {
		return size > this.maxSize;
	}

	/**
	 *
	 * @param type
	 */
	private _checkFileType(type: string): boolean {
		return !!type.match(ALLOWED_FILE_TYPES);
	}

	/**
	 * Maneja el click para acceder a la modal
	 * @param idElem
	 */
	handleClick(id: string) {
		if (id) {
			this._hostRef.shadowRoot.getElementById(id).click();
		}
		this.uploadClick.emit({ id });
	}

	render() {
		return (
			<Host>
				<div class="title">
					<slot />
				</div>
				<div class="upload-images">
					{this._inputFields.map((item, index) => (
						<section
							class={{
								'upload-images__container': true,
								'upload-images__container--square': this.shape === 'square',
								'upload-images__container--round': this.shape === 'round',
								'upload-images__container--delete': !!this._images[index]
							}}
							id={`${this._id}-section-${index}`}
						>
							{item && this._loading && !this._errorFile && !this._errorSize && (
								<div class="upload-images__loading">
									<scib-atoms-loading></scib-atoms-loading>
								</div>
							)}
							{this._images[index] ? (
								<figure onClick={() => this.handleDeleteImage(index)}>
									<img id={`${this._id}-image-${index}`} src=""></img>
									<div class="upload-images__delete">
										<i class="icon" />
									</div>
								</figure>
							) : (
								<div
									class={{
										'upload-images__container--internal': true,
										'upload-images__container--disabled': index > 0 && this._images[index - 1] === undefined,
										'upload-images__container--loading': item && this._loading && !this._errorFile && !this._errorSize
									}}
								>
									<i class="icon" />
									{!this._loading && (index === 0 || this._images[index - 1] !== undefined) && (
										<scib-atoms-button
											size="s"
											icon="upload"
											variant="icon"
											onClick={() => this.handleClick(`${this._id}-${index}`)}
										>
											<input
												class="accessibility"
												type="file"
												id={`${this._id}-${index}`}
												accept={ALLOWED_FILE_TYPES}
												onClick={($event) => (($event.target as HTMLInputElement).value = null)}
												onChange={($event: any) => this.onSelectFile($event.target.files, index)}
											/>
										</scib-atoms-button>
									)}
								</div>
							)}
						</section>
					))}
				</div>
				{this._errorFile && <span class="upload-images__error">{this.errorFormatMessage}</span>}
				{this._errorSize && <span class="upload-images__error">{this.errorMaxSizeMessage}</span>}
			</Host>
		);
	}
}
