import Enemy from "../Enemy"
import Party from "../Scenes/Party"
import { seconds, norm, dist } from "../../../utils"
import Rate from "../Rate"
import wave from "../../Animations/wave"
import Dirigible from "../Dirigible"

export default class Pulsar extends Enemy {
  public immune: boolean = false
  public speed: number = 3.5
  public damages: number = 2
  public gain: number = 1
  public life: number = 3
  public id = "pulsar"

  private waveRate = new Rate(seconds(3))
  private waveDiameter = 400

  constructor(party: Party) {
    super(party)
    this.diameter = 60
    if (this.app.hardcore) {
      this.life++
      this.speed++
    }
    this.baseSpeed = this.speed
    this.baseGain = this.gain
    this.baseLife = this.life
    this.baseDamages = this.damages
  }

  private get waveRadius(): number {
    return this.waveDiameter * 0.5
  }

  pattern(): void {
    this.follow(this.party.player, this.speed, 3)
    if (this.waveRate.canTrigger(true)) {
      this.party.setAnimation(
        wave({
          position: this,
          attach: true,
          value: this.waveDiameter,
          className: "low",
          duration: 500,
        })
      )
    }
    if (this.waveRate.range(200, 600)) {
      for (const enemy of this.party.enemies) {
        const distance = this.calculatedDist(enemy) - this.radius
        if (enemy !== this && !enemy.immune && distance < this.waveRadius) {
          this.repulse(enemy, enemy.speed)
        }
      }
      for (const shot of this.party.player.shots) {
        const distance = this.calculatedDist(shot) - this.radius
        if (distance < this.waveRadius) {
          this.repulse(shot, this.party.player.shotSpeed)
        }
      }
      const distance = this.calculatedDist(this.party.player) - this.radius
      if (distance < this.waveRadius) {
        this.repulse(this.party.player, this.party.player.speedMax, 0.5)
      }
    }
  }

  onPlayerContact(): void {
    this.checkShield()
  }

  public get currentDiameter() {
    return this.lifeBasedDiameter
  }

  private repulse(
    target: Dirigible,
    baseSpeed: number,
    factor: number = 1
  ): void {
    const distance = this.calculatedDist(target) - this.radius
    const distFactor = norm(distance, this.waveRadius, 0)
    const speed = baseSpeed * distFactor
    const rotationSpeed = 90 * distFactor
    target.repulsedBy(this, speed * factor, rotationSpeed * factor)
  }
}
