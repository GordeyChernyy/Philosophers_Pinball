var GameManager = function() {
    this.curEvent;

    var self = this;

    this.events = {
        startScreen: function() {
            self.curEvent = 'startScreen';
            self.runEvent('onStartScreen');
            print('startScreen');
        },
        levelStart: function() {
            self.curEvent = 'levelStart';
            self.runEvent('onLevelStart');
            print('levelStart');
        },
        levelFinish: function() {
            self.curEvent = 'levelFinish';
            self.runEvent('onLevelFinish');
            print('levelFinish');
        },
        endScreen: function() {
            self.runEvent('onLevelFinish');
            self.curEvent = 'endScreen';
            print('endScreen');
        }
    }
    
    this.onEvents = {
    	onStartScreen : [],
    	onLevelStart : [],
    	onLevelFinish : [],
    	onEndScreen : []
    };

    this.runEvent = function(eventName){
    	for (var i = 0; i < this.onEvents[eventName].length; i++) {
    		this.onEvents[eventName][i]();
    	}
    }
}
GameManager.prototype.subscribe = function(eventName, func) {
	this.onEvents[eventName].push(endScreen) ;
};
GameManager.prototype.set = function(state) {
    this.events[state]();
};