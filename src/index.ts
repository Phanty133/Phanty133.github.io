import Game from "./lib/game";
import * as _SVG from "@svgdotjs/svg.js"; 
import SpriteLoader from "./lib/spriteLoader";

const spriteLoader = new SpriteLoader();

spriteLoader.loadAllSprites().then(()=>{
    new Game("#codingArea");
}).catch(()=>{
    console.warn("Error loading sprites!");
});