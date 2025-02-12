document.addEventListener("DOMContentLoaded", () => {
	const canvasList = document.querySelectorAll(".sketchy-line");

	canvasList.forEach((canvas) => {
		const container = canvas.parentElement;

		canvas.width = container.offsetWidth;
		canvas.height = 20;

		const rc = rough.canvas(canvas);
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		rc.line(10, 10, canvas.width - 10, 10, {
			roughness: 1.5, // Neater but still hand-drawn
			stroke: "#fdf6e3",
			strokeWidth: 0.5,
		});
	});
});
