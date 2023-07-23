let bgCanvas = $('#bg-canvas'), fgCanvas = $('#fg-canvas'), gradDiv = $('#gradient');

bgCanvas.get(0).width = $('body').innerWidth();
bgCanvas.get(0).height = $('body').innerHeight();

fgCanvas.get(0).width = $('body').innerWidth();
fgCanvas.get(0).height = $('body').innerHeight();

gradDiv.height($('body').innerHeight());

let canW = bgCanvas.width(),
	canH = bgCanvas.height(),
	baseHeight = canH * 0.7,
	arcCount = 13,
	radIncrement = ((canW * 0.6 * 0.5) - 80) / (arcCount - 1),
	firstOffset = 80,
	arcConfig = [];

let colors = [
	'#807865',
	'#96867e',
	'#9c848d',
	'#799179',
	'#7d5c5a',
	'#736a7d',
	'#637480',
	'#726a75',
	'#757558',
	'#7d6671',
	'#685a69',
	'#4c5461',
	'#657d7c'
];

for(let i = 0; i < arcCount; i++){
	let obj = {
		color: colors[i],
		radVelocity: Math.PI * (45 - i) / (15 * 60 * 1000),
		angle: Math.PI,
		radius: firstOffset + i * radIncrement
	};
	arcConfig.push(obj);
}

// Background Canvas

let ctx = bgCanvas.get(0).getContext('2d');

// Base line
	
ctx.lineWidth = 2;
ctx.strokeStyle = 'white';
// ctx.beginPath();
// ctx.moveTo(canW * 0.20, baseHeight);
// ctx.lineTo(canW * 0.80, baseHeight);
// ctx.stroke();

// Arcs

for(let obj of arcConfig){
	ctx.beginPath();
	ctx.strokeStyle = obj.color;
	ctx.arc(canW * 0.50, baseHeight, obj.radius, Math.PI, 2 * Math.PI);
	ctx.stroke();
}

let prevTime = new Date();

// Foreground Canvas

ctx = fgCanvas.get(0).getContext('2d');
ctx.lineWidth = 4;
ctx.fillStyle = 'black';
ctx.strokeStyle = 'white';

function draw(){
	ctx.clearRect(0, 0, canW, canH);
	let curTime = new Date(), timeDiff = curTime - prevTime;

	// Dots

	for(let obj of arcConfig){
		obj.angle += obj.radVelocity * timeDiff;
		if(obj.angle > 2 * Math.PI || obj.angle < Math.PI)
			obj.radVelocity *= -1;

		ctx.beginPath();
		ctx.arc(canW * 0.5 - obj.radius * Math.cos(obj.angle), baseHeight + obj.radius * Math.sin(obj.angle), 11, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
	}

	prevTime = curTime;
	window.requestAnimationFrame(draw);
}

draw();
