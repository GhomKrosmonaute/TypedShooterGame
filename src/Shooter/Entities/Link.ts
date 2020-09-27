import { LinkOptions, SceneName } from "../../interfaces"
import p5 from "p5"
import Scene from "./Scene"
import Positionable from "./Positionable"

export default class Link extends Positionable {
  public targetName: SceneName
  public resetNew: boolean
  public resetOld: boolean
  public text?: string
  public p: p5

  constructor(
    public scene: Scene,
    public fractionX: number,
    public fractionY: number,
    options: LinkOptions
  ) {
    super(scene.p, 0, 0, 100)
    this.targetName = options.targetName
    this.resetNew = !!options.resetNew
    this.resetOld = !!options.resetOld
    this.text = options.text
    scene.links.push(this)
  }

  draw(): void {
    this.x = this.p.width * this.fractionX - this.p.width * 0.5
    this.y = this.p.height * this.fractionY - this.p.height * 0.5
    this.p.fill(
      this.scene.app.white,
      this.rawTouch(this.scene.app.mouseFromCenter) ? 255 : 100
    )
    this.p.noStroke()
    this.p.textSize(30)
    this.p.text(this.text || this.targetName, this.x, this.y)
  }

  mousePressed(): void {
    if (this.rawTouch(this.scene.app.mouseFromCenter)) {
      if (this.resetNew) this.scene.app.scenes[this.targetName].reset()
      this.scene.app.sceneName = this.targetName
      if (this.resetOld) this.scene.reset()
    }
  }
}
