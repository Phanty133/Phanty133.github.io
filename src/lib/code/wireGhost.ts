import * as svg from "@svgdotjs/svg.js";
import Vector2 from "../util/vector2";
import Connection from "./connection";
import { getSVGPos } from "../util/svgUtil";

export default class WireGhost{
	svg: svg.Line;
	p0: Vector2;
	c0: Connection;

	constructor(svgCont: svg.Svg, c0: Connection){
		this.p0 = getSVGPos(c0.svg, true);

		// Create line
		this.svg = svgCont.line(this.p0.x, this.p0.y, this.p0.x, this.p0.y);
		this.svg.stroke({ color: 'rgba(25, 25, 25, 0.5)', width: 15, linecap: 'round' });
		this.c0 = c0;
	}

	updateLine(p1: Vector2){
		this.svg.plot(this.p0.x, this.p0.y, p1.x, p1.y);

		return this;
	}
}