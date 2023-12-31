let bgCanvas = $('#bg-canvas'),
	fgCanvas = $('#fg-canvas'),
	gradDiv = $('#gradient'),
	body = $('body');

bgCanvas.get(0).width = body.innerWidth();
bgCanvas.get(0).height = body.innerHeight();
fgCanvas.get(0).width = body.innerWidth();
fgCanvas.get(0).height = body.innerHeight();
gradDiv.height(body.innerHeight());

let mute = $('#audio-off'), nomute = $('#audio-on'), mutebox = $('#mute-box');
nomute.css('display', 'none');

let canW = bgCanvas.width(),
	canH = bgCanvas.height(),
	baseHeight = canH * 0.85,
	arcCount = 13,
	firstOffset = body.innerWidth() / 20,
	dotRadius = body.innerWidth() / 140,
	radIncrement = ((canW * 0.55 * 0.5) - firstOffset) / (arcCount - 1),
	arcConfig = [],
	maxAngle = Math.PI * 2,
	fillGradVelocity = 255 / 1000,
	soundEnabled = false;

function muteHandler(){
	if(soundEnabled){
		mute.css('display', 'initial');
		nomute.css('display', 'none');
	}
	else{
		mute.css('display', 'none');
		nomute.css('display', 'initial');
	}
	soundEnabled = !soundEnabled;
}

mutebox.on('click', muteHandler);

document.onvisibilitychange = () => {
	mute.css('display', 'initial');
	nomute.css('display', 'none');
	soundEnabled = false;
}

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
	let audio = new Audio(`/assets/audio/a${i+1}.mp3`);
	audio.volume = 0.02;
	let obj = {
		color: colors[i],
		angVelocity: Math.PI * (80 - i) / (15 * 60 * 1000),
		radius: firstOffset + i * radIncrement,
		fill: 0,
		sound: audio
	};
	arcConfig.push(obj);
}

// Background Canvas

let ctx = bgCanvas.get(0).getContext('2d');

// Base line
	
ctx.lineWidth = 4;
ctx.strokeStyle = 'white';
ctx.beginPath();
ctx.moveTo(canW * 0.215, baseHeight + 2);
ctx.lineTo(canW * 0.785, baseHeight + 2);
ctx.stroke();

// Arcs

for(let obj of arcConfig){
	ctx.beginPath();
	ctx.strokeStyle = obj.color;
	ctx.arc(canW * 0.50, baseHeight, obj.radius, Math.PI, 2 * Math.PI);
	ctx.stroke();
}

let startTime = new Date(), prevTime = new Date();

// Foreground Canvas

ctx = fgCanvas.get(0).getContext('2d');
ctx.lineWidth = 4;
ctx.strokeStyle = 'white';

function draw(){
	ctx.clearRect(0, 0, canW, canH);
	const curTime = new Date(), totalTime = curTime - startTime, timeDiff = curTime - prevTime;

	// Dots
	
	for(let obj of arcConfig){
		ctx.fillStyle = 'black';

		if(obj.fill > 0){
			ctx.fillStyle = `rgb(${Math.floor(obj.fill)}, ${Math.floor(obj.fill)}, ${Math.floor(obj.fill)})`;
			obj.fill -= fillGradVelocity * timeDiff;
			if(obj.fill < 0)
				obj.fill = 0;
		}

		let angle = (totalTime * obj.angVelocity) % maxAngle;
		if(angle > Math.PI){
			angle = maxAngle - angle;
			if(!obj.fillChange){
				obj.fill = 255;
				obj.fillChange = true;
				if(soundEnabled)
					obj.sound.play();
			}
		}
		else{
			if(obj.fillChange){
				obj.fill = 255;
				obj.fillChange = false;
				if(soundEnabled)
					obj.sound.play();
			}
		}

		ctx.beginPath();
		ctx.arc(canW * 0.5 - obj.radius * Math.cos(angle), baseHeight - obj.radius * Math.sin(angle), dotRadius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
	}

	prevTime = curTime;
	window.requestAnimationFrame(draw);
}

draw();