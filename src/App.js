import React, { Component } from 'react';
import { randInt } from './utils';
import Tree from './AssetTypes/Tree';
import './App.css';
import config from './config';
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
            tick: 1,
        };

        this.draw = this.draw.bind(this);
    }

    componentDidMount() {
        this.context = this.canvas.getContext('2d');
        this.draw();
    }

    static getFieldOfVision(x, y, sightDistance, thingsLookup, thing) {
        const fieldOfVision = {
            trees: [],
            animalsOfOtherSpecies: [],
            females: [],
            males: [],
        };

        if (sightDistance) {


            const startX = (x - sightDistance) < 0 ? 0 : x - sightDistance;
            const startY = (y - sightDistance) < 0 ? 0 : y - sightDistance;

            for (let x = startX; x <= startX + sightDistance * 2 + 1; x++) {
                for (let y = startY; y <= startY + sightDistance * 2 + 1; y++) {
                    const seenThing = thingsLookup[`${x},${y}`];
                    if (seenThing && seenThing !== thing) {
                        switch (seenThing.type) {
                            case 'Tree':
                                fieldOfVision.trees.push(seenThing);
                                break;
                            case 'Animal':
                                if (seenThing.species !== thing.species) {
                                    fieldOfVision.animalsOfOtherSpecies.push(seenThing);
                                }
                                else if (seenThing.gender === 'female') {
                                    fieldOfVision.females.push(seenThing);
                                }
                                else {
                                    fieldOfVision.males.push(seenThing);
                                }
                                break;
                            default:
                        }
                    }
                }
            }
        }

        return fieldOfVision;
    }

    draw() {
        const { thingsLookup, things, tick } = this.state;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < things.length; i++) {
            const thing = things[i];
            const x = thing.x;
            const y = thing.y;
            const sightDistance = thing.sightDistance;

            // get the field of view
            const fieldOfVision = App.getFieldOfVision(x, y, sightDistance, thingsLookup, thing);

            thing.action(fieldOfVision);

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

                if (thing.walked && (thing.x !== x || thing.y !== y)) {
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
            thingsLookup,
            tick: tick + 1,
        });

        setTimeout(this.draw, 1000);
    }

    render() {
        return (
            <div className="app"
                 style={{
                     width: config.width,
                     height: config.height,
                 }}
            >
                <canvas id="jurassicWorld"
                        width={config.width}
                        height={config.height}
                        ref={(canvas) => {
                            this.canvas = canvas;
                        }}>
                    Your browser doesn't support canvas.
                </canvas>
                <p className="park-cycle">Cycle: {this.state.tick}</p>
            </div>
        );
    }
}

export default App;
