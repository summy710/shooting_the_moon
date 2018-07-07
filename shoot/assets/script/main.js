// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const co = require('Common');
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
        optionNode:cc.Node,
        soundCheck:cc.Node,
        shakeCheck:cc.Node,
        rankNode:cc.Node,
        ranksv:cc.Sprite,
        clickAu:cc.AudioClip,
        btns:[cc.Button]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.bAni = false;
        if (CC_WECHATGAME) {
            wx.updateShareMenu({
                withShareTicket:true,
            });
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
        }
        co.playBGM();
    },

    startEnd() {
        cc.log('startEnd');
        cc.director.loadScene('game');
    },

    disableBtn(){
        for (var i = 0; i < this.btns.length; i++) {
            let btn = this.btns[i];
            btn.enabled = false;
        }
    },

    enableBtn() {
        for (var i = 0; i < this.btns.length; i++) {
            let btn = this.btns[i];
            btn.enabled = true;
        }
    },

    startGame() {
        if (this.bAni) return;
        this.bAni = true;
        co.playAudio(this.clickAu);
        let self = this;
        this.node.getComponent(cc.Animation).play('start');
        let state = this.node.getComponent(cc.Animation).getAnimationState('start');
        state.on('finished', () => {
            self.startEnd();
        });
        co.showTip(this.node, '加载资源中，请稍候...');
    },

    friendRank() {
        if (this.bAni) return;
        co.playAudio(this.clickAu);
        this.showRank();
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType:2,
                MAIN_MENU_NUM:"shoot"
            });
        }
    },

    showRank() {
        this.rankNode.zIndex = 2;
        this.rankNode.active = true;
        this.refreshRank = true;
        this.bAni = true;
        this.disableBtn();
    },

    closeRank() {
        co.playAudio(this.clickAu);
        this.rankNode.active = false;
        this.refreshRank = false;
        this.bAni = false;
        this.enableBtn();
    },

    share () {
        cc.log('share');
        if (this.bAni) return;
        co.playAudio(this.clickAu);
        if (CC_WECHATGAME) {
            co.stopBGM();
            let str = '贱贱的月亮，快来一起射哭它';
            wx.shareAppMessage({
                title: str,
                imageUrl: co.getSharePicPath()
            });
        }
    },

    option () {
        if (this.bAni) return;
        co.playAudio(this.clickAu);
        this.bAni = true;
        this.optionNode.active = true;
        this.soundCheck.active = co.getSoundStatus();
        this.shakeCheck.active = co.getShakeStatus();
        this.disableBtn();
    },

    optionClose() {
        this.bAni = false;
        co.playAudio(this.clickAu);
        this.optionNode.active = false;
        this.enableBtn();
    },

    soundClick() {
        let self = this;
        co.playAudio(this.clickAu);
        co.changeSoundStatus((b) => {
            self.soundCheck.active = b;
        });
    },

    shakeClick() {
        let self = this;
        co.playAudio(this.clickAu);
        co.changeShakeStatus((b) => {
            self.shakeCheck.active = b;
        });
    },

    update (dt) {
        if (this.refreshRank) {
            this._updateSubDomainCanvas(); // 刷新子域
        }
    },

        // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.ranksv.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    },

    // update (dt) {},
});
