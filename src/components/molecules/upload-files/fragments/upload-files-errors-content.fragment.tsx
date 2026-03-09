import { FunctionalComponent, h } from '@stencil/core';
import { ILiterals } from '../models/upload-files.model';

export const MoleculesUploadFilesErrorsContent: FunctionalComponent<{
	maxFileLimit: boolean;
	errorFile: boolean;
	duplicatedFilename: boolean;
	errorSize: boolean;
	literals: ILiterals;
	styleVariant?: string;
	disabled: boolean;
}> = ({ literals, maxFileLimit, errorFile, duplicatedFilename, errorSize, styleVariant, disabled }) => {
	const errorClass = !!styleVariant && styleVariant === 'minimal' ? 'upload-files__error' : 'upload-files__info upload-files__info--error';
	return (
		<div class={{ 'upload-files__message': true }}>
			{!maxFileLimit && !errorFile && !duplicatedFilename && !errorSize && styleVariant === 'standard' && (
				<span class={{ 'upload-files__info': true, 'upload-files__info--disabled': disabled }}>{literals?.fileSelectedText}</span>
			)}
			{maxFileLimit && <span class={errorClass}>{literals?.errorMaxFiles}</span>}
			{errorFile && <span class={errorClass}>{literals?.errorFormat}</span>}
			{duplicatedFilename && <span class={errorClass}>{literals?.errorDuplicate}</span>}
			{errorSize && <span class={errorClass}>{literals?.errorMaxSize}</span>}
		</div>
	);
};
