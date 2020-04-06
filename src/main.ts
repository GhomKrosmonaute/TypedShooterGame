
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
import MB from 'mobile-detect'

let started:boolean = false
const mb = new MB(window.navigator.userAgent)
const mobile = mb.mobile()

function sketch( p:p5, hexColors:[string,string], apiToken:string ){

    let app:App = null

    p.setup = () => {
        p.createCanvas(p.windowWidth,p.windowHeight)
        const colors:Palette = {
            blue: new Color(p,hexColors[0]),
            red: new Color(p,hexColors[1])
        }
        app = new App(p,colors,!!mobile,new API(apiToken))
    }

    p.draw = async () => {
        if(!app) return
        await app.step()
        await app.draw()
        if(app.debugMode)
            app.debug()
    }

    if(!!mobile){

        p.touchStarted = event => {
            if(!app) return false
            app.touchStarted(event)
        }

        p.touchMoved = event => {
            if(!app) return false
            app.touchMoved(event)
        }

        p.touchEnded = event => {
            if(!app) return false
            app.touchEnded(event)
        }

    }else{

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

        p.mouseMoved = () => {
            if(!app) return
            app.mouseMoved()
        }

    }

    p.mousePressed = () => {
        if(!app) return
        app.mousePressed()
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

    try{ await screen.orientation.lock("landscape") }
    catch(err){ console.error(err) }

    const storageColors = localStorage.getItem('colors')
    if(storageColors){
        const colors = JSON.parse(storageColors)
        getInput('red').value = colors.red
        getInput('blue').value = colors.blue
    }

    const submit = getInput('submit')

    submit.onclick = async event => {

        event.preventDefault()

        grecaptcha.ready(function () {

            // if (started) return false

            const username = getInput('username').value
            const password = getInput('password').value
            const hexColors: [string, string] = [
                getInput('red').value,
                getInput('blue').value
            ]

            grecaptcha.execute(siteKey, {action: 'login'}).then(async function (token) {
                try {
                    const res = await axios.post('login', qs.stringify({token, username, password}), {
                        baseURL, headers: {'Access-Control-Allow-Origin': '*'}
                    })
                    if (res.status === 200) {
                        started = true
                        document.getElementById('login').remove()
                        document.getElementById('p5').focus()
                        localStorage.setItem('colors', JSON.stringify({
                            red: hexColors[0],
                            blue: hexColors[1]
                        }))
                        new p5(p => sketch(p, hexColors, res.data.token), document.getElementById('p5'))
                    }
                } catch (error) {
                    const alert = document.getElementById('alert')
                    if (error.message.includes(401)) alert.innerText = 'Incorrect password, please retry !'
                    else if (error.message.includes(502)) alert.innerText = 'Oops :( The API has a little problem... Try again later!'
                    else if (error.message.includes(500)) alert.innerText = 'reCAPTCHA token denied.'
                    else console.error(error.message)
                }
            })
        })

        return false
    }
})




