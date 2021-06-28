const Block = {
	createBlock:function(data){
		let node = document.createElement('div');
		node.classList.add(data.c);
		node.style.height = data.h+'px';
		node.style.width = data.w+'px';
		data.p.appendChild(node);
		return node;
	}
}

const Sprite = {
	node:null,
	createSprite:function(parent){
		this.node = Block.createBlock({c:'sprite',h:this.size.h,w:this.size.w,p:parent});
	},
	setDelta:function(delta){
		this.delta = delta;
	},
	addBg:function(){
		this.node.style.backgroundImage = 'url('+this.bg+')';
		this.node.style.backgroundPosition = (this.delta.x*this.size.w)+'px '+(this.delta.y*this.size.h)+'px';
	},
	setBg:function(bg){
		this.bg = bg;
	},
	setSize:function(size){
		this.size=size;
	},
	getNode:function(){
		return this.node;
	}
}



const Enemys = {
	poolEnemys : [],

	createEnemys:function(parent){
		for(let i=0;i<6;i++){
			let sp = Object.create(Sprite);
			sp.setSize(this.enemyData.size);
			sp.setDelta(this.randomiseDelta(this.enemyData.delta));
			sp.setBg(this.enemyData.src);
			sp.createSprite(parent);
			sp.getNode().classList.add('enemy');
			sp.addBg();
			this.restartPos(sp);
			this.poolEnemys.push(sp);
		}
	},
	setPosition:function(){
		this.poolEnemys.forEach((en)=>{
			let r = this.setPlaceHori(en);
			// console.log(r)
			en.node.style.top = this.enemyData.h+'px';
			en.node.style.left = r +'px';
		});
	},
	restartPos:function(en){		
		return en.node.style.left = this.enemyData.limitR+(Math.floor(Math.random()*200)*2)+'px';
	},

	animate:function(){
		this.setPosition();
	},

	setPlaceHori:function(en){
		let l = en.node.offsetLeft;
		if(en.node.offsetLeft < -100){
			return this.restartPos(en);
		}
		return l-=8;
	},


	randomiseDelta:function(delta){
		return d = {
			x:Math.floor(Math.random()*delta.x),
			y:Math.floor(Math.random()*delta.y)
		};
	},
	setData:function(data,screenH,screenW){
		this.enemyData = data;
		this.enemyData.limitR = screenW;
		this.enemyData.h = screenH-85;
		this.enemyData.w = screenW
	},

	init:function(data){
		this.setData(data.enemy,data.scene.offsetHeight,data.scene.offsetWidth);
		this.createEnemys(data.scene);
	}
}

const Panel = {
	size:{},
	nbSprite:0,
	sprite:[],

	createNode:function(parent){
		this.node = Block.createBlock({c:'decor-panel',h:this.size.h,w:this.size.w,p:parent});
	},
	randomiseDelta:function(delta){
		return d = {
			x:Math.floor(Math.random()*delta.x),
			y:Math.floor(Math.random()*delta.y)
		};
	},
	createInnerSprites:function(){
		let nb = this.nbSprite
		for(let i = 0;i<nb;i++){
			let sp = Object.create(Sprite);
			sp.setSize(this.spriteData.size);
			sp.setDelta(this.randomiseDelta(this.spriteData.delta));
			sp.setBg(this.spriteData.src);
			sp.createSprite(this.node);
			sp.addBg();
		}
	},
	setData:function(data){
		this.size.w = data.panels.size.w;
		this.size.h = data.panels.size.h;
		this.spriteData = data.items;
		this.nbSprite = (data.panels.size.w/data.items.size.w)*(data.panels.size.h/data.items.size.h);
	},
	getNode:function(){
		return this.node;
	},
	init:function(parent){
		this.createNode(parent);
		this.createInnerSprites();
	}
}
const Decor = {
	panels:[],
	panelData:{},
	animData:{
		indexPanel:0,
		posX:0,
		limit:0
	},
	createNode:function(parent){
		let d = {
			c:'decor',
			h:this.panelData.panels.size.h,
			w:this.panelData.panels.size.w*this.panelData.panels.nb,
			p:parent
		}
		this.node = Block.createBlock(d);
	},
	createPanels:function(){
		let nb = this.panelData.panels.nb;
		for(let i = 0; i< nb;i++){
			let panel = Object.create(Panel);
			panel.setData(this.panelData);
			panel.init(this.node);
			this.panels.push(panel);
		}
	},
	animate:function() {
		if(this.animData.posX === this.animData.limit){
			this.animData.posX = 0;
			if(this.animData.indexPanel<this.panels.length-1){
				this.animData.indexPanel++;
			}else{
				this.animData.indexPanel = 0;
			}
		}
		this.node.style.left = this.animData.posX+'px';
		this.removeAndAddPanel(this.animData.indexPanel);
		this.animData.posX -= this.panelData.animePosition;
	},
	removeAndAddPanel:function(index){
		let currentPanel = this.panels[index].getNode();
		this.node.removeChild(currentPanel);
		this.node.appendChild(currentPanel)
	},
	setData:function(pData){
		this.panelData = pData;
		this.animData.limit = pData.panels.size.w*-1
	},
	init:function(parentNode){
		this.createNode(parentNode);
		this.createPanels();
	}
}

