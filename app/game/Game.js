/* global require, exports */
var robotMethods = require('./robot.js');
//=========================================================
var Game = function(){
  this.map = [];
  this.scale = 1000;
  this.init();
};

Game.prototype.init = function(){
  for (var i=0; i < 3; i++){
    this.addRobot(robotMethods.types()[0]);
    this.addRobot(robotMethods.types()[1]);
  }
};

var collision = function(obj, target, index, map){
  if(obj.type === 'bullet' && target.type !== 'bullet'){
    map[index] = false;
  } else if (obj.type === 'player'){
    obj.score -= 1;
  }
};

Game.prototype.turn = function(){
  var scale = this.scale;
  var map = this.map;
  map.forEach(function(robot, ri){
    if (robot){
      robotMethods.move(robot, scale);
      map.forEach(function(target, ti){
        if (!target || ri === ti){
          return;
        }
        var dx = robot.x - target.x;
        var dy = robot.y - target.y;
        var d = Math.pow(dx*dx + dy*dy, 1/2);
        //console.log(d, robot.type, robot.radius, target.type, target.radius);
        if (d >= robot.radius + target.radius){
          return;
        }
        collision(robot, target, ri, map);
        collision(target, robot, ti, map);
      });
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
  console.log(this.map);
};

Game.prototype.createPlayer = function(name){
  var player = robotMethods.create('ship', this.scale);
  player.name = name;
  player.type = 'player';
  player.move = 'drift';
  player.speed = 0.001 * this.scale;
  player.score = 0;
  this.map[player.id] = player;
  return player;
};


var playerActions = {
  'forward': function(player, game){
    player.speed = 0.009 * game.scale;
  },
  'stop': function(player, game){
    player.speed = 0 * game.scale;
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
  playerActions[action.action](player, this);
};

exports.Game = Game;
