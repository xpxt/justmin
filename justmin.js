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

	create: {
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
		binbox: function (a, b) {
			return ((Math.abs (a.x - b.x + 0.5 * (a.w - b.w)) <= 0.5 * Math.abs (a.w + b.w)) &&
								(Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) <= 0.5 * Math.abs (a.h + b.h)));
		},

		clone: function clone(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    let copy = obj.constructor();
		    for (let attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		},

		hash: function (object) {
			return '' + object.fill + object.h + object.redraw + object.w + object.x + object.y + object.z;
		},

		pinbox: function (p, b) {
			return ((p.x >= b.x) && (p.x <= b.x + b.w) && (p.y >= b.y) && (p.y <= b.y + b.h));
		},

		r: function (a, b, c) {
			let r = Math.random ();
			if (b) {
				r = Math.random () * (b - a) + a;
			}
			if (c) {
				r = Math.floor (Math.random () * (b - a + 1)) + a;
			}
			if (Array.isArray (a)) {
				let i = Math.floor (Math.random () * (a.length));
				r = a[i];
			}
			return r;
		}
	},

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
				if (method == event.type) { app.object[id][method] (event); app.draw (); }
			}
		}
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

app.scene.load = function () {
	app.create.box ({
		fill: '#000',
		h: 100,
		x: 110,
		y: 110,
		w: 100,
		z: 3
	}).load ();

	app.create.box ({
		fill: '#f00',
		h: 100,
		mousemove: function (event) {
			this.move (event.x, event.y);
		},
		x: 150,
		y: 150,
		w: 100,
		z: 2
	}).load ();

	app.create.box ({
		fill: '#00f',
		h: 100,
		x: 200,
		y: 200,
		w: 100,
		z: 1
	}).load ();

	app.create.box ({
		fill: '#0f0',
		h: 100,
		x: 500,
		y: 300,
		w: 100,
		z: 1
	}).load ();

	app.create.object ({
		tick: function () {
			app.draw ();
		}
	}).load ();

	app.draw ();
}
