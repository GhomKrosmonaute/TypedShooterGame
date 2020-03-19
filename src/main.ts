
import './style.css'
import p5 from 'p5'
import axios from 'axios'
import qs from 'querystring'
import App from './Shooter/App'
import { getInput } from './utils'
import { baseURL } from './config'
import API from './Shooter/API';

function sketch( p:p5, apiToken:string ){

    let app:App = null

    p.setup = () => {
        p.createCanvas(p.windowWidth,p.windowHeight)
        app = new App(p,new API(apiToken))
    }

    p.draw = async () => {
        if(!app) return
        await app.step()
        await app.draw()
    }

    p.keyPressed = () => {
        if(!app) return
        app.keyPressed(p.key)
    }

    p.keyReleased = () => {
        if(!app) return
        app.keyReleased(p.key)
    }

    p.mouseMoved = () => {
        if(!app) return
        app.mouseMoved()
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth,p.windowHeight)
    }

}

document.addEventListener('DOMContentLoaded', async () => {

    const submit = getInput('submit')

    grecaptcha.ready(function(){

        submit.onclick = async event => {

            event.preventDefault()

            const username = getInput('username').value
            const password = getInput('password').value

            grecaptcha.execute('6LeSlOEUAAAAAJBZjIPdwz-Y3yAGCVGrsFMBOdVN', { action: 'login' }).then(async function(token) {
                try {
                    const res = await axios.post('login', qs.stringify({ token, username, password }),{ baseURL })
                    if( res.status === 200 ){
                        document.getElementById('login').remove()
                        return new p5(p => sketch(p,res.data.token), document.getElementById('p5') )
                    }
                }catch(error){
                    if(error.message.includes(401)) document.getElementById('alert').innerText = 'Incorrect password, please retry !'
                    else throw error
                }
            })

            return false
        }
    })
})




