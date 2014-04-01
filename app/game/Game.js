/* global require, exports */
var robotMethods = require('./robot.js');
//=========================================================
var Game = function(){
  this.map = [];
  this.scale = 300;
  this.init();
};

Game.prototype.init = function(){
  // for (var i=0; i < 3; i++){
  //   this.addRobot(robotMethods.types()[0]);
  //   this.addRobot(robotMethods.types()[1]);
  // }
};

Game.prototype.turn = function(){
  var scale = this.scale;
  this.map.forEach(function(robot){
    if (robot){
      robotMethods.move(robot, scale);
    }
  });
};

Game.prototype.addRobot = function(type){
  var robot = robotMethods.create(type, this.scale);
  this.map[robot.id] = robot;
  return robot;
};

Game.prototype.addBullet = function(player){
  var bullet = robotMethods.create('bullet', this.scale);
  bullet.x = player.x + player.radius * 2 * Math.cos(player.direction);
  bullet.y = player.y + player.radius * 2 * Math.sin(player.direction);
  bullet.direction = player.direction;
  console.log(bullet);
  this.map[bullet.id] = bullet;
};

Game.prototype.createPlayer = function(name){
  var player = robotMethods.create('ship', this.scale);
  player.name = name;
  player.type = 'player';
  player.move = 'drift';
  this.map[player.id] = player;
  return player;
};


var playerActions = {
  'forward': function(player){
    player.speed = 0.001;
  },
  'stop': function(player){
    player.speed = 0;
  },
  'left': function(player){
    player.direction -= Math.random() * Math.PI/32;
  },
  'right': function(player){
    player.direction += Math.random() * Math.PI/32;
  },
  'shoot': function(player, game){
    game.addBullet(player);
  }
};

Game.prototype.playerAction = function(player, action){
  console.log(action);
  playerActions[action.action](player, this);
};

exports.Game = Game;
