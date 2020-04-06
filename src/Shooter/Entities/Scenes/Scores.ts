
import Scene from '../Scene';
import App from '../../App';
import Zone from '../Zone';
import Link from '../Link';
import {LeaderBoard} from '../../../interfaces';
const tims = require('tims')

export default class Scores extends Scene {

    private leaderBoard?:LeaderBoard
    private leaderBoardType:'party'|'player'

    constructor( app:App ) {
        super(app)
        this.links.push(new Link( this,
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
        this.reset()
    }

    reset(){
        this.app.api.get<LeaderBoard>('leaderboard')
            .then( leaderBoard => {
                this.leaderBoard = leaderBoard
                if(this.leaderBoard.top.every( player => {
                    return player.username !== this.leaderBoard.player.username
                })) this.leaderBoard.top.push(this.leaderBoard.player)
            })
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
        this.leaderBoard.top.forEach( (player, index) => {
            const color = (
                this.leaderBoard.player.username === player.username
            ) ? this.p.color(this.app.white) : this.app.color
            const y = leaderBoardZone.fractionY((1/30)*index)
            const size = leaderBoardZone.fraction(1,1/30,true)
            const rankZone = new Zone(
                0, y,
                size.x, size.y, true
            )
            this.p.noStroke()
            this.p.fill(color)
            this.p.textAlign(this.p.CENTER,this.p.CENTER)
            this.p.textSize(rankZone.height * .8)
            const rank = rankZone.fraction(1/12,.5)
            const name = rankZone.fraction(3/12,.5)
            const score = rankZone.fraction(5/12,.5)
            const prec = rankZone.fraction(7/12,.5)
            const kills = rankZone.fraction(9/12,.5)
            const duration = rankZone.fraction(11/12,.5)
            this.p.text(`# ${index + 1}`, rank.x, rank.y)
            this.p.text(player.username, name.x, name.y)
            this.p.text(`${player.score} pts`,score.x,score.y)
            this.p.text(`prec: ${Math.round(player.precision * 100)}%`,prec.x,prec.y)
            this.p.text(`kills: ${player.kills}`,kills.x,kills.y)
            this.p.text(tims.text(player.duration),duration.x,duration.y)
        })
    }

}