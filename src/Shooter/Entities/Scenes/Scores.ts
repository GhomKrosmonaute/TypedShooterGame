

import Scene from '../Scene';
import App from '../../App';
import Zone from '../Zone';
import Link from '../Link';

export default class Scores extends Scene {

    private leaderBoard?:any

    constructor( app:App ) {
        super(app)
        const appZone = this.app.zone
        this.links.push(
            new Link( this,
                1/6,
                5/6,
                {
                    targetName: 'party'
                }
            ),
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
        this.app.api.get('leaderboard')
            .then( leaderBoard => {
                this.leaderBoard = leaderBoard
                if(this.leaderBoard.player.position > 30)
                    this.leaderBoard.top.push(this.leaderBoard.player)
            })
    }

    draw() {
        if(!this.leaderBoard) return
        const leaderBoardZone = new Zone(
            0,0,
            this.p.width / 2,
            this.p.height * .7,
            true
        )
        this.leaderBoard.top.forEach( (player:any, index:number) => {
            const color = (
                this.leaderBoard.player.position === index + 1 ||
                !!player.position
            ) ? this.p.color(this.app.white) : this.app.color
            const {y} = leaderBoardZone.fraction(0,(1/30)*index)
            const size = leaderBoardZone.fraction(1,1/30,true)
            const rankZone = new Zone(
                0, y,
                size.x, size.y, true
            )
            this.p.noStroke()
            this.p.fill(color)
            this.p.textAlign(this.p.CENTER,this.p.CENTER)
            this.p.textSize(rankZone.height * .8)
            const rank = rankZone.fraction(1/6,.5)
            const name = rankZone.fraction(.5,.5)
            const score = rankZone.fraction(5/6,.5)
            this.p.text(`# ${index + 1}`, rank.x, rank.y)
            this.p.text(player.username, name.x, name.y)
            this.p.text(`Score: ${player.score} pts`,score.x,score.y)
        })
        this.drawButtons()
        this.drawAnimations()
    }

    step() {}

    keyPressed(key: string) {

    }

}