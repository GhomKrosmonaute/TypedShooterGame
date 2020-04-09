
import Scene from '../Scene';
import App from '../../App';
import Zone from '../Zone';
import Link from '../Link';
import {LeaderBoard, User} from '../../../interfaces';
import Button from '../Button';
import {map, constrain, dist} from '../../../utils';
const tims = require('tims')

export default class Scores extends Scene {

    private leaderBoard?:LeaderBoard
    private user?:User
    public mode = 0
    public modes:string[] = [
        'Best of Parties',
        'Best of Players (by average)',
        'Best of Players (by total)'
    ]

    constructor( app:App ) {
        super(app)
        this.buttons.push(new Button(this,
            0, this.p.height * -.45,
            this.modes[0],
            (scores:Scores) => {
                const max = scores.modes.length - 1
                scores.mode ++
                if(scores.mode > max)
                    scores.mode = 0
                scores.buttons[0].text = scores.modes[scores.mode]
                scores.reset().catch()
            },
            this
        ))
        this.links.push(new Link(this,
            app.mobile ? .5 : 1/6,
            5/6,
            {
                targetName: 'party'
            }
        ))
        if(!app.mobile)
            this.links.push(
                new Link( this,
                    .5,
                    5/6,
                    {
                        targetName: 'profile',
                        resetNew: true
                    }
                ),
                new Link( this,
                    5/6,
                    5/6,
                    {
                        targetName: 'manual'
                    }
                )
            )
        this.reset().catch()
    }

    async reset(){
        this.user = await this.app.api.get<User>('profile')
        this.leaderBoard = await this.app.api.get<LeaderBoard>('leaderboard',{ mode: this.mode })
    }

    draw() {
        this.drawLeaderBoard()
        this.drawButtons()
        this.drawAnimations()
    }

    step() {}

    keyPressed(key: string) {

    }

    drawLeaderBoard(): void {
        if(!this.leaderBoard) return
        const leaderBoardZone = new Zone(
            0,-20,
            this.p.width * .7,
            this.p.height * .7,
            true
        )
        this.leaderBoard.forEach( (player, index) => {
            const shift = this.app.mouseShift(index)
            const color = (
                this.user.username === player.username
            ) ? this.p.color(this.app.white) : this.app.color
            const y = leaderBoardZone.fractionY((1/30)*index)
            const size = leaderBoardZone.fraction(1,1/30,true)
            const rankZone = new Zone(
                shift.x, shift.y + y,
                size.x, size.y, true
            )
            this.p.noStroke()
            this.p.fill(color)
            this.p.textAlign(this.p.CENTER,this.p.CENTER)
            this.p.textSize(constrain(map(
                dist(
                    0,this.app.mouseFromCenter.y,
                    0,rankZone.center.y
                ),
                0,
                30,
                rankZone.fractionHeight(.9),
                rankZone.fractionHeight(.7)
            ),rankZone.fractionHeight(.7),rankZone.fractionHeight(.9)))
            const rank = rankZone.fraction(1/12,.5)
            const name = rankZone.fraction(3/12,.5)
            const score = rankZone.fraction(5/12,.5)
            const prec = rankZone.fraction(7/12,.5)
            const kills = rankZone.fraction(9/12,.5)
            const duration = rankZone.fraction(11/12,.5)
            this.p.text(`# ${index + 1}`, rank.x, rank.y)
            this.p.text(player.username, name.x, name.y)
            this.p.text(`${Math.round(player.score)} pts`,score.x,score.y)
            this.p.text(`prec: ${Math.round(player.precision * 100)}%`,prec.x,prec.y)
            this.p.text(`kills: ${Math.round(player.kills)}`,kills.x,kills.y)
            this.p.text(tims.text(player.duration),duration.x,duration.y)
        })
    }

}