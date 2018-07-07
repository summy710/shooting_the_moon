// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        content:cc.Node,
        scores:[cc.Node],
        game:cc.Node,

        eyes:[cc.Node],
        eb:[cc.Node],

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	this.pause = true;
    	this.hitCount = 0;
    },

    start () {

    },

    refreshVec() {
    	let angle = Math.floor(Math.random() * 4) * 90 + 15 + Math.random() * 30;
    	this.vec = {x : Math.sin(angle * Math.PI / 180), y : Math.cos(angle * Math.PI / 180)};
    },

    startGame() {
    	this.refreshVec();
    	this.pause = false;
    },

    calcScore() {
    	let score = 0;
    	for (var i = this.scores.length - 1; i >= 0; i--) {
    		score = i + 1;
    		let line = this.scores[i];
    		if (this.node.y + 80 > line.y) {
    			break;
    		}
    	}
    	this.game.getComponent('game').hit(score);
    },

    fission(){
    	cc.log('fission');
    	this.game.getComponent('game').createAkuma();
    },

    hit() {
    	this.pause = true;
    	cc.log('hit');
    	this.refreshVec();
    	this.calcScore();
    	for (var i = 0; i < this.eyes.length; i++) {
			let eb = this.eb[i];
			eb.x = 0;
			eb.y = 0;
		}
    	let self = this;
		this.hitCount++;
    	if (this.hitCount < 5) {
    		this.node.getComponent(cc.Animation).play('shoot');
    		let state = this.node.getComponent(cc.Animation).getAnimationState('shoot');
	        state.on('finished', () => {
	            self.pause = false;
            	let scl = Math.random() * 0.2 - 0.1;
            	self.eyes[0].scale = 1 + scl;
            	self.eyes[1].scale = 1 - scl;
	            let x = Math.random() * 15;
            	let y = Math.random() * 20 - 10;
        		self.eyes[0].x = -(30 + x);
        		self.eyes[0].y = 9 + y;
        		self.eyes[1].x = 30 + x;
        		self.eyes[1].y = 9 + y;
	        });
    	} else {
	    	this.node.getComponent(cc.Animation).play('angry');
	    	let state = this.node.getComponent(cc.Animation).getAnimationState('angry');
	        state.on('finished', () => {
	            self.pause = false;
	            self.hitCount = 0;
	            self.eyes[0].position = cc.p(-30, 9);
	            self.eyes[0].scale = 1;
	            self.eyes[1].position = cc.p(30, 9);
	            self.eyes[1].scale = 1;
	        });
    	}
    },

    miss() {
    	cc.log('miss');
    	this.hitCount = 0;
    	let game = this.game.getComponent('game');
    	if (game.life == 1) {
    		this.node.getComponent(cc.Animation).play('wink');
    	} else {
    		this.node.getComponent(cc.Animation).play('laugh');
	    	let state = this.node.getComponent(cc.Animation).getAnimationState('laugh');
	    	let self = this;
	        state.on('finished', () => {
	            self.node.getComponent(cc.Animation).play('laugh_forever');
	        });
    	}
    	
    },

    update (dt) {
    	if (this.pause) return;
    	let size = this.node.getContentSize();
    	let c_size = this.content.getContentSize();
    	let game = this.game.getComponent('game');
    	let speed = game.speed * (game.multi + this.hitCount * 0.05);
    	this.node.x += this.vec.x * speed * dt;
    	this.node.y += this.vec.y * speed * dt;
    	if (this.node.x <= -(c_size.width / 2 - size.width / 2 - 10)) {
    		this.vec.x = -this.vec.x;
    		this.node.x = -(c_size.width / 2 - size.width / 2 - 10);
    	}
    	if (this.node.x >= c_size.width / 2 - size.width / 2 - 10) {
    		this.vec.x = -this.vec.x;
    		this.node.x = c_size.width / 2 - size.width / 2 - 10;
    	}
    	if (this.node.y <= -(c_size.height / 2 - size.height / 2 - 10)) {
    		this.vec.y = -this.vec.y;
    		this.node.y = -(c_size.height / 2 - size.height / 2 - 10);
    	}
    	if (this.node.y >= c_size.height / 2 - size.height / 2 - 10) {
    		this.vec.y = -this.vec.y;
    		this.node.y = c_size.height / 2 - size.height / 2 - 10;
    	}
    	let rocket = game.rocket;
    	if (rocket) {
    		for (var i = 0; i < this.eyes.length; i++) {
    			let eb = this.eb[i];
    			let pDis = cc.pDistance(this.node.position, rocket.position);
    			eb.x = (rocket.x - this.node.x) / pDis * 10;
    			eb.y = (rocket.y - this.node.y) / pDis * 10;
    		}
    	} else {
    		for (var i = 0; i < this.eyes.length; i++) {
    			let eb = this.eb[i];
    			eb.x = 0;
    			eb.y = 0;
    		}
    	}

    },
});
