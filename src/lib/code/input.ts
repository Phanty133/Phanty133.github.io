import * as svg from "@svgdotjs/svg.js";
import Block from "./block";
import Connection from "./connection";
import Game from "../game";
import Vector2 from "../util/vector2";
import SpriteLoader from "../spriteLoader";

export default class Input extends Block{
	value: number;
	output: Connection;

	constructor(svgCont: svg.Svg, game: Game, initVal: number = 1){
		super(svgCont, game, false);
		this.value = initVal;

		this.output = new Connection(this, 1);
	}

	draw(customSvg: string = null): Input{
		if(customSvg === null){
			this.svgG.rect(50, 50).attr({class: "cycleInput useable"});
		}
		else{
			this.svgG.svg(customSvg);
		}	

		this.output.draw(SpriteLoader.sprites["connectionOutput"]);
		this.output.setPos(new Vector2(12.5, 12.5));
		this.output.svg.forward();

		return this;
	}

	addConnection(): Input{
		console.warn("Property not used in Input object");
		return this;
	}

	work(): Input{
		if(this.output.wire !== null){
			this.output.send(this.value);
		}

		return this;
	}
}