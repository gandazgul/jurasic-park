import Thing from './Thing';

class Egg extends Thing {
    constructor(mother) {
        super();

        this.mother = mother;

        this.color = '#959595';
    }
}

export default Egg;
