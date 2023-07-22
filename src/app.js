let canvas = $('#plane');
canvas.get(0).width = $('body').innerWidth();
canvas.get(0).height = $('body').innerHeight();
let canW = canvas.width(), canH = canvas.height();
let ctx = canvas.get(0).getContext('2d');

let colors = [
	'#FFF4D4',
	'#FAE0D3',
	'#FFDBE9',
	'#C2E6C2',
	'#FEBDB9',
	'#ECDBFF',
	'#CAEAFF',
	'#D9CCDE',
	'#F4F3BB',
	'#F5CEE0',
	'#F4D7F5',
	'#C9DCFC',
	'#C8F4F3'
];

let arcConfig = [];
for(let i = 0; i < colors.length; i++){
	let obj = {};
	obj.color = colors[i];
	obj.radVelocity = Math.PI * (50 - i) / (15 * 60 * 1000);
	arcConfig.push(obj);
}

let prevTime = new Date();
	angle = Math.PI,
	radVelocity = Math.PI / 8000;

function draw(){
	ctx.clearRect(0, 0, canW, canH);
	// ctx.restore();
	
	// Base line
	
	ctx.lineWidth = 3;
	// ctx.beginPath();
	// ctx.moveTo(canW * 0.20, canH * 0.7);
	// ctx.lineTo(canW * 0.80, canH * 0.7);
	// ctx.stroke();
	// ctx.closePath();
	
	
	// Arcs
	
	let arcCount = 13,
		radIncrement = ((canW * 0.60 * 0.5) - 80) / (arcCount - 1),
		firstOffset = 80;
	
	for(let i = 0; i < arcConfig.length; i++){
		ctx.beginPath();
		ctx.strokeStyle = arcConfig[i].color;
		ctx.arc(canW * 0.50, canH * 0.7, firstOffset + i * radIncrement, Math.PI, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();
	}
	
	// Dots

	let curRadius = firstOffset - radIncrement;
	let curTime = new Date(), timeDiff = new Date() - prevTime;
	angle += radVelocity * timeDiff;

	if(angle > 2 * Math.PI || angle < Math.PI)
		radVelocity *= -1;

	for(let obj of arcConfig){
		curRadius += radIncrement;
		ctx.beginPath();
		ctx.arc(canW * 0.5 - curRadius * Math.cos(angle), canH * 0.7 + curRadius * Math.sin(angle), 11, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	// ctx.save();
	prevTime = curTime;
	window.requestAnimationFrame(draw);
	// setInterval(() => window.requestAnimationFrame(draw), 500);
}

draw();
