$(() => {
	const canvas: JQuery<HTMLCanvasElement> = $('canvas');
	const ctx: CanvasRenderingContext2D = canvas[0].getContext('2d');

	const image = new Image();
	image.src = 'img25.jpg';
	image.crossOrigin = "Anonymous";

	image.onload = () => {
		ctx.drawImage(image, 0,0, canvas.width(), canvas.height());

		const imageData: ImageData = ctx.getImageData(0, 0, canvas.width(), canvas.height());

		for (let i = 0; i < imageData.data.length; i += 4)
		{
			const greyVersion = imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]
			imageData.data[i] = greyVersion;
			imageData.data[i+1] = greyVersion;
			imageData.data[i+2] = greyVersion;
		}

		ctx.putImageData(imageData, 0, 0);
		//
		// console.log(imageData);
	}
});