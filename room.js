function openModal(id)
{
  document.getElementById(id).style.display = "flex";
}

function closeModal(id)
{
  document.getElementById(id).style.display = "none";
}

function focusGameCanvas()
{
  const canv = document.querySelector("canvas");
  if (!canv) return;
  canv.tabIndex = 0;           
  canv.style.outline = "none";
  try {
    canv.focus();
    console.log("Canvas focused for keyboard input");
  } catch (e) {
    console.warn("Canvas focus failed:", e);
  }
}

window.addEventListener("load", () => {
  setTimeout(focusGameCanvas, 50);
  document.addEventListener("pointerdown", focusGameCanvas, { once: true });
});

//initialize Kaboom
kaboom({
  width: 800,
  height: 480,
  background: [0, 0, 0],
  scale: 2
});

//loading art assets
loadSprite("room", "room.png");    
loadSprite("location", "location.png");

loadSprite("player_front", "player_front.png",
{
  sliceX: 3,
  anims: {
    idle: { from: 0, to: 0 },
    walk: { from: 0, to: 2, loop: true }
  }
});

loadSprite("player_back", "player_back.png",
{
  sliceX: 3,
  anims: {
    idle: { from: 0, to: 0 },
    walk: { from: 0, to: 2, loop: true }
  }
});

loadSprite("player_left", "player_left.png",
{
  sliceX: 3,
  anims: {
    idle: { from: 0, to: 0 },
    walk: { from: 0, to: 2, loop: true }
  }
});

loadSprite("player_right", "player_right.png",
{
  sliceX: 3,
  anims: {
    idle: { from: 0, to: 0 },
    walk: { from: 0, to: 2, loop: true }
  }
});

add([
  sprite("room"),
  z(0),
  pos(0, 0)
]);

//create location markers
const projectsLocation = add([
  sprite("location"),
  pos(164, 100),
  scale(0.5),
  z(2),
  area(),
  "hotspot"
]);

const experienceLocation = add([
  sprite("location"),
  pos(164, 260),
  scale(0.5),
  z(2),
  area(),
  "hotspot"
]);

const aboutLocation = add([
  sprite("location"),
  pos(615, 300),
  scale(0.5),
  z(2),
  area(),
  "hotspot"
]);

//defaulting player 
let currentDir = "front";
const player = add([
  sprite("player_front"),
  pos(640, 125),
  z(1), 
  scale(1.5),
  area()
]);

player.play("idle");

const SPEED = 80;

//set player direction and animation
function setDirection(dir, anim)
{
  if (currentDir !== dir) 
  {
    player.use(sprite("player_" + dir));
    currentDir = dir;
    player.play(anim);
  }
}

//movement
onKeyDown("left", () =>
{
  setDirection("left", "walk");
  player.move(-SPEED, 0);
});

onKeyDown("right", () => {
  setDirection("right", "walk");
  player.move(SPEED, 0);
});

onKeyDown("up", () => {
  setDirection("back", "walk");
  player.move(0, -SPEED);
});

onKeyDown("down", () => {
  setDirection("front", "walk");
  player.move(0, SPEED);
});

// WASD mappings
onKeyDown("a", () => {
  console.log("keydown: a");
  setDirection("left", "walk");
  player.move(-SPEED, 0);
});
onKeyDown("d", () => {
  console.log("keydown: d");
  setDirection("right", "walk");
  player.move(SPEED, 0);
});
onKeyDown("w", () => {
  console.log("keydown: w");
  setDirection("back", "walk");
  player.move(0, -SPEED);
});
onKeyDown("s", () => {
  console.log("keydown: s");
  setDirection("front", "walk");
  player.move(0, SPEED);
});

//stop walking animation when no keys are pressed
onKeyRelease(() => {
  if (
    !isKeyDown("left") &&
    !isKeyDown("right") &&
    !isKeyDown("up") &&
    !isKeyDown("down")
  ) {
    player.play("idle");
  }
});

//tracking to prevent multiple modals from opening
let modalCooldowns =
{
  about: false,
  projects: false,
  experience: false
};

//hotspot collisions
player.onCollide("hotspot", (hotspot) => {
  console.log("Collision detected with hotspot at:", hotspot.pos);
  
  if (hotspot === aboutLocation && !modalCooldowns.about)
  {
    openModal("aboutModal");
    modalCooldowns.about = true;
    setTimeout(() => { modalCooldowns.about = false; }, 1000); 
  }
  else if (hotspot === projectsLocation && !modalCooldowns.projects)
  {
    openModal("projectsModal");
    modalCooldowns.projects = true;
    setTimeout(() => { modalCooldowns.projects = false; }, 1000);
  } 
  else if (hotspot === experienceLocation && !modalCooldowns.experience)
  {
    openModal("experienceModal");
    modalCooldowns.experience = true;
    setTimeout(() => { modalCooldowns.experience = false; }, 1000);
  }
});