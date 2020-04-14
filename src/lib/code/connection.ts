import Block from "./block";
import * as svg from "@svgdotjs/svg.js";
import Vector2 from "../util/vector2";
import WireGhost from "./wireGhost";
import Wire from "./wire";

export default class Connection {
	type: number; // Is the connection an input (0) or output (1)
	parent: Block;
	svg: svg.G;
	wire: Wire;
	value: number;

	constructor(parent: Block, type: number){
		this.type = type;
		this.parent = parent;
		this.svg = this.parent.svgG.group();
		this.wire = null;
		this.value = null;

		this.svg.remember("connection", this);

		this.svg.on("mousedown", (event:MouseEvent) => {
			// If mouse down, create a wire ghost

			if(this.wire !== null) this.wire.remove();

			this.parent.game.activeWireGhost = new WireGhost(this.svg.root(), this);
			this.parent.setDraggable(false);
		});
	}

	draw(customSvg: string = null): Connection{ // Draw the connection
		if(customSvg === null){
			this.svg.rect(25,25).attr({class: "defaultConnection useable", type: this.type.toString(), blockConnection: "blockConnection"});
		}
		else{
			this.svg.svg(customSvg).attr({class: "useable", type: this.type.toString(), blockConnection: "blockConnection"});
		}

		return this;
	}

	setPos(pos: Vector2): Connection{
		this.svg.translate(pos.x, pos.y);
		
		return this;
	}

	receive(value: number): Connection{
		this.value = value;

		if(this.parent.inputs.every((input: Connection) => input.value !== null)){ // Check if the block has received all its input values
			this.parent.work();
		}

		return this;
	}

	send(value: number): Connection{
		if(this.wire !== null) this.wire.broadcast(value);

		return this;
	}
}