import Animal from './Animal';
import {randInt} from "../utils";

class Brachiosaurus extends Animal {
    constructor(props) {
        super(props);

        this.species = 'Brachiosaurus';

        this.weight += 100;
        this.minWeight = 50;
        this.maxWeight = randInt(this.weight, this.weight + 50);
        this.weightLossPerCycle = 5;

        // this.color = '#4a5722';
        this.sightDistance = 15;
    }

    eat(trees) {
        const amountToEat = randInt(5, 10);
        this.weight += amountToEat;
        trees[randInt(0, trees.length - 1)].weight -= amountToEat;

        this.eaten = true;
    }

    action(fieldOfView) {
        super.action(fieldOfView);

        if (this.deathReason) {
            return;
        }

        const {trees, females, males} = fieldOfView;

        const withinReach = this.getWithinReach(fieldOfView);

        if (withinReach.trees.length && this.weight <= this.maxWeight) {
            this.eat(withinReach.trees);

            // Announce the location of the food item
        }
        // walk towards food
        else if (trees.length) {
            this.walk(trees);
        }
        // try to mate
        else if (this.mate(fieldOfView, withinReach)){
            // mated
        }
        else {
            // walk randomly
            this.walk();
        }
    }
}

export default Brachiosaurus;
