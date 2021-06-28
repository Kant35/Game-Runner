/**
 * Objet de construction de node html
 * @type {Object Static}
 */
const Block = {
    /**
     * Creation et injection d'une 'div' dans un node HTML en utilisant les données envoyées en paramètre
     * @param {Object} data 
     * @returns [Retourne la 'div' (node) en fin de création pour le stocker dans l'objet qui l'a créé pour le réutiliser plus tard.]
     */
    createBlock:function (data) {
        let node = document.createElement('div'); // Création du node

        node.classList.add(data.classCSS); // Ajout de la class CSS au node
        node.style.height = data.h+'px'; // On donne une hauteur au node
        node.style.width = data.w+'px'; // On donne une largeur au node

        data.parent.appendChild(node); // On injecte le node au document HTML

        return node; // On retourne ce node pour le réutilisé plus tard
    }

}

const Sprite = {
    node:null,

    /**
     * Appelle à la methode de l'object block pour créer le div
     * @param {node HTML} parent [la balise qui contient le sprite]
     */
    createSprite:function (parent) {
        this.node = Block.createBlock({classCSS:'sprite', h:this.size.h, w:this.size.w, parent:parent});
    },

    /**
     * Gestion de l'affichage de background du sprite
     */
    addBg:function () {
        this.node.style.backgroundImage = 'url(' + this.bg + ')';
        /**
         * Le Delta représente une 'case' (partie) de l'image que l'on veut afficher dans le sprite 
         * Cette case est délimité en h et w par la taille physique du div, le delta permet de se déplacer dans l'image en x et y en fonction de cette taille 
         */
        this.node.style.backgroundPosition = (this.delta.x*this.size.w)+'px '+(this.delta.y*this.size.h)+'px';
    },

    setDelta:function (delta) {
        this.delta = delta;
    },
    
    setBg:function (bg) {
        this.bg = bg;
    },

    setSize:function (size) {
        this.size = size;
    },

    getNode:function () {
        return this.node;
    },

}

const Panel = {
    node:null,
    nbSprites:0,

    createNode:function (parent) {
        this.node = Block.createBlock({classCSS:'decor-panel', h:this.size.h, w:this.size.w, parent:parent });
    },

    randomiseDelta:function (delta) {
        return {
            x:Math.floor(Math.random()*delta.x),
            y:Math.floor(Math.random()*delta.y)
        }
        // let d = {
        //     x:Math.floor(Math.random()*delta.x),
        //     y:Math.floor(Math.random()*delta.y)
        // }
        // return d;
    },

    createInnerSprites:function(){
        let nb = this.nbSprites;
        for (let i=0; i < nb; i++) {
            let sp = Object.create(Sprite);
            sp.setSize(this.spriteData.size);
            sp.setDelta(this.randomiseDelta(this.spriteData.delta));
            sp.setBg(this.spriteData.src);
            sp.createSprite(this.node);
            sp.addBg();
        }
    },
    
    setData:function (data) {
        this.size = data.panels.size;
        this.spriteData = data.items;
        this.nbSprites = (data.panels.size.w/data.items.size.w)*(data.panels.size.h/data.items.size.h);
        // console.log(this.nbSprites)
    },
    
    init:function(parent) {
        this.createNode(parent);
        this.createInnerSprites();
    },

    getNode:function () {
        return this.node;
    },
}

