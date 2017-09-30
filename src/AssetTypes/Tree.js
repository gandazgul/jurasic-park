import {randInt} from '../utils';
import Thing from './Thing';

class Tree extends Thing {
    constructor(props) {
        super(props);

        this.weight = randInt(100, 200);
        this.minWeight = 20;
        this.maxWeight = randInt(200, 250);

        this.color = '#BADA55';
        this.species = this.type = 'Tree';

        // trees eat from the sun
        this.eaten = true;
    }

    grow() {
        if (this.weight < this.maxWeight) {
            this.weight += randInt(2, 5);
        }
    }

    action() {
        super.action();

        this.grow();
    }
}

export default Tree;
