import * as svg from "@svgdotjs/svg.js";
import Connection from "./connection";
import Vector2 from "../util/vector2";
import Game from "../game";
import "@svgdotjs/svg.draggable.js";
import SpriteLoader from "../spriteLoader";

export default class Block{
	svgG: svg.G;
	svgC: svg.Svg;
	inputs: Array<Connection>;
	outputs: Array<Connection>;
	game: Game;
	draggable: boolean;
	draggableDefault: boolean;

	constructor(svgC: svg.Svg, game: Game, draggable: boolean = true){
		this.game = game;

		this.svgC = svgC;
		this.svgG = this.svgC.group();

		this.inputs = [];
		this.outputs = [];

		this.draggable = draggable;
		this.draggableDefault = draggable;
		this.svgG.draggable(draggable);

		this.svgG.on("dragmove.namespace", (e:CustomEvent) => {
			const box = e.detail.box;
			e.preventDefault();
			this.svgG.translate(box.x, box.y);

			// Update wires

			for(let input of this.inputs){
				input.wire.updateLine();
			}

			for(let output of this.outputs){
				output.wire.updateLine();
			}
		});
	}

	draw(customSvg: string = null): Block{
		if(customSvg === null){
			this.svgG.rect(200, 100).attr({class: "defaultBlock"});
		}
		else{
			this.svgG.svg(customSvg);
		}

		return this;
	}

	addConnection(type: number): Block{
		const newCon = new Connection(this, type);

		if(type === 0){
			newCon.draw(SpriteLoader.sprites["connectionInput"]);
			newCon.setPos(new Vector2(0, this.inputs.length * 30 + 5));

			this.inputs.push(newCon);
		}
		else if(type === 1){
			newCon.draw(SpriteLoader.sprites["connectionOutput"]);
			newCon.setPos(new Vector2(175, this.outputs.length * 30 + 5));

			this.outputs.push(newCon);
		}

		return this;
	}

	setPos(pos: Vector2): Block{
		this.svgG.translate(pos.x, pos.y);

		return this;
	}

	setDraggable(isDraggable: boolean): Block{
		this.draggable = isDraggable;
		this.svgG.draggable(isDraggable);

		return this;
	}

	resetDraggable(): Block{ // Sets draggable to default value
		this.setDraggable(this.draggableDefault);
		return this;
	}

	work(): void { // The function that processes inputs/outputs every cycle
		const inputValues: Array<number> = this.inputs.map((input: Connection)=>input.value);

		this.outputs[0].send(this.valueModifier(inputValues));
		
		for(let input of this.inputs){
			input.value = null;
		}

		return;
	}

	valueModifier(values: Array<number>): number{
		console.warn("Value modifier function not implemented!");

		return values[0]; // Return first value by default
	}
}