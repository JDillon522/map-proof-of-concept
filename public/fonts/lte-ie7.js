/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-tree' : '&#xe001;',
			'icon-steps' : '&#xe002;',
			'icon-star3' : '&#xe003;',
			'icon-square' : '&#xe004;',
			'icon-search3' : '&#xe005;',
			'icon-print' : '&#xe006;',
			'icon-pin' : '&#xe007;',
			'icon-mic3' : '&#xe008;',
			'icon-library2' : '&#xe009;',
			'icon-lab' : '&#xe00a;',
			'icon-home2' : '&#xe00b;',
			'icon-graduation' : '&#xe00c;',
			'icon-food3' : '&#xe00d;',
			'icon-dumbbell' : '&#xe00e;',
			'icon-coin' : '&#xe00f;',
			'icon-checkmark3' : '&#xe010;',
			'icon-car' : '&#xe011;',
			'icon-camera' : '&#xe012;',
			'icon-bus' : '&#xe013;',
			'icon-bed' : '&#xe014;',
			'icon-bathroom' : '&#xe015;',
			'icon-arrows_up' : '&#xe016;',
			'icon-arrows_down' : '&#xe017;',
			'icon-aid' : '&#xe018;',
			'icon-Toilets_unisex---Copy' : '&#xe01a;',
			'icon-accessibility2' : '&#xe019;',
			'icon-users' : '&#xe000;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};