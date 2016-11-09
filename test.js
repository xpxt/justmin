app.get.a ({ '256': 26 });

app.get.i (['256']);

app.scene.load = function () {
	app.wipe ();

	let col = 10;
	let row = 10;
	let h = (canvas.height / row) >> 0;
	let w = (canvas.width / col) >> 0;
	for (let x = col; x--;) {
		for (let y = row; y--;) {
			let c = '#000';
			app.create.box ({
				fill: c,
				h: h,
				x: x * w,
				y: y * h,
				w: w
			}).load ();
		}
	}

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
		h: 10,
		mousemove: function (event) {
			this.move (event.x, event.y);
		},
		x: 150,
		y: 150,
		w: 10,
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

	app.create.button ({
		action: function () {
			app.scene.start ();
		},
		h: 100,
		i: app.i['256'],
		x: 500,
		y: 300,
		w: 100,
		z: 3
	}).load ();

	let stop = true;

	app.create.button ({
		action: function () {
			if (stop) {
				stop = false;
			} else {
				stop = true;
			}
		},
		h: 100,
		i: app.i['256'],
		stop: false,
		x: 500,
		y: 100,
		w: 100,
		z: 3
	}).load ();

	app.create.animation ({
		a: app.a['256'],
		delay: 50,
		h: 100,
		i: app.i['256'],
		get stop () {
			return stop;
		},
		x: 500,
		y: 100,
		w: 100,
		z: 3
	}).load ();
}

app.scene.start = function () {
	app.wipe ();

	app.create.button ({
		action: function () {
			app.scene.load ();
		},
		h: 100,
		i: app.i['256'],
		x: 700,
		y: 300,
		w: 100
	}).load ();

	app.create.text ({
		fill: '#000',
		color: '#fff',
		size: 16,
		text: 'back',
		x: 700,
		y: 410
	}).load ();

	app.create.link ({
		color: '#00f',
		size: 16,
		text: 'link',
		x: 750,
		y: 500
	}).load ();
}
