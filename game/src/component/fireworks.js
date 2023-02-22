import fx from 'fireworks'

let range = n => [...new Array(n)]

export const firework = () => {
    range(6).map(() =>
        fx({
            x: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
            y: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
            colors: ['#cc3333', '#4CAF50', '#81C784']
        })
    )

    range(6).map(() =>
        fx({
            x: Math.random(window.innerWidth / 2) + 3*window.innerWidth /4,
            y: Math.random(window.innerHeight / 2) + window.innerHeight / 2,
            colors: ['#cc3333', '#4CAF50', '#81C784']
        })
    )

    range(6).map(() =>
        fx({
            x: Math.random(window.innerWidth / 2) + window.innerWidth / 2,
            y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
            colors: ['#cc3333', '#4CAF50', '#81C784']
        })
    )

    setTimeout(function(){
        range(6).map(() =>
        fx({
            x: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
            y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
            colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        )

        range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + 3*window.innerWidth /4,
                y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
                colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        )

        range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + window.innerWidth / 2,
                y: Math.random(window.innerHeight / 2) + window.innerHeight / 2,
                colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        )
    },1000);

    setTimeout(function(){
        range(6).map(() =>
        fx({
            x: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
            y: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
            colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        )

        range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + 3*window.innerWidth /4,
                y: Math.random(window.innerHeight / 2) + window.innerHeight / 2,
                colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        )

        range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + window.innerWidth / 2,
                y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
                colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        )
    },2000)
}

