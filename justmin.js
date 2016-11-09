var window = window;
	window.tick = 50;
	window.time = 0;

	window.load = function (update) {
		window.onmousedown = update;
		window.onmousemove = update;
		window.onmouseup = update;
		window.on.tick = update;
	}

	window.on = {
		set tick (update) {
			window.setInterval (function () {
				window.time += window.tick;
				update ({type: 'tick'});
			}, window.tick);
		}
	}

var canvas = window.document.createElement ('canvas');

	canvas.css = function () {
		canvas.style.left = 0;
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
	}

	canvas.load = function () {
		canvas.css ();
		canvas.resize ();
		window.document.body.appendChild (canvas);
	}

	canvas.resize = function () {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
	}

var context = canvas.getContext ('2d');

var app = {
	a: {},

	create: {
		animation: function (_) {
			let animation = app.create.sprite (_);
				animation.a = _.a || [new Image()];
				animation.delay = _.delay || window.delay;
				animation.step = _.step || 0;
				animation.stop = _.stop || false;
				animation.time = _.time || window.time;

				animation.animate = function () {
					if (!animation.stop) {
						if (window.time - animation.time >= animation.delay) {
							animation.time = window.time;
							animation.step = (animation.step >= animation.a.length - 1) ? 0 : animation.step + 1;
							animation.i = animation.a[animation.step];
							animation.redraw = 1;
						}
					}
				}

				animation.tick = function () {
					animation.animate ();
				}

			return animation;
		},

		box: function (_) {
			let box = app.create.object (_);
				box.fill = _.fill || 'transparent';
				box.z = _.z || 0;

				box.draw = function () {
					context.fillStyle = box.fill;
					context.fillRect (box.x, box.y, box.w, box.h);
				}

				box.move = function (x, y) {
					app.zen (box);
					box.x = x;
					box.y = y;
				}

			return box;
		},

		button: function (_) {
			let button = app.create.sprite (_);
				button.action = _.action || function () {};
				button.active = false;
				button.in = _.in || function () {};
				button.out = _.out || function () {};

				button.activate = function (event) {
					if (app.get.pinbox ({ x: event.x, y: event.y }, button)) {
						if (!button.active) {
							button.active = true;
							window.document.body.style.cursor = 'pointer';
						}
					} else {
						if (button.active) {
							button.active = false;
							window.document.body.style.cursor = 'default';
						}
					}
				}

				button.click = function (event) {
					if (app.get.pinbox ({ x: event.x, y: event.y }, button)) {
						button.action ();
					}
				}

				button.mousedown = function (event) {
					button.click (event);
				}

				button.mousemove = function (event) {
					button.activate (event);
				}

			return button;
		},

		link: function (_) {
			let link = app.create.text (app.create.button (_));
			return link;
		},

		object: function (_) {
			let object = _ || {};
				object.id = _.id || app.id++;

				object.load = function () {
					app.object[object.id] = object;
				}

			return object;
		},

		sprite: function (_) {
			let sprite = app.create.box (_);

				sprite.i = _.i || new Image ();

				sprite.draw = function () {
					context.drawImage (sprite.i, sprite.x, sprite.y, sprite.w, sprite.h);
				}

			return sprite;
		},

		text: function (_) {
			let text = app.create.box (_);
				text.color = _.color || '#000';
				text.font = _.font || 'Arial';
				text.h = _.h || _.size;
				text.size = _.size || '12';
				text.text = _.text;
				text.w = app.get.font.width (text);

				text.draw = function () {
					if (text.fill != 'transparent') {
						context.fillStyle = text.fill;
						context.fillRect (text.x, text.y, app.get.font.width (text), text.size);
					}

					context.fillStyle = text.color;
					context.font = text.size + 'px ' + text.font;
					context.textBaseline = 'top';
					context.fillText (text.text, text.x, text.y);
				}

			return text;
		}
	},

	draw: function (anyway) {
		let render = {};

		if (anyway) { delete app.render; }

		for (let id in app.object) {
			if (app.object[id].z != undefined) {
				if (render[app.object[id].z] == undefined) { render[app.object[id].z] = {}; }
				render[app.object[id].z][id] = app.object[id];
			}
		}


		for (let z in render) {
			for (let id in render[z]) {
				if (app.render == undefined) { app.render = {}; }
				if (app.render[z] == undefined) { app.render[z] = {}; }
				if (app.render[z][id] == undefined) { app.render[z][id] = {}; }

				if (app.get.hash (render[z][id]) != app.render[z][id]) {
					render[z][id].redraw = 0;
					render[z][id].draw ();
					app.render[z][id] = app.get.hash (render[z][id]);
				}
			}
		}
	},

	get: {
		a: function (list) {
			for (let name in list) {
				app.a[name] = [];
				for (let i = 0; i < list[name]; i++) {
					let image = new Image ();
						image.src = 'data/' + name + ' ' + i + '.png';
						app.a[name].push (image);
				}
			}
		},

		binbox: function (a, b) {
			return ((Math.abs (a.x - b.x + 0.5 * (a.w - b.w)) < 0.5 * Math.abs (a.w + b.w)) &&
								(Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) < 0.5 * Math.abs (a.h + b.h)));
		},

		clone: function clone(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    let copy = obj.constructor();
		    for (let attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		},

		font: {
			width: function (text) {
				context.font = text.size + 'px ' + text.font;
				return context.measureText (text.text).width;
			}
		},

		hash: function (object) {
			return '' + object.fill + object.h + object.redraw + object.text + object.w + object.x + object.y + object.z;
		},

		i: function (list) {
			for (let name of list) {
				let image = new Image ();
					image.src = 'data/' + name + '.png';
				app.i[name] = image;
			}
		},

		pinbox: function (p, b) {
			return ((p.x > b.x) && (p.x < b.x + b.w) && (p.y > b.y) && (p.y < b.y + b.h));
		},

		r: function (a, b, c) {
			if (Array.isArray (a)) {
				let i = Math.floor (Math.random () * (a.length));
				return a[i];
			}

			if (a == 'color') {
				return '#' + ((1<<24)*Math.random()|0).toString(16);
			}

			if (c) {
				return Math.floor (Math.random () * (b - a + 1)) + a;
			}

			if (b) {
				return Math.random () * (b - a) + a;
			}

			return Math.random ();
		}
	},

	i: {},

	id: 0,

	load: function () {
		window.load (app.update);
		window.onresize = function () {
			canvas.resize ();
			app.draw (true);
		}
		canvas.load ();
		app.scene.load ();
	},

	object: {},

	scene: { load: function () {} },

	update: function (event) {
		for (let id in app.object) {
			for (let method in app.object[id]) {
				if (method == event.type) { app.object[id][method] (event); }
			}
		}
		app.draw ();
	},

	wipe: function () {
		app.object = {};
		context.clearRect (0, 0, canvas.width, canvas.height);
		window.document.body.style.cursor = 'default';
	},

	zen: function (object) {
		for (let id in app.object) {
			if (id != object.id) {
				if (app.get.binbox (object, app.object[id])) {
					if (!app.object[id].redraw) {
						app.object[id].redraw = 1;
						app.zen (app.object[id]);
					}
				}
			}
		}
	}
}

window.onload = app.load;
