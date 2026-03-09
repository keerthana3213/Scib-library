export const betweenFilter = (headerValue, rowValue) => {
	//filter when is date
	return rowValue >= headerValue[0] && rowValue <= headerValue[1];
};
