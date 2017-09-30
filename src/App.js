import React, {Component} from 'react';
import {randInt} from './utils';
import Tree from './AssetTypes/Tree';
import './App.css';
import config from './config.json';
import Brachiosaurus from "./AssetTypes/Brachiosaurus";

class App extends Component {
    static thingClasses = {
        tree: Tree,
        Brachiosaurus: Brachiosaurus,
    };

    constructor(props) {
        super(props);

        this.canvas = null;
        this.context = null;

        const things = [];
        const thingsLookup = {};

        config.things.forEach((thingProps) => {
            let minCount = thingProps.minCount;
            let maxCount = typeof thingProps.maxCount === 'undefined' ? minCount : thingProps.maxCount;
            const count = randInt(minCount, maxCount);

            for (let i = 0; i < count; i++) {
                const thing = new App.thingClasses[thingProps.type](thingProps);

                things.push(thing);
                thingsLookup[`${thing.x},${thing.y}`] = thing;
            }
        });

        this.state = {
            things,
            thingsLookup,
        };

        this.draw = this.draw.bind(this);
    }

    componentDidMount() {
        this.context = this.canvas.getContext('2d');
        this.draw();
    }

    draw() {
        const {thingsLookup, things} = this.state;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < things.length; i++) {
            const thing = things[i];
            const x = thing.x;
            const y = thing.y;
            const sightDistance = thing.sightDistance;
            const trees = [];
            const animalsOfOtherSpecies = [];
            const females = [];
            const males = [];

            // get the field of view
            if (sightDistance) {
                const startX = (x - sightDistance) < 0 ? 0 : x - sightDistance;
                const startY = (y - sightDistance) < 0 ? 0 : y - sightDistance;

                for (let x = startX; x <= startX + sightDistance * 2 + 1; x++) {
                    for (let y = startY; y <= startY + 5; y++) {
                        const seenThing = thingsLookup[`${x},${y}`];
                        if (seenThing && seenThing !== thing) {
                            switch (seenThing.type) {
                                case 'Tree':
                                    trees.push(seenThing);
                                    break;
                                case 'Animal':
                                    if (seenThing.species !== thing.species) {
                                        animalsOfOtherSpecies.push(seenThing);
                                    }
                                    else if (seenThing.gender === 'female') {
                                        females.push(seenThing);
                                    }
                                    else {
                                        males.push(seenThing);
                                    }
                                    break;
                                default:
                            }
                        }
                    }
                }
            }

            thing.action({
                trees,
                animalsOfOtherSpecies,
                males,
                females,
            });

            if (!thing.eaten) {
                thing.weight -= thing.weightLossPerCycle + randInt(0, 5);
            }

            if (thing.deathReason) {
                delete thingsLookup[`${thing.x},${thing.y}`];
                things[i] = undefined;
                console.log(thing, `died of ${thing.deathReason}`);
            }
            else {
                thing.draw(this.context);

                if (thing.walked) {
                    thingsLookup[`${thing.x},${thing.y}`] = thingsLookup[`${x},${y}`];
                    delete thingsLookup[`${x},${y}`];
                }

                if (thing.egg && things.indexOf(thing.egg) === -1) {
                    thingsLookup[`${thing.x + 1},${thing.y}`] = thing.egg;
                    thing.egg.x = thing.x + 1;
                    thing.egg.y = thing.y;

                    things.push(thing.egg);
                }
            }
        }

        this.setState({
            things: things.filter((val) => val),
        });

        setTimeout(this.draw, 1000);
    }

    render() {
        return (
            <div className="app">
                <canvas id="jurassicWorld"
                        width={500}
                        height={500}
                        ref={(canvas) => {
                            this.canvas = canvas;
                        }}>
                    Your browser doesn't support canvas.
                </canvas>
            </div>
        );
    }
}

export default App;
