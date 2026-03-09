import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-video',
	styleUrl: 'cdk-video.scss',
	shadow: false,
	scoped: false,
})
export class CDKVideo {
	/** Título de la vista */
	@Prop() mainTitle: string;

	/** Ruta de la imagen de carga */
	@Prop() imgSrc: string;

	/** Texto alternativo de la imagen */
	@Prop() imgAlt: string;

	/** Video */
	@Prop() srcVideo: { src: string; type: string }[] | string;

	/** Descripción del Video */
	@Prop() videoDescription: string;

	/** Muestra los controles del video (por defecto, true) */
	@Prop() controls: boolean = true;

	/** Indica si el video se vuelve a reproducir al terminar (por defecto, false) */
	@Prop() loop: boolean = false;

	/** Indica si el video se reproduce automáticamente (por defecto, false) */
	@Prop() autoplay: boolean = false;

	/** Parseo de las strings del Video */
	@Watch('srcVideo') srcVideoChange(newVal: { src: string; type: string }[] | string) {
		this._srcVideo = _parseProp(newVal);
	}

	@State() _srcVideo: { src: string; type: string }[];

	_autoplay = false;
	_mute = true;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.srcVideoChange(this.srcVideo);
		this._autoplay = this.autoplay;
		this._mute = false;
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	render() {
		return (
			<section class="cdk-video">
				<div class="cdk-video__titles" innerHTML={this.mainTitle}></div>
				<video class="cdk-video__video" controls={this.controls} loop={this.loop} autoplay={this._autoplay} muted={this._mute}>
					{this._srcVideo.map(video => (
						<source src={video.src} type={'video/' + video.type}></source>
					))}
					<img src={this.imgSrc} alt={this.imgAlt} />
				</video>
				<p class="accessibility" innerHTML={this.videoDescription}></p>
			</section>
		);
	}
}
