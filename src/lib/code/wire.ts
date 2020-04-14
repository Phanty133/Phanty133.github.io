import Connection from "./connection";
import * as svg from "@svgdotjs/svg.js";
import { getSVGPos } from "../util/svgUtil";

export default class Wire{
	input: Connection;
	output: Connection;
	svgG: svg.G;
	svgLine: svg.Line;

	constructor(input: Connection, output: Connection, svgC: svg.Svg){
		this.input = input;
		this.output = output;

		this.input.wire = this;
		this.output.wire = this;

		this.svgG = svgC.group();

		this.svgG.on("mousedown", (event: MouseEvent)=>{ // Check if click was meant for connection
			// @ts-ignore
			const elBeneath:svg.G = document.elementsFromPoint(event.x, event.y)[1].instance.parent();
			const connection: Connection = elBeneath.remember("connection");

			if(connection !== undefined){
				if(connection === this.input || connection === this.output){
					connection.svg.fire("mousedown");
				}
			}
		});
	}

	draw(): Wire{ // Draw the connection
		const inputPos = getSVGPos(this.input.svg, true);
		const outputPos = getSVGPos(this.output.svg, true);

		this.svgLine = this.svgG.line(inputPos.x, inputPos.y, outputPos.x, outputPos.y).stroke({ color: '#FF7700', width: 15, linecap: 'round' });

		return this;
	}

	updateLine(): Wire{
		const inputPos = getSVGPos(this.input.svg, true);
		const outputPos = getSVGPos(this.output.svg, true);

		this.svgLine.plot(inputPos.x, inputPos.y, outputPos.x, outputPos.y);

		return this;
	}

	remove(): void{ // Deletes wire
		this.svgG.remove();
		this.input.wire = null;
		this.output.wire = null;
	}

	broadcast(value: number): Wire{
		this.input.receive(value);

		return this;
	}
}