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
        recordLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.speed = 360;
    },

    start () {

    },

    init(game) {
        this.game = game;
        this.recordLabel.string = '' + game.nextScore;
        this.node.parent = game.content;
        this.node.position = cc.p(0, (game.nextScore - game.score) / 100 * 1440 - 360);
        this.node.zIndex = -1;
        this.node.opacity = 120;
    },

    update (dt) {
        let game = this.game;
        let y = (game.nextScore - game.score) / 100 * 1440 - 360;
        this.node.y -= this.speed * dt;
        this.node.y = Math.max(y, this.node.y);
        if (this.node.y == -360) {
            this.node.parent = null;
        }
    },
});
