class Point {
    constructor(x = 0, y = 0, direction = 0) {
        this.x = x
        this.y = y
        this.direction = direction
    }

    move(distance) {
        const deg = Math.PI * this.direction / 180
        this.x += Math.sin(deg) * distance
        this.y -= Math.cos(deg) * distance
    }
}

class Line {

    constructor(p1, p2, size, color) {
        this.p1 = p1
        this.p2 = p2
        this.size = size || 1
        this.color = color || 'black'
        this.a = 0
        this.b = 0

        this.update()
    }

    update() {
        this.a = (this.p1.y - this.p2.y) / (this.p1.x - this.p2.x)
        if (Math.abs(this.a) === Infinity) this.a = 1000
        this.b = this.p1.y - this.p1.x * this.a
    }

    sub(x, y) {
        if (Math.abs(this.a) == Infinity) return x - this.b
        return this.a * x + this.b - y
    }

    static getCrossPoint(lineA, lineB) {
        if (Line.isCross(lineA, lineB) === false) return

        let x = (lineB.b - lineA.b) / (lineA.a - lineB.a)
        let y = lineA.a * x + lineA.b
        return { x: x, y: y }
    }

    static isCross(lineA, lineB) {
        return lineA.sub(lineB.p1.x, lineB.p1.y) * lineA.sub(lineB.p2.x, lineB.p2.y) < 0 &&
               lineB.sub(lineA.p1.x, lineA.p1.y) * lineB.sub(lineA.p2.x, lineA.p2.y) < 0
    }
}

class Car extends Point {
    constructor(x, y, direction) {
        super(x, y, direction)

        this.width = 20
        this.sensorLength = 1000
        this.speed = 1
        this.status = 'running' // running, broken

        const p1 = new Point()
        const p2 = new Point()
        const p3 = new Point()
        const p4 = new Point()

        this.corner = [p1, p2, p3, p4]
        this.border = [
            new Line(p1, p2, 2),
            new Line(p2, p3, 2),
            new Line(p3, p4, 2),
            new Line(p4, p1, 2),
        ]

        this.censorPoints = []
        this.sensors = []
        this.offset = []
        this.sensorsData = []

        this.update()
    }

    update() {
        let directions = [30, 150, -150, -30]
        this.corner.forEach((p, idx) => {
            p.x = this.x
            p.y = this.y
            p.direction = this.direction + directions[idx]
            p.move(this.width)
        })

        this.censorPoints.forEach((p, idx) => {
            p.x = this.x
            p.y = this.y
            p.direction = this.direction + this.offset[idx]
            p.move(this.sensorLength)
        })

        this.border.forEach((line) => {
           if (self.status == 'broken') line.color = 'gray'
           else line.color = 'black'
        })

        this.border.forEach(l => l.update())
        this.sensors.forEach(l => l.update())
    }

    turn(direction) {
        if (this.status == 'broken') return
        if (direction > this.speed) direction = this.speed
        if (direction < -this.speed) direction = -this.speed
        this.direction += direction
    }

    speedUp(speed) {
        if (this.status == 'broken') return
        this.speed += speed
        if (this.speed < 0) this.speed = 0
    }

    reset(x, y, direction = 90, speed = 0) {
        this.x = x
        this.y = y
        this.direction = direction
        this.speed = speed
        this.update()
        this.status = 'running'
    }

    addSensor(direction) {
        let point = new Point()
        let line = new Line(this, point, 0, '#00000000')
        this.censorPoints.push(point)
        this.sensors.push(line)
        this.offset.push(direction)
    }    
}
