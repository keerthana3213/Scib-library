export interface ICDKDialogProcessLiterals {
	/* Type dialog-process: success, error, attention, loading*/
	typeDialog: string;

	/* Maintitle dialog-process*/
	mainTitle: string;

	/* Message dialog-process*/
	message: string;

	/* Message 2 dialog-process*/
	message2?: string;

	/*Single button literal*/
	onlyBtn?: string;

	/*Invert button styles*/
	invertStyleBtn?: boolean;

	/**Close/Cancel button literal*/
	btnLeft?: string;

	/**Finish button literal*/
	btnRight?: string;

	/**Extra button literal*/
	extraBtn?: string;

	/** User ldapuid */
	ldapUid?: string;
}
