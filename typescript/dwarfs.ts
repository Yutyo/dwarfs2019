/// <reference path="dwarfs.d.ts" />

const enum DwarfsPurpose {
    NONE,
    TREASURE,
    FORTRESS,
}

const cacheDwarfs: { [palette: string]: HTMLCanvasElement } = {}

class Dwarf {
    pos: number
    prevPos: number
    gold: number
    purpose: DwarfsPurpose
    turnBack: boolean

    constructor() {
        this.pos = 0
        this.prevPos = 0
        this.gold = 0
        this.purpose = DwarfsPurpose.NONE
        this.turnBack = false
    }

    private _render(palette: string[], canvas: CanvasRenderingContext2D) {
        for (let y = 0; y < B_DWARF.length; ++y) {
            for (let x = 0; x < 8; ++x) {
                const n = B_DWARF[y] >> 2 * (7 - x) & 0b11
                if (n != 0b10) {
                    canvas.fillStyle = '#' + palette[n]
                    canvas.fillRect(Inline.B_SCALE * x, Inline.B_SCALE * y,
                        Inline.B_SCALE, Inline.B_SCALE)
                }
            }
        }
    }

    buf(palette: string[]) {
        return cacheDwarfs[palette[0]] ||
            (cacheDwarfs[palette[0]] = renderBuf(Inline.B_SCALE * 8, Inline.B_SCALE * 11,
                this._render.bind(this, palette)))
    }

    advance() {
        this.prevPos = this.pos

        switch (this.purpose) {
            case DwarfsPurpose.TREASURE:
                this.turnBack = false
                this.pos += 10
                if (this.pos >= 2 * SCREEN_WIDTH) {
                    this.pos = 2 * SCREEN_WIDTH
                    this.gold = 1
                    this.purpose = DwarfsPurpose.FORTRESS
                }
                break

            case DwarfsPurpose.FORTRESS:
                this.turnBack = true
                this.pos -= 10
                if (this.pos <= 0) {
                    this.pos = 0
                    updateGold(this.gold)
                    this.gold = 0
                    this.purpose = DwarfsPurpose.NONE
                }
                break
        }
    }
}

const dwarfs: Dwarf[] = []
