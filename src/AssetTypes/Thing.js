import config from '../config';
import { randInt, distance } from '../utils';

class Thing {
    constructor() {
        this.age = randInt(1, 100);
        this.maxAge = 100;

        this.weight = 0;
        this.minWeight = 0;
        this.maxWeight = 0;

        this.color = '#000000';

        this.actionDone = false;
        this.deathReason = '';

        this.x = randInt(0, 50);
        this.y = randInt(0, 50);
    }

    getWithinReach(fieldOfView) {
        const filter = (thing) => {
            const dist = distance(thing, this);

            return dist <= this.reach;
        };

        const trees = fieldOfView.trees.filter(filter);
        const animalsOfOtherSpecies = fieldOfView.animalsOfOtherSpecies.filter(filter);
        const females = fieldOfView.females.filter(filter);
        const males = fieldOfView.males.filter(filter);

        return {
            trees,
            animalsOfOtherSpecies,
            females,
            males,
        };
    }

    action() {
        this.actionDone = true;
        this.age++;

        if (this.age > this.maxAge) {
            // this.deathReason = 'old age';
            // return;
        }

        if (this.weight < this.minWeight) {
            // this.deathReason = 'hunger';
            // return;
        }
    }

    /**
     * Draw a representation of the thing on the canvas
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '';
        ctx.beginPath();
        ctx.arc(this.x * config.animalWidth + 5, this.y * config.animalWidth + 5, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

export default Thing;
