const utils = require("./utils")
// @ponicode
describe("utils.distance", () => {
    test("0", () => {
        let callFunction = () => {
            utils.distance({ x: 1, y: 1 }, { x: 550, y: 10 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.distance({ x: 350, y: 350 }, { x: 350, y: 380 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.distance({ x: 1, y: 0 }, { x: 400, y: 520 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.distance({ x: 1, y: 550 }, { x: 1, y: 10 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.distance({ x: 550, y: 100 }, { x: 1, y: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.distance(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
