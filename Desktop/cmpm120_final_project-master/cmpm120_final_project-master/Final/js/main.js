//-----------------------------------------------------------------------
// Phaser: Game World
// 		phaser template for a basic game world
//		use this as the base for a 2-D game project
// 		Written by: Philip Stanley
//-----------------------------------------------------------------------

//create phaser game variable
var game = new Phaser.Game(600, 600, Phaser.AUTO);

//***
//PRELOAD: 
//	load main art assets and move to the main menu
//***
var Preloader = function(game) {};
Preloader.prototype = {
	preload: function() {
		console.log("In Preloader: preload");
		//LOAD ART ASSETS
		game.load.path = "assets/img/";
		game.load.spritesheet('player', 'stb-Sheet.png', 32, 50);
		game.load.image('platform', 'platform.png');
		game.load.image('flame', 'flameParticle.png');
		//loads in json tilemap created with tiled(key,filename,
		//not exactly sure why null works here,the tilemap tool used)
		game.load.tilemap('Level0','Level0.json',null,Phaser.Tilemap.TILED_JSON);
		//loads the image used in tiled to create the map(key, filename,32x32)
		//the key can actually be called anything as well
		game.load.spritesheet('tilesheet','dirt-tiles.png',32,32);
	},
	create: function(){
		console.log("In Preloader: create");
		//go to next state
		game.state.start('MainMenu');
	}
}

//***
//MAINMENU: 
//	wait for player input to begin the game
//***
var MainMenu = function(game) {
	//Needed text
};
MainMenu.prototype = {
	create: function() {
		console.log("MainMenu: create");
		//give main menu instructions
		var introText = game.add.text(16, game.world.height/2,
						'PRESS SPACE TO CONTINUE', 
						{ fontSize: '32px', fill: '#FFF' });
	},
	update: function(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			//go to next state
			game.state.start('Game');
		}
	}
}

//***
//GAME: 
//	set up assets, play the game
//***
var Game = function(game) {
	var player;
	var npc;
	var flamethrower;
	var tilemap;
}

Game.prototype = {
	preload: function(){
		console.log("in Game Preloader");
	},
	create: function() {
		console.log("in Game Create");
		//create any player objects
		player = new Player(100, 100, 3, 'player');
				// player animations
		player.animations.add('idle', [0], 1, false);
		player.animations.add('walk', [1, 2, 3, 4, 5, 6, 7], 10, true);
		game.add.existing(player);
		flamethrower = player.emitter;

		//create any npc objects
		npc = new NPC(400, 100, 2, 'player');
		game.add.existing(npc);

		game.physics.startSystem(Phaser.Physics.ARCADE);

		//this is whatever you used for the key when you loaded it in
		map = game.add.tilemap('Level0');

		//add a tileset image to create the map-object(name,key used above when loading image)
		//name has to be the one specified in the json file
		// under tileset in the name category
		map.addTilesetImage('Level0_tilesheet','tilesheet');

		//initiates new layer, must be exact same name as specified in json
		layer1 = map.createLayer ('Tile Layer 1');

		//entire grid will have collision set
		map.setCollisionByExclusion([]);

		//fits layer to the game world
		layer1.resizeWorld();


		//create a platform object
		//platforms = game.add.group();
		//platforms.enableBody = true;
		//var ground = platforms.create(0, game.world.height -64, 'platform');
		//ground.scale.setTo(2, 2);
		//ground.body.immovable = true;
		//start / allow physics
		//game.physics.startSystem(Phaser.Physics.ARCADE);

		game.camera.follow(player);
	
	},
	update:function() {		// add game logic
		// some logic is handled within other objects
		//handling animations here because i dont understand why
		//	it wont work the way it should
		if(player.body.velocity.x != 0) player.animations.play('walk', 15, true);
		else player.animations.play('idle');

		game.physics.arcade.collide(Player,layer1);

		//game.physics.arcade.collide(flamethrower, npc, burning, null, this);
	}
}



//Add the states to the game and start up.
//	additional logic can be used to traverse states
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('Game', Game);
game.state.start('Preloader');
