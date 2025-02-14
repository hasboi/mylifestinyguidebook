// aku tahu kodeku sangat berantakan...

document.addEventListener("DOMContentLoaded", () => {
	const initializeSketchyBorder = (button, isCircle = false) => {
		const canvas = document.createElement("canvas");
		button.style.position = "relative";
		canvas.style.position = "absolute";
		canvas.style.top = "0";
		canvas.style.left = "0";
		canvas.style.pointerEvents = "none";
		button.appendChild(canvas);

		const resizeCanvas = () => {
			canvas.width = button.offsetWidth + 20;
			canvas.height = button.offsetHeight + 20;
			canvas.style.top = `-${10}px`;
			canvas.style.left = `-${10}px`;
		};

		const drawBorder = () => {
			const rc = rough.canvas(canvas);
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			let borderColor = "black";
			let strokeWidth = 1;

			if (button.classList.contains("landing-button")) {
				borderColor = "white";
				strokeWidth = 2;
			}

			if (isCircle) {
				const centerX = canvas.width / 2;
				const centerY = canvas.height / 2;
				const radius = Math.min(button.offsetWidth, button.offsetHeight) / 2;
				rc.circle(centerX, centerY, radius * 2, {
					roughness: 1.5,
					stroke: borderColor,
					strokeWidth: strokeWidth,
				});
			} else {
				rc.rectangle(10, 10, button.offsetWidth, button.offsetHeight, {
					roughness: 1.5,
					stroke: borderColor,
					strokeWidth: strokeWidth,
				});
			}
		};

		resizeCanvas();
		drawBorder();

		let hoverInterval;
		button.addEventListener("mouseenter", () => {
			hoverInterval = setInterval(drawBorder, 100);
		});

		button.addEventListener("mouseleave", () => {
			clearInterval(hoverInterval);
		});

		const resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
			drawBorder();
		});
		resizeObserver.observe(button);
	};

	const sketchyButtons = document.querySelectorAll(".sketchy-button");
	sketchyButtons.forEach((button) => initializeSketchyBorder(button));

	const sketchyCircleButtons = document.querySelectorAll(
		".sketchy-circle-button"
	);
	sketchyCircleButtons.forEach((button) =>
		initializeSketchyBorder(button, true)
	);
});

document.addEventListener("DOMContentLoaded", () => {
	const initCanvasAnimation = (canvasId, isPlanetScene = false) => {
		const canvas = document.getElementById(canvasId);
		const rc = rough.canvas(canvas);
		let animationInterval;

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const isMobile = window.innerWidth < 768;

		const starCount = isMobile
			? isPlanetScene
				? 80
				: 50
			: isPlanetScene
			? 200
			: 250;
		const starStrokeWidth = isMobile ? 0.5 : 1.5;

		const stars = Array.from({ length: starCount }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			size: Math.random() * 1 + 4,
		}));

		let planetCenterX, planetCenterY, planetRadius;
		if (isPlanetScene) {
			planetCenterX = isMobile ? canvas.width * 0.85 : canvas.width * 0.75;
			planetCenterY = isMobile ? canvas.height * 0.2 : canvas.height / 2;
			planetRadius = canvas.width * 0.1;
		}

		const isStarInsidePlanet = (starX, starY) => {
			if (!isPlanetScene) return false;
			const distance = Math.sqrt(
				Math.pow(starX - planetCenterX, 2) + Math.pow(starY - planetCenterY, 2)
			);
			return distance < planetRadius;
		};

		const validStars = stars.filter(({ x, y }) => !isStarInsidePlanet(x, y));

		const drawScene = () => {
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			validStars.forEach(({ x, y, size }) => {
				rc.circle(x, y, size, {
					fill: "#ffeb9e",
					fillStyle: "solid",
					stroke: "none",
					strokeWidth: starStrokeWidth,
					roughness: 1.5,
				});
			});
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (!animationInterval) {
							animationInterval = setInterval(drawScene, 100);
						}
					} else {
						clearInterval(animationInterval);
						animationInterval = null;
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(canvas);
	};

	initCanvasAnimation("planet-canvas", true);
	initCanvasAnimation("stars-canvas", false);
});
