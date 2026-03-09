import { ICDKLiterals, ICDKPitchData } from '../models/cdk-pitch-section-data.model';
import { FunctionalComponent, h } from '@stencil/core';

export const CDKPitchSectionDataForm: FunctionalComponent<{
	literals: ICDKLiterals;
	data: ICDKPitchData;
	ext: string;
	focused: boolean;
	onChangeForm: (event: any) => void;
	selectorImage: (info: any) => void;
}> = props => {
	return (
		<div class="c-form">
			<h2>{props.literals.title}</h2>
			<div class="c-form__subtitle">
				<span role="img" class="u-icon icon-clipboard icon-style"></span>
				<span>{props.literals.subtitle}</span>
			</div>
			<form class="c-form__form">
				<div class="c-form__form--cover" /* onClick={() => props.selectorImage({ id: 'coverImage', selectedTemplate: props.data.pitch.selectedTemplate.id })} */>
					<span class="c-cover__title">{props.literals.labelCoverImg}</span>
					{!props.data.pitch.selectedTemplate?.image && (
						<div class={{ 'c-form__form--upload': true, 'c-form__form--cover-focused': props.focused }} aria-label={props.literals.coverBtn}>
							<div class="c-form__form--images">
								<span role="img" class="u-icon icon-image"></span>
								{/* <span role="img" class="u-icon icon-upload"></span> */}
							</div>
						</div>
					)}
					{props.data.pitch.selectedTemplate?.image && (
						<figure>
							<img alt="background pitch" src={props.data.pitch.selectedTemplate.image}></img>
						</figure>
					)}
					<input class="accessibility" type="file" id="coverImage" accept={props.ext} name="coverImage" onChange={e => props.selectorImage({ selected: e })} />
				</div>
				<scib-ui-dropdown
					metadatavalues={false}
					multipleselector="single"
					disabledselector={false}
					idselect="select"
					selecteditem={props.data.pitch.selectedTemplate}
					name="template"
					literals="{}"
					label={props.literals.labelDropdown}
					header={props.literals.placeholderDrop}
					options={JSON.stringify(props.data.templates)}
					onEventFormChange={e => {
						e.preventDefault();
						if (e.detail.value?.id) {
							e.detail.type = 'selectTemplate';
							props.onChangeForm(e.detail);
						}
					}}
				></scib-ui-dropdown>

				<scib-ui-input
					name="name"
					label={props.literals.labelInput}
					placeholder={props.literals.placeholderInput}
					required
					no-icon-right
					charLimit={props.literals.inputLimit}
					charCounter={props.data.pitch.name.length}
					value={props.data.pitch.name}
					multiselect={false}
					onEventFormChange={e => {
						e.preventDefault();
						if (e.detail.value !== props.data.pitch.name) {
							e.detail.type = 'name';
							props.onChangeForm(e.detail);
						}
					}}
				></scib-ui-input>

				<scib-ui-textarea
					nameTxtarea="description"
					labelTxtarea={props.literals.labelTextArea}
					placeholderTxtarea={props.literals.placeholderTextArea}
					required
					charLimit={props.literals.textareaLimit}
					charCounter={props.data.pitch.description.length}
					valueTxtarea={props.data.pitch.description}
					onEventFormChange={e => {
						e.preventDefault();
						e.detail.type = 'description';
						props.onChangeForm(e.detail);
					}}
				></scib-ui-textarea>
				{/* <scib-ui-checkbox
					label={props.literals.labelCheckbox}
					checked={props.data.pitch.private}
					onCheckboxChange={(e: any) => {
						e.preventDefault();
						if (typeof e.detail === 'boolean') {
							const detail = {
								type: 'private',
								value: e.detail,
							};
							props.onChangeForm(detail);
						}
					}}
				></scib-ui-checkbox> */}
			</form>
			<div class="c-form__footernote">
				<small>{props.literals.footNote}</small>
			</div>
		</div>
	);
};
