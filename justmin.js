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

				box.draw = function () {
					context.fillStyle = box.fill;
					context.fillRect (box.x, box.y, box.w, box.h);
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
		}
	},

	draw: function () {
		for (let id in app.object) {
			app.object[id].draw ();
		}
	},

	id: 0,

	load: function () {
		window.load (app.update);
		window.onresize = function () {
			canvas.resize ();
			app.draw ();
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
	}
}

window.onload = app.load;

app.scene.load = function () {
	app.create.box ({
		fill: '#000',
		h: 100,
		x: 100,
		y: 100,
		w: 100,
	}).load ();

	app.create.box ({
		fill: '#f00',
		h: 100,
		x: 150,
		y: 100,
		w: 100,
	}).load ();

	app.draw ();
}
