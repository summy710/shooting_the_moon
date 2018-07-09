var common = {
    bShake:true,
    bSound:true,
    record:0,

    getRecord() {
        if (CC_WECHATGAME) {
            let data = wx.getStorageSync('record');
            if (data != undefined && data != null && data != 'undefined' && data != 'null' && data != '') this.record = parseInt(data);
            return this.record;
        }
        return this.record;
    },

    setRecord(score) {
        if (this.record >= score) return;
        this.record = score;
        if (CC_WECHATGAME) {
            wx.setStorageSync('record', '' + this.record);
        }
    },

    getSoundStatus() {
        if (CC_WECHATGAME) {
            let data = wx.getStorageSync('sound');
            if (data != undefined && data != null && data != 'undefined' && data != 'null' && data != '') this.bSound = data !== 'false';
            return this.bSound;
        }
        return this.bSound;
    },

    changeSoundStatus(func) {
        this.bSound = !this.bSound;
        if (CC_WECHATGAME) {
            wx.setStorageSync('sound', '' + this.bSound);
        }
        if (func) func(this.bSound);
        if (this.bSound) {
            this.playBGM();
        } else {
            this.stopBGM();
        }
    },

    getShakeStatus() {
        if (CC_WECHATGAME) {
            let data = wx.getStorageSync('shake');
            if (data != undefined && data != null && data != 'undefined' && data != 'null' && data != '') this.bShake = data !== 'false';
            return this.bShake;
        }
        return this.bShake;
    },

    changeShakeStatus(func) {
        this.bShake = !this.bShake;
        if (CC_WECHATGAME) {
            wx.setStorageSync('shake', '' + this.bShake);
        }
        if (func) func(this.bShake);
    },

    getSharePicPath() {
        return 'share.jpg';
    },

    showTip (node, str) {
        cc.loader.loadRes('/prefab/tips', cc.Prefab, function(err, prefab) {
            if (err) return;
            let n = cc.instantiate(prefab);
            n.parent = node;
            n.zIndex = 999;
            n.getComponent('tips').init(str);
        });
    },

    playAudio(audioClip) {
        if (!this.bSound) return;
        if (CC_WECHATGAME) {
            this.context = wx.createInnerAudioContext();
            this.context.autoplay = true;
            this.context.loop = false;
            this.context.src = audioClip + '.mp3';
            this.context.play();  
        } else {
            // cc.audioEngine.play(audioClip, false, 1);
            cc.loader.load(cc.url.raw('resources/audio/' + audioClip +'.mp3'), function(err, clip) {
                this.bgm = cc.audioEngine.play(clip, false, 1);
            }.bind(this));
        }
    },

    playBGM() {
        if (this.bPlay || !this.bSound) return;
        if (CC_WECHATGAME) {
            if (this.music) return;
            this.music = wx.createInnerAudioContext();
            this.music.autoplay = true;
            this.music.loop = true;
            this.music.volume = 0.5;
            this.music.src = 'BGM.mp3';
            this.music.play();
            let self = this;
            wx.onShow(function () {
              self.music.play()
            })
        } else {
            if (this.bgm) return;
            cc.loader.load(cc.url.raw('resources/audio/BGM.mp3'), function(err, clip) {
                this.bgm = cc.audioEngine.play(clip, true, 0.5);
            }.bind(this));
        }
        this.bPlay = true;
    },

    stopBGM() {
        this.bPlay = false;
        if (CC_WECHATGAME) {
            if (this.music) this.music.stop();
            this.music = null;
        } else {
            if (this.bgm) cc.audioEngine.stop(this.bgm);
            this.bgm = null;
        }
    }
};

module.exports = common;