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
        mask:cc.Node,
        touchNode:cc.Node,
        touchTips:cc.Node,
        rocketPb:cc.Prefab,
        content:cc.Node,
        akumaPb:cc.Prefab,
        scoreLabel:cc.Label,
        recordLabel:cc.Label,
        multiSp:cc.Node,
        multiProSp:[cc.Node],
        lifeSp:cc.Node,
        lifeProSp:[cc.Node],
        scorePb:cc.Prefab,
        recordPb:cc.Prefab,
        resultNode:cc.Node,
        resultScore:cc.Label,
        clickAu:cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    _touchStart (event) {
        if (this.bShoot) return;
        let location = this.touchNode.convertToNodeSpace(event.getLocation());
        let rect = this.touchNode.getBoundingBox();
        rect.x = 0;
        rect.y = 0;
        if (rect.contains(location)) {
            this.touchTips.active = false;
            this.shoot(this.content.convertToNodeSpaceAR(event.getLocation()));
        }
    },

    initPool(){
        this.akumaPool = new cc.NodePool();
        for (let i = 0; i < 10; ++i) {
            let akuma = cc.instantiate(this.akumaPb); // 创建节点
            this.akumaPool.put(akuma); // 通过 putInPool 接口放入对象池
        }
    },

    onLoad () {
        this.touchTips.active = true;
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
        this.akumas = [];
        this.initPool();
    },

    onDestroy () {
        this.touchNode.off(cc.Node.EventType.TOUCH_START, this._touchStart, this);
        this.akumaPool.clear();
    },

    initGame () {
        this.speed = 200;
        this.multi = 1;
        this.bShoot = false;
        this.life = 0;
        this.scoreLabel.string = '0';
        let record = co.getRecord();
        this.recordLabel.string = '最高分:' + record;
        this.score = 0;
        this.multiCount = 0;
        this.nextScore = 100;
        this.createRecord();
    },

    createRecord() {
        this.recordLine = cc.instantiate(this.recordPb);
        this.recordLine.getComponent('record').init(this);
    },

    createAkuma () {
        let akuma = null
        if (this.akumaPool.size() > 0) {
            akuma = this.akumaPool.get();
        } else {
            akuma = cc.instantiate(this.akumaPb);
        }
        akuma.getComponent('akuma').init(this);
        this.akumas.push(akuma);
    },

    shoot(position) {
        if (this.bShoot) return;
        this.bShoot = true;
        let rocket = cc.instantiate(this.rocketPb);
        rocket.getComponent('rocket').init(this, position);
        this.rocket = rocket;
    },

    hit(score) {
        cc.log('get point ' + score);
        let self = this;
        self.rocket = null;
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(()=>{
            self.bShoot = false;
        })));
        
        if (this.multiCount == 3) score *= 2;

        if (score != 10) {
            this.multiSp.active = false;
            for (var i = 0; i < this.multiProSp.length; i++) {
                this.multiProSp[i].active = false;
            }
            this.multiCount = 0;
        } else {
            if (this.multiCount < 3) {
                let n = this.multiProSp[this.multiCount];
                n.active = true;
            }
            if (this.multiCount + 1 == 3) {
                let n = this.multiSp;
                n.active = true;
                n.opacity = 0;
                n.scale = 2;
                n.runAction(cc.spawn(cc.scaleTo(0.5, 1), cc.fadeIn(0.1)));
            }
            this.multiCount++;
            this.multiCount = Math.min(3, this.multiCount);
        }
        let show_score = cc.instantiate(this.scorePb);
        show_score.getComponent('score').init(score, this);
        if (this.score + score >= this.nextScore) {
            if (this.life == 1) {
                score *= 4;
            } else {
                this.lifeSp.active = true;
                this.lifeSp.opacity = 0;
                this.lifeSp.scale = 2;
                this.lifeSp.runAction(cc.spawn(cc.scaleTo(0.5, 1), cc.fadeIn(0.1)));
                for (var i = 0; i < this.lifeProSp.length; i++) {
                    let n = this.lifeProSp[i];
                    n.active = true;
                }
                this.life++;
            }
            this.nextScore += 100;
            this.multi += 0.2;
            this.createRecord(this);
        }
        this.score += score;
        this.scoreLabel.string = '' + this.score;
    },

    miss(akuma){
        this.rocket = null;
        this.mask.getComponent('mask').miss();
        if (!akuma) {
            if (this.akumas.length) {
                akuma = this.akumas[0];
            }
        }
        for (var i = 0; i < this.akumas.length; i++) {
            if (this.akumas[i] === akuma) {
                this.akumas.splice(i, 1);
                break;
            }
        }
        if (akuma) akuma.parent = null;
        
        if (this.life) {
            this.life--;
            this.bShoot = false;
            this.lifeSp.active = false;
            for (var i = 0; i < this.lifeProSp.length; i++) {
                let n = this.lifeProSp[i];
                n.active = false;
            }
        } else {
            this.gameOver();
        }
    },

    gameOver() {
        this.multi = 0.2;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: 'shoot',
                score: this.score
            });
        }
        co.setRecord(this.score);
        let self = this;
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(()=>{
            this.resultNode.active = true;
            this.resultScore.string = '' + this.score;
        })))
    },

    back() {
        co.playAudio(this.clickAu);
        cc.director.loadScene('main');
    },

    restart() {
        co.playAudio(this.clickAu);
        cc.director.loadScene('game');
    },

    share() {
        co.playAudio(this.clickAu);
        let self = this;
        let str = '月亮送了我' + this.score + '分，你也来试试';
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: str,
                imageUrl: co.getSharePicPath(),
            });
        }
    },

    startGame() {
        this.initGame();
        let self = this;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(()=>{
                    self.mask.getComponent('mask').startGame();
                })
            )
        );
        this.mask.runAction(cc.moveTo(0.1, 0, 0));
    },

    start () {
        this.startGame();
    },

    // update (dt) {},
});
