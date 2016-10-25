var window = window;
	window.tick = 50;
	window.time = 0;

	window.events = {
		set load (update) {
			window.onmousedown = update;
			window.onmousemove = update;
			window.onmouseup = update;
			window.on.tick = update;
		}
	}

	window.load = function (update) {
		window.events.load = update;
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
		window.onresize = canvas.resize;
	}

	canvas.resize = function () {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
	}

var context = canvas.getContext ('2d');

var app = {

	create: {
		object: function (_) {
			let object = _ || {};
				object.id = _.id || app.id++;

				object.load = function () {
					app.object[object.id] = object;
				}

			return object;
		}
	},

	id: 0,

	load: function () {
		window.load (app.update);
		canvas.load ();
	},

	object: {},

	update: function (event) {
		for (let id in app.object) {
			for (let method in app.object[id]) {
				if (method == event.type) { app.object[id][method] (event); }
			}
		}
	}
}

window.onload = app.load;
