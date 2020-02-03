class Game {
    
    constructor(renderer) {
        
        this.cars = []
        this.walls = []
        this.renderer = renderer

        self = this
        function gameloop() {
            self.update()
            requestAnimationFrame(gameloop)
        }
        gameloop()
    }

    update() {
        this.renderer.clear()
        this.cars.forEach(this.renderer.drawCar)
        this.walls.forEach(this.renderer.drawLine)

        this.cars.forEach((car) => {
            if (car.status == 'broken') return

            car.move(car.speed)
            car.update()

            for (let x = 0; x < car.border.length; x++) {
                for (let y = 0; y < this.walls.length; y++) {
                    if (Line.isCross(car.border[x], this.walls[y])) {
                        return car.status = 'broken'
                    }
                }
            }
            for (let x = 0; x < car.sensors.length; x++) {
                let shortest = 500
                let target = {}
                for (let y = 0; y < this.walls.length; y++) {
                    let pos = Line.getCrossPoint(car.sensors[x], this.walls[y])
                    if (pos) {
                        let length = Math.sqrt((pos.x - car.x) ** 2 + (pos.y - car.y) ** 2)
                        if (length < shortest) {
                            shortest = Math.round(length)
                            target = pos
                        }
                    }
                }
                car.sensorsData[x] = shortest
                this.renderer._drawLine(car.x, car.y, target.x, target.y)
                this.renderer.drawCircle(target.x, target.y, 5)
            }
        })
    }

    loadMap(points) {
        for (let i = 0; i < points.length - 1; i++) {
            let p1 = new Point(points[i].x, points[i].y)
            let p2 = new Point(points[i + 1].x, points[i + 1].y)
            let line = new Line(p1, p2, 3)
            this.walls.push(line)
        }
    }

    addCar(car) {
        this.cars.push(car)
    }
}