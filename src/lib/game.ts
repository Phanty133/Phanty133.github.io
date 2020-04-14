import * as svg from "@svgdotjs/svg.js";

import Input from "./code/input";
import Output from "./code/output";
import Block from "./code/block";
import Vector2 from "./util/vector2";
import WireGhost from "./code/wireGhost";
import Connection from "./code/connection";
import Wire from "./code/wire";
import SpriteLoader from "./spriteLoader";
import { getFirstElementWithProperty } from "./util/domUtil";

export default class Game{
	scamCoin: number;
	svg: svg.Svg;
	activeWireGhost: WireGhost;
	scamCoinCounter: HTMLElement;

	constructor(codingArea: string){
		this.scamCoin = 0;
		this.svg = svg.SVG().addTo(codingArea).size(1920, 1080);
		this.scamCoinCounter = document.getElementById("mainCounter");

		const testBlock = new Block(this.svg, this);
		const testBlock2 = new Block(this.svg, this);

		testBlock.draw(SpriteLoader.sprites["blockDouble"]).addConnection(0).addConnection(1).setPos(new Vector2(500, 100));
		testBlock2.draw(SpriteLoader.sprites["blockAddition"]).addConnection(0).addConnection(0).addConnection(1).setPos(new Vector2(500, 250));

		const testMod = (values: Array<number>): number => {
			return values[0] * 2;
		}

		testBlock.valueModifier = testMod;
		testBlock2.valueModifier = (values: Array<number>): number => {
			return values[0] + values[1];
		};

		const testInput = new Input(this.svg, this);
		testInput.draw(SpriteLoader.sprites["blockInput"]).setPos(new Vector2(50, 100));

		const testInput2 = new Input(this.svg, this);
		testInput2.draw(SpriteLoader.sprites["blockInput"]).setPos(new Vector2(50, 200));

		const testOutput = new Output(this.svg, this);
		testOutput.draw(SpriteLoader.sprites["blockOutput"]).setPos(new Vector2(1000, 100));

		// Initialize connection wiring

		this.svg.on("mouseup", (event: MouseEvent) => { // If mouse up, update wire ghost
			if(this.activeWireGhost !== null){
				this.activeWireGhost.svg.remove();
				this.activeWireGhost.c0.parent.resetDraggable();
				
				const connectionEl: HTMLElement = getFirstElementWithProperty(document.elementFromPoint(event.x, event.y), "blockConnection", "blockConnection");

				if(connectionEl !== null){
					// @ts-ignore
					const targetConnection: Connection = connectionEl.instance.remember("connection");

					if(targetConnection.type !== this.activeWireGhost.c0.type && targetConnection.parent !== this.activeWireGhost.c0.parent){
						let wireOutput: Connection;
						let wireInput: Connection;

						if(targetConnection.type === 1){
							wireOutput = targetConnection;
						}
						else{
							wireInput = targetConnection;
						}
	
						if(this.activeWireGhost.c0.type === 1){
							wireOutput = this.activeWireGhost.c0;
						}
						else{
							wireInput = this.activeWireGhost.c0;
						}

						const newWire = new Wire(wireInput, wireOutput, this.svg);
						newWire.draw();
					}
				}

				this.activeWireGhost = null;
			}
		});

		this.svg.on("mousemove", (event: MouseEvent) => {
			if(this.activeWireGhost !== null){
				this.activeWireGhost.updateLine(this.svg.path().point(event.x, event.y));
			}
		});

		this.activeWireGhost = null;

		console.log("Game initialized!");

		setInterval(()=>{
			testInput.work();
			testInput2.work();
		}, 1000)
	}

	update(){
		this.scamCoinCounter.innerText = this.scamCoin.toString();
	}
}