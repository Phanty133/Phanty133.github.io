import * as svg from "@svgdotjs/svg.js";
import Vector2 from "./vector2";

export const getSVGPos = (target:svg.Element, centered: boolean = false) => {
    const parents = target.parents();
    const targetTransform = target.transform();

    let x = targetTransform.translateX;
    let y = targetTransform.translateY;

    for(let parent of parents){
        if(parent === target.root()) break;

        const parentTransform = parent.transform();
        x+=parentTransform.translateX;
        y+=parentTransform.translateY;
    }

    if(centered){
        x+=target.width() / 2;
        y+=target.height() / 2;
    }

    return new Vector2(x, y);
}
