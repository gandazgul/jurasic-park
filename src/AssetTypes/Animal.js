import { distance, randInt } from '../utils';
import Thing from './Thing';
import Egg from './Egg';

class Animal extends Thing {
    constructor(props) {
        super(props);

        this.weight = randInt(100, 200);
        this.minWeight = 20;

        this.color = '#F21414';
        this.species = this.type = 'Animal';
        this.sightDistance = 3;
        this.reach = 2;
        this.eaten = false;
        this.walked = false;
        this.gender = Math.random() < 0.5 ? 'male' : 'female';

        if (this.gender === 'female') {
            this.egg = null;
            this.color = 'yellow';
        }
    }

    mate(fieldOfView, withinReach) {
        if (this.gender === 'female' && this.egg) {
            return false;
        }

        const { females, males } = fieldOfView;
        let possibleMates = [];

        if (this.gender === 'male' && females.length) {
            if (withinReach.females.length) {
                possibleMates = withinReach.females;
            }
            else {
                // walk towards possible mate
                this.walk(females);

                return false;
            }
        }
        else if (this.gender === 'female' && males.length) {
            if (withinReach.males.length) {
                possibleMates = withinReach.males;
            }
            else {
                // walk towards possible mate
                this.walk(males);

                return false;
            }
        }

        const mate = possibleMates[randInt(0, possibleMates.length - 1)];

        if (mate) {
            if (this.gender === 'female') {
                this.egg = new Egg(this);
                this.color = 'red';

                return true;
            }
            else {
                return mate.mate({males: [this]}, {males: [this]})
            }
        }

        return false;
    }

    walkTowardsDestination(destination) {
        const deltaX = this.x - destination.x;
        const deltaY = this.y - destination.y;
        const xSign = deltaX < 0 ? -1 : 1;
        const ySign = deltaY < 0 ? -1 : 1;

        this.x += this.reach * xSign;
        this.y += this.reach * ySign;
    }

    walk(possibleDestinations = []) {
        const maxParkSize = 50;

        if (possibleDestinations.length) {
            const destination = possibleDestinations[randInt(0, possibleDestinations.length - 1)];

            this.walkTowardsDestination(destination);
        }
        else {
            this.x += (Math.random() < 0.5 ? 1 : -1) * this.reach;
            this.y += (Math.random() < 0.5 ? 1 : -1) * this.reach;
        }

        if (this.egg) {
            if (distance(this, this.egg) > this.reach) {
                this.walkTowardsDestination(this.egg);
            }
        }

        // Wrap around
        this.x = this.x < 0 ? maxParkSize + this.x : this.x % maxParkSize;
        this.y = this.y < 0 ? maxParkSize + this.y : this.y % maxParkSize;

        this.walked = true;
    }

    eat() {
        /* what? */
    }

    action(fieldOfView) {
        this.eaten = false;
        this.walked = false;
        super.action(fieldOfView);
    }
}

export default Animal;