const Decor = {
    panels:[],
    node:null,
    animeData:{
        indexPanel:0,
        posX:0,
        limit:0
    },

    createNode:function (parent) {
        let d = {
            classCSS:'decor',
            parent:parent,
            h:this.decorData.panels.size.h,
            w:this.decorData.panels.size.w*this.decorData.panels.nb,
        }
        this.node = Block.createBlock(d);
    },

    createPanels:function () {
        let nb = this.decorData.panels.nb;
        for (let i = 0; i < nb; i++) {
            let p = Object.create(Panel);
            p.setData(this.decorData);
            p.init(this.node);
            this.panels.push(p);
        }
    },

    animate:function () {
        if(this.animeData.posX < (this.decorData.panels.size.w*-1)){
            this.animeData.posX = 0;
            if (this.animeData.indexPanel < this.panels.length-1) {
                this.animeData.indexPanel++;
            } else {
                this.animeData.indexPanel = 0;
            }
        }

        this.animeData.posX -= this.decorData.animePosition;
        this.removeAndAddPanel(this.animeData.indexPanel);
        this.node.style.left = this.animeData.posX+'px';
    },

    removeAndAddPanel:function (index) {
        let currentPanel = this.panels[index].getNode();
        this.node.removeChild(currentPanel);
        this.node.appendChild(currentPanel);
    },

    setData:function (data) {
        this.decorData = data;
    },

    init:function (parent) {
        this.createNode(parent);
        this.createPanels();
    }
}

const Perso = Object.create(Sprite);

Perso.animate = function () {
    if (this.data.animeLimit < this.data.delta.x) {
        this.data.animeLimit += this.data.speed;
    } else {
        this.data.animeLimit = 1;
    }
    this.setDelta({x: Math.floor(this.data.animeLimit) , y:this.data.delta.y});
    this.addBg();
}

Perso.setData = function (dataPerso, screenHeight, gravity) {
    this.data = dataPerso;
    this.data.animeLimit = 1;
    this.data.isJump = false;
    this.data.jumpTop = 0;
    this.data.gravity = gravity;
    this.data.floorLimit = screenHeight-this.data.size.h-64;
    this.data.topPos = this.data.floorLimit;
}

Perso.sizeBg = function () {
    let bgH = this.data.size.h*this.data.delta.y;
    let bgW = this.data.size.w*this.data.delta.x;
    this.node.style.backgroundSize = bgW+'px '+bgH+'px'  
}

Perso.setPosition = function (pos) {
    this.node.style.top = pos.y+'px';
    this.node.style.left = pos.x+'px';
}


Perso.controller = function () {
    document.addEventListener('keydown', (event) => {
        console.log(event);
        if (event.keyCode === this.data.key) {
            this.data.isJump = true;
            this.data.jumpTop = 16;
        }
        // if (event.keyCode === 80) {
        //     this.data.speed = 1
        // } 
    });
    document.addEventListener('keyup', (event) => {
        if(event.keyCode === this.data.key){
			this.data.jumpTop = 0;
		}
        // if (event.keyCode === 80) {
        //     this.data.speed = 0.35
        // }
    })
}

Perso.jump = function () {
    if(this.data.isJump){
        if (this.data.jumpTop > 0) {
            this.data.jumpTop--;
            this.data.topPos -= this.data.jumpTop
        } else {
            if (this.data.topPos < this.data.floorLimit) {
                this.data.topPos += this.data.gravity
            }
        }
    }
} 

Perso.init = function (data) {
    this.setData(data.perso, data.scene.offsetHeight, data.gravity);
    this.setDelta({x:1,y:1});
    this.setSize(data.perso.size);
    this.createSprite(data.scene);
    this.setBg(data.perso.src);
    this.setPosition({y:536 ,x:30})
    this.sizeBg();
    this.controller();
}


const Game = {
    decor:Object.create(Decor),
    hero:Object.create(Perso),
    timer:null,

    gameLoop:function () {
        this.timer = setInterval(() => {
            this.decor.animate();
            this.hero.animate();
            this.hero.jump();
        }, dataGame.speed)
    },

    gameStop:function () {
        clearInterval(this.timer)
    },

    init:function () {
        this.decor.setData(dataGame.decor);
        this.decor.init(dataGame.scene);
        
        this.hero.init(dataGame)

        this.gameLoop();
    },

}

Game.init();








// const panel = Object.create(Panel);
// panel.setData(dataGame.decor);
// panel.init(dataGame.scene);

// const Hero = Object.create(Sprite);

// Hero.setSize(dataGame.perso.size);
// Hero.setDelta({x:1,y:1});
// Hero.setBg(dataGame.perso.src);

// Hero.createSprite(dataGame.scene);
// Hero.addBg();
// console.log(Hero);