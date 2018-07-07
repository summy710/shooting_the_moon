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

    // onLoad () {},

    start () {},

    init(game, position){
        this.bStop = false;
        this.game = game;
        this.mask = game.mask;
        this.node.position = position;
        this.node.parent = game.content;
    },

    update (dt) {
        if (this.bStop) return;
        let game = this.game;
        let mask = this.mask.getComponent('mask');
        let akumas = game.akumas;
        let speed = game.speed * 3;
        this.node.y += speed * dt;

        for (var i = 0; i < akumas.length; i++) {
            let akuma = akumas[i];
            let pDis = cc.pDistance(this.node.position, akuma.position);
            if (pDis <= 65) {
                akuma.getComponent('akuma').hit();
                this.bStop = true;
                this.node.parent = null;
                return;
            }
        }

        let pDis = cc.pDistance(this.node.position, this.mask.position)
        if (pDis <= 105) {
            mask.hit();
            this.bStop = true;
            this.node.anchorY = 0.5;
            this.node.getComponent(cc.Animation).play('boom');
            let state = this.node.getComponent(cc.Animation).getAnimationState('boom');
            let self = this;
            state.on('finished', () => {
                self.node.active = false;
                self.node.parent = null;
            });
        }
        if (this.node.y >= 500) {
            this.node.parent = null;
            game.miss();
        }
    },
});
