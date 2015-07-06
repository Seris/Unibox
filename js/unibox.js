function Unibox(options){
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");

  this.entities = [];
  this.forces = [];

  this.center = [
    this.canvas.width / 2,
    this.canvas.height / 2
  ];

  this.focus = options.focus;

  this.xAxisSize = options.xAxisSize;
  this.yAxisSize = options.yAxisSize;

  this.xUnit = this.canvas.width / this.xAxisSize;
  this.yUnit = this.canvas.height / this.yAxisSize;

  this.zoom = 1;

  this.fps = options.fps;
  this.factor = options.factor;
  this.timeStep = this.factor / this.fps;
}

Unibox.prototype.addEntity = function(entity){
  if(entity.constructor !== Unibox){
    entity = new Unibox.Entity(entity);
  }
  this.entities.push(entity);
  return entity;
};

Unibox.prototype.refreshEntitiesForces = function(){
  this.forces = [];

  for (var i = 0; i < this.entities.length; i++){
    this.entities[i].forces = [];
  }

  for (var i = 0; i < this.entities.length; i++) {
    for (var j = i+1; j < this.entities.length; j++) {
      this.forces.push(
        Unibox.Force.create(this.entities[i], this.entities[j]));
    }
  }
};

Unibox.prototype.updateEntitiesForces = function(){
  for (var i = 0; i < this.forces.length; i++) {
    this.forces[i].update();
  };
};

Unibox.prototype.updateEntitiesAcceleration = function(){
  for (var i = 0; i < this.entities.length; i++) {
    var forces = this.entities[i].forces, totalForce = new UniVector();
    for(var j = 0; j < forces.length; j++){
      totalForce.add_s(forces[j].getForceVector(this.entities[i]));
    };
    this.entities[i].acc = totalForce.div_s(this.entities[i].mass);
  };
};

Unibox.prototype.updateEntitiesSpeed = function(){
  for (var i = 0; i < this.entities.length; i++) {
    this.entities[i].speed.add_s(this.entities[i].acc.mul(this.timeStep));
  }
};

Unibox.prototype.updateEntitiesPosition = function(){
  for (var i = 0; i < this.entities.length; i++) {
    if(!this.entities[i].locked){
      this.entities[i].pos.add_s(this.entities[i].speed.mul(this.timeStep));
    }
  }
};

Unibox.prototype.setFocus = function(entity){
  this.focus = entity;
};

Unibox.prototype.setZoom = function(zoom){
  this.zoom = zoom;
};

Unibox.prototype.setFPS = function(fps){
  this.fps = fps;
  this.timeStep = this.factor / this.fps;
};

Unibox.prototype.setTimeFactor = function(factor){
  this.factor = factor;
  this.timeStep = this.factor / this.fps;
};

Unibox.prototype.drawEntities = function(){
  for (var i = 0; i < this.entities.length; i++) {
    var diameter = Math.round(this.entities[i].drawingInfo.diameter),
        radius = Math.round(diameter * this.xUnit * this.zoom),
        x = Math.round(this.center[0] + (this.focus.pos.get(0)- this.entities[i].pos.get(0)) * this.xUnit * this.zoom),
        y = Math.round(this.center[1] + (this.focus.pos.get(1) - this.entities[i].pos.get(1)) * this.yUnit * this.zoom);

    if(radius === 0){
      radius = 0.7;
    }

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.entities[i].drawingInfo.color;
    this.ctx.fill();
  }
};

Unibox.prototype.cleanCanvas = function(){
  this.ctx.fillStyle = "black";
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};


Unibox.Entity = function(options){
  this.constructor = Unibox.Entity;

  this.name = options.name || null;

  this.mass = options.mass;

  this.forces = [];
  this.relativeTo = null;

  this.pos = new UniVector(options.pos);
  this.speed = new UniVector(options.speed);
  this.acc = new UniVector();

  this.locked = options.locked || false;
  this.drawingInfo = options.drawingInfo || null;

  if(options.relativeTo instanceof Unibox.Entity){
    this.relativeTo = options.relativeTo;
    this.pos.add_s(options.relativeTo.pos);
    console.log(this.speed.toString());
    this.speed.add_s(options.relativeTo.speed);
    console.log(this.speed.toString());
  }
}


Unibox.Force = function(ent1, ent2){
  this.constructor = Unibox.Force;

  this.value = 0;
  this.ent1 = ent1;
  this.ent2 = ent2;

  this.vector = null;
};

Unibox.Force.prototype.getDistanceSquared = function(){
  return this.ent1.pos.sub(this.ent2.pos).getNorm(true);
};

Unibox.Force.prototype.update = function(){
  this.value = Unibox.G * (this.ent1.mass * this.ent2.mass) / this.getDistanceSquared();
  this.vector = this.ent2.pos.sub(this.ent1.pos).getUnitVector().mul_s(this.value);
};

Unibox.Force.prototype.getForceVector = function(from){
  if(from === this.ent1){
    return this.vector.copy();
  } else {
    return this.vector.mul(-1);
  }
};

Unibox.Force.create = function(ent1, ent2){
  var force = new Unibox.Force(ent1, ent2);
  ent1.forces.push(force);
  ent2.forces.push(force);
  return force;
};

Unibox.G = 6.67384e-11;
