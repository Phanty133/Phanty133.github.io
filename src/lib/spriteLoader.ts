export default class SpriteLoader{
	public static sprites: Record<string, string>; // All the loaded game sprites
	public static spriteList: Array<string>; // A list of all the game sprites to be loaded

	constructor(){
		SpriteLoader.sprites = {};

		SpriteLoader.spriteList = [
			"blockDouble",
			"connectionInput",
			"connectionOutput",
			"blockInput",
			"blockOutput",
			"blockAddition"			
		];
	}

	loadAllSprites(): Promise<number[]>{
		let sprite: string;
		let promises: Array<Promise<number>> = [];

		for(sprite of SpriteLoader.spriteList){
			promises.push(this.loadSprite(sprite));
		}

		return Promise.all(promises);
	}

	loadSprite(sprite: string): Promise<number>{
		return new Promise<number>((resolve, reject) => {
			const req = new XMLHttpRequest();

			req.onreadystatechange = function(){
				if(this.readyState === 4){
					if(this.status === 200){
						SpriteLoader.sprites[sprite] = this.responseText;
						resolve(200);
					}
					else{
						console.error("Unable to load sprite ", sprite, "! Error ", this.status);
						reject(this.status);
					}
				}
			}

			req.open("GET", `/svg/${sprite}.svg`);
			req.send();
		});
	}
}