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
        scoreLabel:cc.Label,
        fourthLabel:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    multiScore() {
        this.scoreLabel.string = '' + (this.score * 4);
    },

    init(score, game) {
        this.score = score;
        this.scoreLabel.string = '' + score;
        this.node.parent = game.content;
        let position = game.mask.position;
        this.node.position = cc.pAdd(position, cc.p(0, -150));
        let self = this;
        if (game.score + score >= game.nextScore && game.life == 1) {
            this.node.getComponent(cc.Animation).play('fourth');
            let state = this.node.getComponent(cc.Animation).getAnimationState('fourth');
            state.on('finished', () => {
                self.node.parent = null;
            });
        } else {
            this.node.getComponent(cc.Animation).play('score');
            let state = this.node.getComponent(cc.Animation).getAnimationState('score');
            state.on('finished', () => {
                self.node.parent = null;
            });
        }
    },

    // update (dt) {},
});
