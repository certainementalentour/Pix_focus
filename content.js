(function() {
	"use strict";

	// préparer l'injection dans le main du DOM - {code à injecter}
	const injection = () => {
		// propriétés de visibilité
		Object.defineProperty(document, "hidden", {
			get: () => false,
			configurable: false,
		});

		Object.defineProperty(document, "visibilityState", {
			get: () => "visible",
			configurable: false,
		});

		// détection document.hasFocus()
		document.hasFocus = () => true;

		// bloquage des éléments activant l'anti-cheat
		const blocked_ev = (e) => e.stopImmediatePropagation();
		[
			"visibilitychange",
			"blur",
			"focusout",
			"mouseleave",
			"pointerleave",
			"mouseout",
			"focus",
			"focusin",
		].forEach(ev => {
			window.addEventListener(ev, blocked_ev, true);
			document.addEventListener(ev, blocked_ev, true);
		});

		// Override de tous les handler  -- mettre à un bloc vide pour 'annuler' la définition de la fonction
		const handler = () => {};

		window.onblur = handler;
		window.onfocus = handler;
		document.onblur = handler;
		document.onfocus = handler;

		// blur(), focus()
		window.blur = handler;  // Une fonction dépréciée mais tjrs présente dans certains frameworks
		window.focus = handler;
		HTMLElement.prototype.blur = handler;
		HTMLElement.prototype.focus = handler;

		// éviter la détection via ralentissement animations (en cas de psychopathes sévères)
		const realRAF = window.requestAnimationFrame;
		window.requestAnimationFrame = function(cb) {
			return realRAF(() => cb(performance.now()));
		};

		// éviter la détection de latence (via timers)
		const realSetTimeout = window.setTimeout;
		window.setTimeout = function(cb, t) {
			return realSetTimeout(cb, 0); // remettre à 0 les timers
		};
	};

	// injecter dans le main world
	const script = document.createElement("script");
	script.textContent = `(${injection})();`;
	document.documentElement.appendChild(script);
	script.remove();

})();
