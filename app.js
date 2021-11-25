canvas = document.getElementById('cv')

canvas.width = innerWidth
canvas.height = innerHeight

const canvasWidth = canvas.width
const canvasHeight = canvas.height

const playerCenterY = canvasHeight/2
const playerCenterX = canvasWidth/2

const c = canvas.getContext('2d')
c.fillStyle = 'rgba(0,0,0,0.1)'
c.fillRect(0, 0, canvas.width, canvas.height)

class Player{
    constructor(x, y, radius, color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill() 
    }
}

class Projectile {
    constructor(x , y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill() 
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x , y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill() 
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

}

const friction = 0.9

class Piece {
    constructor(x , y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.startx = x
        this.starty = y
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill() 
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.velocity.x *= friction
        this.velocity.y *= friction
    }

}




const player = new Player(playerCenterX, playerCenterY, 20, 'white')
const projectiles = []
const enemies = []
const pieces = []



player.draw()

function spawnEnemy() {
    setInterval(() => {
    let radius = (Math.random() * 26) + 13
    arrx = [0 - radius , canvasWidth + radius]
    arry = [0 - radius , canvasHeight + radius]
    if (Math.random() < 0.5) {
        x = arrx[Math.floor(Math.random()*2)]
        y = Math.random() * canvasHeight
    } else {
        y = arry[Math.floor(Math.random()*2)]
        x = Math.random() * canvasWidth
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`
    let angle = Math.atan2(y - playerCenterY,x - playerCenterX)
    let k = Math.random() * 1.5
    const velocity = {x: -Math.cos(angle) * k,y: -Math.sin(angle) * k } 
    enemies.push(new Enemy(x, y, radius, color, velocity))},1000)
}

let score = 0

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    projectiles.forEach((projectile, index) => {
        projectile.update()
        if (projectile.x - projectile.radius > canvasWidth || projectile.x + projectile.radius < 0 || projectile.y - projectile.radius > canvasHeight || projectile.y + projectile.radius <0) {
            projectiles.splice(index, 1)
        }
    })
    player.draw()
    enemies.forEach((enemy, eindex) => {
        enemy.update()
        const breakdown_dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (breakdown_dist < enemy.radius + player.radius){
            cancelAnimationFrame(animationId)
        }
        projectiles.forEach((projectile, pindex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist <= projectile.radius + enemy.radius){
                setTimeout(() => {
                    if (enemy.radius > 25) {
                        gsap.to(enemy, {
                            radius : enemy.radius - 10
                        })
                        projectiles.splice(pindex, 1)
                        score += 1
                    } else {
                        for (let i =0.5; i<3.14; i += 0.5) {
                            let piece = new Piece(enemy.x, enemy.y, i, enemy.color, {x:5*Math.cos(2*i), y:5*Math.sin(2*i)})
                            pieces.push(piece)
                        }
                        projectiles.splice(pindex, 1)
                        enemies.splice(eindex, 1)
                        score += 1
                    }
                })
            }
        })
        
    })
    pieces.forEach((piece) => {
        piece.update()
    })
    setTimeout(()=>{
        pieces.forEach((piece, index) => {
            if (Math.hypot(piece.x - piece.startx, piece.y - piece.starty) > 30){
                pieces.splice(index, 1)
            }
        })
    }, 300)
    document.getElementById('score').innerText = score

}

window.addEventListener('click', (e) => {
    let angle = Math.atan2(e.clientY - playerCenterY, e.clientX - playerCenterX)
    const projectile = new Projectile(playerCenterX, playerCenterY, 9, 'gray', {x: 5*Math.cos(angle), y: 5*Math.sin(angle)})
    projectiles.push(projectile)
})
window.addEventListener('touchend', function(e){let angle = Math.atan2(e.clientY - playerCenterY, e.clientX - playerCenterX)
    const projectile = new Projectile(playerCenterX, playerCenterY, 9, 'gray', {x: 5*Math.cos(angle), y: 5*Math.sin(angle)})
    projectiles.push(projectile)
                                             });


animate()
spawnEnemy()