const Perso = Object.create(Sprite);

Perso.animate = function(){
	if(this.data.animLimit < data.perso.delta.x){
		this.data.animLimit+=data.perso.speed;
	}else{
		this.data.animLimit = 0;
	}
	this.setDelta({x:Math.floor(this.data.animLimit),y:0});
	this.addBg();
	this.setPosition({x:this.data.startPos.x,y:this.data.topPos});
}
Perso.sizeBg = function(){
	let bgH = data.perso.size.h*data.perso.delta.y;
	let bgW = data.perso.size.w*data.perso.delta.x;
	this.node.style.backgroundSize = bgW+'px '+bgH+'px';
};
Perso.setPosition = function(pos){
	this.node.style.top = pos.y+'px';
	this.node.style.left = pos.x+'px';
};
Perso.setData = function(data,sceneH,gravity){
	this.data = data;
	this.data.isJump = false;
	this.data.jumpTop = 0;
	this.data.gravity = gravity;
	this.data.floorLimit = sceneH-this.data.size.h-64;
	this.data.topPos = this.data.floorLimit;
};
Perso.controller = function(){
	document.addEventListener('keydown',(event)=>{
		if(event.keyCode === this.data.key && this.data.topPos == this.data.floorLimit){
			this.data.jumpTop = 16;
			this.data.isJump = true;
		}
	});
	document.addEventListener('keyup',(event)=>{
		if(event.keyCode === this.data.key){
			// this.data.jumpTop = 0;
		}
	});
};
Perso.jump = function(){
	if(this.data.isJump){
		if(this.data.jumpTop > 0){
			this.data.jumpTop-=1;
			this.data.topPos -= this.data.jumpTop;
		}else{
			if(this.data.topPos < this.data.floorLimit){
				//this.data.jumpTop = 0;
				this.data.topPos+=this.data.gravity;
			}
		}
	}
};
Perso.init = function(data){
	// console.log(data.gravity)
	this.setData(data.perso,data.scene.offsetHeight,data.gravity);
	this.setDelta({x:0,y:0})
	this.setSize(this.data.size);
	this.createSprite(data.scene);
	this.setBg(this.data.src);
	this.sizeBg();
	this.controller();
}

const Game = {
	timer:null,
	decor:Object.create(Decor),
	hero:Object.create(Perso),
	enemys:Object.create(Enemys),

	gameLoop:function(){
		this.timer = setInterval(()=>{
			this.decor.animate();
			this.hero.animate();
			this.enemys.animate();
			this.hero.jump();
		},data.speed);
	},
	init:function(){
		this.decor.setData(data.decor);
		this.decor.init(data.scene);
		this.hero.init(data);
		this.enemys.init(data)
		this.gameLoop();
	}
}
Game.init();