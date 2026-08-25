window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-mode-scroll",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		/**
		 * Mode-selector menu UX: when the agent-preset picker opens, keep only
		 * the first 4 rows (the built-in modes) visible and let the remaining
		 * custom modes reveal by natural wheel scroll — no forced paging.
		 */
		function apply(ctx) {
			try {
				if (typeof document === "undefined" || typeof window === "undefined") return;

				var handled = new WeakSet();

				function isTrigger(el) {
					if (!el || el.nodeType !== 1) return false;
					var c = typeof el.className === "string" ? el.className : "";
					return c.indexOf("cubgiG_seat") >= 0 || c.indexOf("_5QVD0a_selector") >= 0;
				}
				function agentPresetOpen() {
					var els = document.querySelectorAll('[aria-haspopup="menu"][aria-expanded="true"]');
					for (var i = 0; i < els.length; i++) if (isTrigger(els[i])) return true;
					return false;
				}
				function enhance(menu) {
					if (!menu || menu.nodeType !== 1 || menu.getAttribute("role") !== "menu") return;
					if (!agentPresetOpen()) return;
					if (handled.has(menu)) return;
					var items = menu.querySelectorAll('[role="menuitem"]');
					if (items.length <= 4) return;
					handled.add(menu);
					menu.setAttribute("data-mode-scroll", "1");
					var kids = menu.children;
					for (var i = 0; i < kids.length; i++) {
						kids[i].style.setProperty("overflow-y", "visible");
						kids[i].style.setProperty("max-height", "none");
					}
					var s = menu.style;
					s.setProperty("overflow-y", "auto");
					s.setProperty("overscroll-behavior", "contain");
					window.setTimeout(function () {
						try {
							var scRect = menu.getBoundingClientRect();
							var top = items[0].getBoundingClientRect().top - scRect.top;
							var bottom = items[3].getBoundingClientRect().bottom - scRect.top;
							var pb = parseFloat(window.getComputedStyle(menu).paddingBottom) || 0;
							s.setProperty("max-height", (Math.round(bottom + pb + 2)) + "px");
						} catch (e) { /* menu already closed */ }
					}, 80);
				}
				function scan() {
					if (!agentPresetOpen()) return;
					var menus = document.querySelectorAll('[role="menu"]');
					for (var i = 0; i < menus.length; i++) enhance(menus[i]);
				}
				var pendingScan = false;
				function scheduleScan() {
					if (pendingScan) return;
					pendingScan = true;
					window.setTimeout(function () { pendingScan = false; scan(); }, 60);
				}
				var root = document.body || document.documentElement;
				if (!root) return;
				var mo = new MutationObserver(function () { scheduleScan(); });
				mo.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-expanded"] });
				scan();
				if (ctx && typeof ctx.effect === "function") {
					ctx.effect(function () { return function () { mo.disconnect(); }; });
				}
			} catch (e) { /* keep the page resilient */ }
		}

		exports.apply = apply;
		return module.exports;
	}
});
