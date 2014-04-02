/* global exports */
var moves = {
  'drift': function(robot){
    robot.x += robot.speed * Math.cos(robot.direction);
    robot.y += robot.speed * Math.sin(robot.direction);
  },
  'pilot': function(robot){
    robot.direction += (Math.random() - 0.5) * Math.PI/8;
    robot.x += robot.speed * Math.cos(robot.direction);
    robot.y += robot.speed * Math.sin(robot.direction);
  }
};

var types = {
  'asteroid': {
    radius: 0.05,
    speed: 0.0006,
    move: 'drift'
  },
  'ship': {
    radius: 0.02,
    speed: 0.009,
    move: 'pilot'
  },
  'bullet': {
    radius: 0.01,
    speed: 0.018,
    move: 'drift'
  }
};

var robotCounter = 0;

exports.types = function(){
  return Object.keys(types);
};

exports.create = function(type, scale){
  var model = types[type];
  return {
    id: robotCounter++,
    type: type,
    x: Math.random() * scale * 2 >> 1,
    y: Math.random() * scale * 2 >> 1,
    direction: Math.random() * Math.PI,
    speed: model.speed * scale,
    radius: model.radius * scale,
    move: model.move
  };
};

exports.move = function(robot, scale){
  moves[robot.move](robot);
  if (isNaN(robot.x) || isNaN(robot.x)){
    console.log(robot);
    robot.asd.fsdf.sd = 0;
  }
  robot.x = (robot.x + scale) % scale;
  robot.y = (robot.y + scale) % scale;
};
