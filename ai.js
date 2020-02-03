const canvas = document.getElementById('stage')
const renderer = new Renderer(canvas)
const game = new Game(renderer)

let count = 0
let SIZE = 100
let DNA_LENGTH = 30
let generation = 0
let cars = []

let map = [[{"x":57,"y":162},{"x":108,"y":108},{"x":240,"y":66},{"x":636,"y":54},{"x":1056,"y":63},{"x":1539,"y":72},{"x":1752,"y":114},{"x":1839,"y":216},{"x":1866,"y":462},{"x":1815,"y":624},{"x":1527,"y":708},{"x":1284,"y":678},{"x":1128,"y":633},{"x":972,"y":636},{"x":939,"y":723},{"x":954,"y":807},{"x":1059,"y":906},{"x":1206,"y":936},{"x":1365,"y":885},{"x":1524,"y":789},{"x":1674,"y":753},{"x":1761,"y":783},{"x":1824,"y":849},{"x":1854,"y":1059},{"x":1818,"y":1293},{"x":1677,"y":1383},{"x":1536,"y":1398},{"x":1116,"y":1401},{"x":759,"y":1323},{"x":630,"y":1305},{"x":495,"y":1332},{"x":456,"y":1368},{"x":396,"y":1404},{"x":216,"y":1410},{"x":72,"y":1350},{"x":18,"y":1125},{"x":48,"y":948},{"x":183,"y":753},{"x":189,"y":633},{"x":147,"y":522},{"x":57,"y":423},{"x":36,"y":276},{"x":42,"y":207},{"x":54,"y":168}],[{"x":219,"y":201},{"x":372,"y":174},{"x":789,"y":168},{"x":1281,"y":183},{"x":1551,"y":207},{"x":1662,"y":276},{"x":1692,"y":411},{"x":1656,"y":495},{"x":1527,"y":549},{"x":1356,"y":534},{"x":1167,"y":489},{"x":903,"y":471},{"x":789,"y":531},{"x":720,"y":669},{"x":711,"y":831},{"x":750,"y":954},{"x":897,"y":1071},{"x":1071,"y":1113},{"x":1296,"y":1080},{"x":1506,"y":996},{"x":1608,"y":918},{"x":1656,"y":948},{"x":1674,"y":1026},{"x":1659,"y":1164},{"x":1611,"y":1233},{"x":1530,"y":1245},{"x":1296,"y":1257},{"x":1101,"y":1248},{"x":786,"y":1170},{"x":639,"y":1143},{"x":486,"y":1164},{"x":366,"y":1230},{"x":261,"y":1254},{"x":204,"y":1221},{"x":177,"y":1155},{"x":207,"y":1083},{"x":234,"y":963},{"x":375,"y":774},{"x":417,"y":675},{"x":390,"y":558},{"x":330,"y":432},{"x":243,"y":327},{"x":198,"y":264},{"x":216,"y":207}]]
map.forEach(points => game.loadMap(points))

for (var i = 0; i < SIZE; i++) {
    let car = new Car()
    car.reset(300, 100, 90)
    car.addSensor(45)
    car.addSensor(0)
    car.addSensor(-45)
    car.score = 0
    car.speed = 0
    car.gens = randomDNA(DNA_LENGTH)
    car.xx = car.x
    car.yy = car.y

    game.addCar(car)
    cars.push(car)
}

game.update()

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
        cars.forEach(c => c.status = 'broken')
    }
})


function gameloop () {
    cars.forEach(car => {
        if (car.status != 'running') return
        var outputs = NN(car.sensorsData.concat(car.speed), car.gens)
        
        car.turn(outputs[0]*3)
        car.speedUp(outputs[1]/10)
        car.score += car.speed**2

        if (count % 30 === 0) {
            var diff = (car.xx - car.x)**2 + (car.yy - car.y)**2
            if (car.speed == 0) car.status = 'broken'
            car.score += diff
            car.xx = car.x
            car.yy = car.y
        }
    })

    let car = cars.filter(car => car.status === 'running').sort((a, b) => b.score - a.score)[0]
    if (car) renderer.focusOn(car.x, car.y)

    count++
    let bool = true
    renderer.drawText('generation:' + generation, 10, 10)
    renderer.drawText('count:' + count, 10, 30)
    for (var i=0; i<cars.length; i++) {
        bool = bool && cars[i].status !== 'running'
    }
    if (bool) nextGeneration()

    requestAnimationFrame(gameloop)
}
gameloop()



function nextGeneration () {
    cars.sort((a, b) => b.score - a.score);
    
    var newGens = [];
    for (var i=0; i<SIZE; i++) {
        var newDNA = crossover(cars[0].gens, cars[1].gens)
        newGens.push(newDNA)
    }
    
    for (var i=0; i<cars.length; i++) {
        cars[i].gens = newGens[i]
        cars[i].reset(300, 100, 90)
        cars[i].score = 0
        cars[i].speed = 0
    }

    generation++
}

function crossover(a, b) {
    var dna = []
    for (var i = 0; i < DNA_LENGTH; i++) {
        dna[i] = Math.random() > 0.5 ? a[i] : b[i]
        if (Math.random() < 0.1) dna[i] = Math.random() * 2 - 1
    }
    return dna
}

function randomDNA(length) {
    var dna = []
    for (var i = 0; i < length; i++) dna.push(Math.random() * 2 - 1)
    return dna
}

function sigmoid(x) {
    return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x))
}

function NN(inputs, weights) {
    var w = weights
    var i = inputs
    var a = i[0]*w[0]  + i[1]*w[1]  + i[2]*w[2]  + i[3]*w[3]
    var b = i[0]*w[4]  + i[1]*w[5]  + i[2]*w[6]  + i[3]*w[7]
    var c = i[0]*w[8]  + i[1]*w[9]  + i[2]*w[10] + i[3]*w[11]
    var d = i[0]*w[12] + i[1]*w[13] + i[2]*w[14] + i[3]*w[15]
    var e = i[0]*w[16] + i[1]*w[17] + i[2]*w[18] + i[3]*w[19]
    
    a = sigmoid(a)
    b = sigmoid(b)
    c = sigmoid(c)
    d = sigmoid(d)
    e = sigmoid(e)
    
    var f = a*w[20] + b*w[21] + c*w[22] + d*w[23]
    var g = a*w[21] + b*w[22] + c*w[23] + d*w[24]
    
    f = sigmoid(f)
    g = sigmoid(g)
    
    return [f, g]
}