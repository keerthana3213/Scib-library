export const mapFiles = async buffer => {
	return tobase64Handler(buffer);
};

const toBase64 = (file, i) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () =>
			resolve({
				name: file.name,
				order: i + 1,
				b64: reader.result.toString().split(',')[1],
			});
		reader.onerror = error => reject(error);
	});
};

const tobase64Handler = async array => {
	const filePathsPromises = [];
	array.forEach((file, i) => {
		filePathsPromises.push(toBase64(file, i));
	});
	return await Promise.all(filePathsPromises);
};
