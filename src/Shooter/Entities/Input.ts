import Zone from "./Zone"
import p5 from "p5"
import { InputOptions } from "../../interfaces"
import App from "../App"

export default class Input extends Zone {
  public hide: boolean
  public placeholder: string
  public value: string
  public focus: boolean
  public required: boolean
  public p: p5

  constructor(
    public app: App,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    toCenter: boolean = false,
    options: InputOptions
  ) {
    super(x1, y1, x2, y2, toCenter)
    this.p = app.p
    this.value = options.value ? options.value : ""
    this.placeholder = options.placeholder
    this.hide = !!options.hide
    this.focus = !!options.focus
    this.required = !!options.required
  }

  draw() {
    if (this.value === undefined) return
    const hover = this.touchVector(this.app.mouseFromCenter)
    const color = this.focus ? this.p.color(this.app.white) : this.app.color
    // rect
    this.p.strokeWeight(hover ? 4 : 2)
    this.p.stroke(color)
    this.p.noFill()
    this.p.rect(
      this.start.x,
      this.start.y,
      this.width,
      this.height,
      this.height * 0.33
    )
    // text
    this.p.noStroke()
    color.setAlpha(this.value.length === 0 ? 100 : 255)
    this.p.fill(color)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.textSize(this.height * 0.5)
    this.p.text(
      this.value.length === 0
        ? this.placeholder
        : this.hide
        ? "*".repeat(this.value.length)
        : this.value,
      this.center.x,
      this.center.y
    )
  }

  keyPressed(key: string) {
    if (!this.focus) return
    if (key.length === 1) this.value += key
    else if (key === "Backspace" && this.value.length > 0)
      this.value = this.value.slice(0, this.value.length - 1)
  }
}
