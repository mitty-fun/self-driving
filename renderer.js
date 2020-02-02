class Renderer {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.offsetX = 0
        this.offsetY = 0
    }

    clear = () => {
        this.ctx.resetTransform()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.translate(-this.offsetX, -this.offsetY)
    }

    drawCar = (car) => {
        car.border.forEach(this.drawLine)
    }

    drawText = (text, x, y) => {
        this.ctx.resetTransform()
        this.ctx.font = '14px monospace'
        this.ctx.fillText(text, x, y)
        this.ctx.translate(-this.offsetX, -this.offsetY)
    }

    drawLine = (line) => {
        this._drawLine(line.p1.x, line.p1.y, line.p2.x, line.p2.y)
    }

    drawCircle = (x, y, r) => {
        this.ctx.beginPath()
        this.ctx.arc(x, y, r, 0, 2*Math.PI)
        this.ctx.stroke()
    }

    _drawLine = (fromX, fromY, toX, toY) => {
        this.ctx.beginPath()
        this.ctx.moveTo(fromX, fromY)
        this.ctx.lineTo(toX, toY)
        this.ctx.closePath()
        this.ctx.stroke()
    }

    focusOn = (x, y) => {
        this.ctx.resetTransform()
        x -= this.canvas.width/2
        y -= this.canvas.height/2
        this.ctx.translate(-x, -y)
        this.offsetX = x
        this.offsetY = y
    }
}
