
import './style.css'
import p5 from 'p5'
import axios from 'axios'
import qs from 'querystring'
import App from './Shooter/App'
import { getInput } from './utils'
import {baseURL, siteKey} from './config'
import API from './Shooter/API'
import Color from './Shooter/Entities/Color';
import {Palette} from './interfaces';

let started:boolean = false

function sketch( p:p5, hexColors:[string,string], apiToken:string ){

    let app:App = null

    p.setup = () => {
        p.createCanvas(p.windowWidth,p.windowHeight)
        const colors:Palette = {
            blue: new Color(p,hexColors[0]),
            red: new Color(p,hexColors[1])
        }
        app = new App(p,colors,new API(apiToken))
    }

    p.draw = async () => {
        if(!app) return
        await app.step()
        await app.draw()
    }

    p.keyPressed = () => {
        if(!app) return false
        app.keyPressed(p.key)
        return false
    }

    p.keyReleased = () => {
        if(!app) return false
        app.keyReleased(p.key)
        return false
    }

    p.mousePressed = () => {
        if(!app) return
        app.mousePressed()
    }

    p.mouseMoved = () => {
        if(!app) return
        app.mouseMoved()
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth,p.windowHeight)
    }

    window.addEventListener("gamepadconnected", (event) => {
        // @ts-ignore
        app.setGamepad(event.gamepad)
    });

    window.addEventListener("gamepaddisconnected", (event) => {
        //@ts-ignore
        app.unsetGamepad()
    });

}

document.addEventListener('DOMContentLoaded', async () => {

    const storageColors = localStorage.getItem('colors')
    if(storageColors){
        const colors = JSON.parse(storageColors)
        getInput('red').value = colors.red
        getInput('blue').value = colors.blue
    }

    const submit = getInput('submit')

    grecaptcha.ready(function(){

        submit.onclick = async event => {

            if(started) return false

            event.preventDefault()

            const username = getInput('username').value
            const password = getInput('password').value
            const hexColors:[string,string] = [
                getInput('red').value,
                getInput('blue').value
            ]

            grecaptcha.execute(siteKey, { action: 'login' }).then(async function(token) {
                try {
                    const res = await axios.post('login', qs.stringify({ token, username, password }),{
                        baseURL, headers: {'Access-Control-Allow-Origin': '*'}
                    })
                    if( res.status === 200 ){
                        started = true
                        document.getElementById('login').remove()
                        document.getElementById('p5').focus()
                        localStorage.setItem('colors',JSON.stringify({
                            red: hexColors[0],
                            blue: hexColors[1]
                        }))
                        new p5(p => sketch(p,hexColors,res.data.token), document.getElementById('p5') )
                    }
                }catch(error){
                    const alert = document.getElementById('alert')
                    if(error.message.includes(401)) alert.innerText = 'Incorrect password, please retry !'
                    else if(error.message.includes(502)) alert.innerText = 'Oops :( The API has a little problem... Try again later!'
                    else if(error.message.includes(500)) alert.innerText = 'reCAPTCHA token denied.'
                    else throw error
                }
            })

            return false
        }
    })
})




