var SoundPlayer = function(){
	this.sounds = {};
	this.isMute = false;
	var self = this;
	this.play = {};
};
SoundPlayer.prototype.add = function(label, sound) {
	this.sounds[label] = sound;

	var self = this;
	// create labeled array of functions to pass them somewhere as variable
	this.play[label] = function(){
		if(!self.isMute) sound.play();
	}
};