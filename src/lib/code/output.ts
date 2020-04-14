import * as svg from "@svgdotjs/svg.js";
import Block from "./block";
import Connection from "./connection";
import Game from "../game";
import Vector2 from "../util/vector2";
import SpriteLoader from "../spriteLoader";

export default class Output extends Block{
	value: number;

	constructor(svgCont: svg.Svg, game: Game, initVal: number = 0){
		super(svgCont, game, false);
		this.value = initVal;

		this.inputs[0] = new Connection(this, 0);
	}

	draw(customSvg: string = null): Output{
		if(customSvg === null){
			this.svgG.rect(50, 50).attr({class: "cycleOutput useable"});
		}
		else{
			this.svgG.svg(customSvg);
		}	

		this.inputs[0].draw(SpriteLoader.sprites["connectionInput"]);
		this.inputs[0].setPos(new Vector2(12.5, 12.5));
		this.inputs[0].svg.forward();

		return this;
	}

	addConnection(): Output{
		console.warn("Property not used in Output object");
		
		return this;
	}

	work(): Output{
		this.game.scamCoin += this.inputs[0].value;
		this.game.update();

		return this;
	}
}