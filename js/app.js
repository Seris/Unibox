var universe = new Unibox({
  canvas: document.querySelector("canvas"),
  xAxisSize: 2 * 250000000e3,
  yAxisSize: 2 * 250000000e3,
  fps: 25,
  factor: 3600 * 24 * 10
});


var sun = universe.addEntity({
  name: "Sun",
  mass: 1.98855e30,
  pos: [0, 0],
  speed: [0, 0],
  drawingInfo: {
    diameter: 1392684e3,
    color: "yellow"
  }
});

var mercury = universe.addEntity({
  name: "Mercury",
  mass: 330.2e21,
  pos: [69817079e3],
  speed: [0, 38.86e3],
  drawingInfo: {
    diameter: 2 * 2439.7e3,
    color: "brown"
  }
});

var venus = universe.addEntity({
  name: "Venus",
  mass: 4.8676e24,
  pos: [0, 108942109e3],
  speed: [-35.02e3, 0],
  drawingInfo: {
    diameter: 6051.8e3,
    color: "#B2AEA2"
  }
});

var earth = universe.addEntity({
  name: "Earth",
  mass: 5.97219e24,
  pos: [149597870e3],
  speed: [0, 29.78e3],
  drawingInfo: {
    diameter: 2 * 6371e3 / 2,
    color: "blue"
  }
});

var moon = universe.addEntity({
  name: "Moon",
  mass: 7.3477e22,
  pos: [384399e3, 0],
  speed: [0, 1.022e3],
  relativeTo: earth,
  drawingInfo: {
    diameter: 2 * 1737.10e3,
    color: "grey"
  }
});

var mars = universe.addEntity({
  name: "Mars",
  mass: 641.85e21,
  pos: [0, -206644545e3],
  speed: [26.499e3],
  drawingInfo: {
    diameter: 2 * 6051.8e3,
    color: "#E29153"
  }
});

var jupiter = universe.addEntity({
  name: "Jupiter",
  mass: 1.8986e27,
  pos: [778547200e3, 0],
  speed: [0, 13.07e3],
  drawingInfo: {
    diameter: 2 * 69911e3,
    color: "#B6917F"
  }
});


universe.setFocus(sun);
universe.zoom = 0.3;

universe.refreshEntitiesForces();
universe.cleanCanvas();
universe.drawEntities();

var start = new Date().getTime();

setInterval(function(){
  universe.updateEntitiesForces();
  universe.updateEntitiesAcceleration();
  universe.updateEntitiesSpeed();
  universe.updateEntitiesPosition();

  universe.cleanCanvas();
  universe.drawEntities();

}, Math.ceil(1000 / universe.fps));
