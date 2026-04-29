/*
Final Web Project: Barbershop Website  
Author: Kelsey Torres  
Last Updated: April 29, 2026  
Filename: script.js
*/

document.addEventListener("DOMContentLoaded", () => {

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	).matches;

	/* ================= NAVIGATION ================= */

	const hamburger = document.querySelector(".hamburger");
	const navLinks = document.querySelector(".nav-links");
	const nav = document.querySelector("nav");

	if (hamburger && navLinks) {

		hamburger.addEventListener("click", () => {
			const isOpen = navLinks.classList.toggle("open");
			hamburger.setAttribute("aria-expanded", String(isOpen));

			if (isOpen) {
				navLinks.querySelector("a")?.focus();
			} else {
				hamburger.focus();
			}
		});

		navLinks.addEventListener("click", (e) => {
			if (e.target.tagName === "A") {
				navLinks.classList.remove("open");
				hamburger.setAttribute("aria-expanded", "false");
			}
		});

		document.addEventListener("click", (e) => {
			if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
				navLinks.classList.remove("open");
				hamburger.setAttribute("aria-expanded", "false");
			}
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				navLinks.classList.remove("open");
				hamburger.setAttribute("aria-expanded", "false");
				hamburger.focus();
			}
		});
	}

	/* ================= NAV SCROLL EFFECT ================= */

	if (nav) {
		window.addEventListener(
			"scroll",
			() => {
				nav.classList.toggle("scrolled", window.scrollY > 50);
			},
			{ passive: true }
		);
	}

	/* ================= HERO SLIDER ================= */

	const slides = document.querySelectorAll(".slide");

	if (slides.length > 0 && !prefersReducedMotion) {
		let index = 0;

		setInterval(() => {
			slides[index]?.classList.remove("active");

			index = (index + 1) % slides.length;

			slides[index]?.classList.add("active");
		}, 5000);
	}

	/* ================= FADE-IN ANIMATIONS ================= */

	const fadeEls = document.querySelectorAll(".fade-up");

	if (fadeEls.length > 0) {

		if (prefersReducedMotion || !("IntersectionObserver" in window)) {
			fadeEls.forEach(el => el.classList.add("visible"));
		} else {
			const observer = new IntersectionObserver((entries, obs) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
						obs.unobserve(entry.target);
					}
				});
			}, { threshold: 0.15 });

			fadeEls.forEach(el => observer.observe(el));

			window.addEventListener("beforeunload", () => {
				observer.disconnect();
			});
		}
	}

	/* ================= REVIEWS MARQUEE ================= */

	const track = document.querySelector(".reviews-track");

	if (track && !prefersReducedMotion) {

		const items = Array.from(track.children);

		// Clone once only
		if (!track.dataset.cloned) {
			items.forEach(item => {
				track.appendChild(item.cloneNode(true));
			});
			track.dataset.cloned = "true";
		}

		let position = 0;
		const speed = 0.25;
		let animationId;
		let running = true;

		const animate = () => {
			if (!running) return;

			position -= speed;

			const halfWidth = track.scrollWidth / 2;
			if (Math.abs(position) >= halfWidth) {
				position = 0;
			}

			track.style.transform = `translateX(${position}px)`;

			animationId = requestAnimationFrame(animate);
		};

		const start = () => {
			if (!animationId) {
				running = true;
				animationId = requestAnimationFrame(animate);
			}
		};

		const stop = () => {
			running = false;
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
		};

		start();

		track.addEventListener("mouseenter", stop);
		track.addEventListener("mouseleave", start);

		document.addEventListener("visibilitychange", () => {
			document.hidden ? stop() : start();
		});
	}
});