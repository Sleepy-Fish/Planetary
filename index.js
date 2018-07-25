// module aliases
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

//create a world
var world = World.create({
    gravity:{x:0,y:0}
});

// create an engine
var engine = Engine.create({
    world: world
});

// create a renderer
var render = Render.create({
    element: document.getElementById('viewport'),
    engine: engine,
    options:{
        wireframes: false
    }
});


//create bodies
var ship = Bodies.circle(400,200,20)
Matter.Body.setParts(ship, [Bodies.polygon(400,200,3,15), Bodies.rectangle(420,200,35,23)])

var planet2 = Bodies.circle(480, 50, 10, {
    planet: true,
});

var planet3 = Bodies.circle(320, 90, 14, {
    planet: true,
});

var frame1 = Bodies.rectangle(400, 600, 800, 10, { isStatic: true });
var frame2 = Bodies.rectangle(0, 300, 10, 600, { isStatic: true });
var frame3 = Bodies.rectangle(800, 300, 10, 600, { isStatic: true });
var frame4 = Bodies.rectangle(400, 0, 800, 10, { isStatic: true });

// add all of the bodies to the world
World.add(world, [ship, planet2, planet3, frame1, frame2, frame3, frame4]);

var distance = function(p1, p2){
    var dx = p2.x-p1.x;
    var dy = p2.y-p1.y;
    return Math.sqrt((dx*dx)+(dy*dy));
}
var gravity = function(p1, p2, G){
    var r = distance(p1.position,p2.position);
    return G*(p1.mass*p2.mass)/(r*r);
}
var normalize = function(p1, p2, F){
    var dx = p2.x-p1.x;
    var dy = p2.y-p1.y;
    var ang = Math.atan2(dy,dx);
    return { x: F*Math.cos(ang), y: F*Math.sin(ang) };
}
var g_force = function(p1,p2){
    return normalize(p1.position, p2.position, gravity(p1,p2,0.2));
}

// run the engine
var time = 100;
var timer = 0;
var tick_orig = Runner.tick;
var tick_action = function(){
    for(body of world.bodies){
        if(body.planet){
            body.force = g_force(body,ship);
        }
    }
    if(ship.forward_thrust && !ship.stop_thrust){
        ship.force.x -= 0.0005*(Math.cos(ship.angle));
        ship.force.y -= 0.0005*(Math.sin(ship.angle));
    }
    if(ship.stop_thrust){
        ship.force.x = 0.0005*(Math.cos(ship.angle));
        ship.force.y = 0.0005*(Math.sin(ship.angle));
    }
    if(ship.left_thrust && !ship.right_thrust){
        ship.torque=-0.001;
    }
    if(ship.right_thrust && !ship.left_thrust){
        ship.torque=0.001;
    }
    //if(Matter.SAT.collides(ship, planet2).collided){

    //}
}
var tick_overload = function(r,e,t){
    if(t-timer > time) {
        timer = t;
        tick_action();
    }
    tick_orig(r,e,t);
}
Runner.tick = tick_overload;

var runner = Runner.run(engine);

// run the renderer
Render.run(render);

window.onkeydown = function(event){
    switch(event.key){
        case 'a':
        ship.left_thrust = true;
        break;
        case 'd':
        ship.right_thrust = true;
        break;
        case 'w':
        ship.forward_thrust = true;
        break;
        case 's':
        ship.stop_thrust = true;
        break;
        case ' ':
        console.log('space')
        console.log(ship);
        break;
    }
}

window.onkeyup = function(event){
    switch(event.key){
        case 'a':
        ship.left_thrust = false;
        break;
        case 'd':
        ship.right_thrust = false;
        break;
        case 'w':
        ship.forward_thrust = false;
        break;
        case 's':
        ship.stop_thrust = false;
        break;
    }
}