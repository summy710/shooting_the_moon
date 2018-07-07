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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pause = true;
    },

    refreshVec() {
        let angle = Math.floor(Math.random() * 4) * 90 + 15 + Math.random() * 30;
        this.vec = {x : Math.sin(angle * Math.PI / 180), y : Math.cos(angle * Math.PI / 180)};
    },

    start () {
        let self = this;
        this.node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.2, 1),
                    cc.fadeIn(0.2),
                    cc.moveBy(0.2, -150, -60)
                ),
                cc.callFunc(()=>{
                    self.refreshVec();
                    self.pause = false;
                })
            )
        );
    },

    init(game) {
        this.game = game;
        let mask = game.mask;
        this.node.parent = game.content;
        let position = mask.position;
        this.node.position = cc.pAdd(position, cc.p(0, -10));
        this.node.opacity = 0;
        this.node.scale = 0.1;
    },

    hit() {
        this.pause = true;
        this.node.getComponent(cc.Animation).play('akuma');
        let state = this.node.getComponent(cc.Animation).getAnimationState('akuma');
        let self = this;
        state.on('finished', () => {
            self.game.miss(self.node);
        });
        
    },

    update (dt) {
        if (this.pause) return;
        let size = this.node.getContentSize();
        let c_size = this.game.content.getContentSize();
        let game = this.game.getComponent('game');
        let speed = game.speed * 1.5;
        this.node.x += this.vec.x * speed * dt;
        this.node.y += this.vec.y * speed * dt;
        if (this.node.x <= -(c_size.width / 2 - size.width / 2)) {
            this.vec.x = -this.vec.x;
            this.node.x = -(c_size.width / 2 - size.width / 2);
        }
        if (this.node.x >= c_size.width / 2 - size.width / 2) {
            this.vec.x = -this.vec.x;
            this.node.x = c_size.width / 2 - size.width / 2;
        }
        if (this.node.y <= -(c_size.height / 2 - size.height / 2)) {
            this.vec.y = -this.vec.y;
            this.node.y = -(c_size.height / 2 - size.height / 2);
        }
        if (this.node.y >= c_size.height / 2 - size.height / 2) {
            this.vec.y = -this.vec.y;
            this.node.y = c_size.height / 2 - size.height / 2;
        }
    },
});
