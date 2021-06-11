import { Income1099G, Income1099Type, TaxesState } from '../redux/data'
import F1040 from './F1040'
import { computeField, sumFields } from './util'

export default class Schedule1 {
  state: TaxesState
  f1040: F1040

  constructor (state, f1040) {
    this.state = state
    this.f1040 = f1040
  }


  f1099gs = (): Income1099G[] =>
    this.state.f1099s
      .filter((f) => f.type === Income1099Type.G)
      .map((f) => f as Income1099G)

  l1 = (): number | undefined => this.f1099gs.map((f) => computeField(f.taxableRefunds)).reduce((total, tr) => total + tr, 0)

  l7 = (): number | undefined => this.f1099gs.map((f) => computeField(f.unemploymentCompensation)).reduce((total, tr) => total + tr, 0)

  // There's a lot of stuff in line 8, but right now I'm just implimenting the unemployment exclusion
  unemploymentExclusion (): number | undefined {
    const l1 = sumFields([this.f1040.l1(), this.f1040.l2a(),this.f1040.l2b(), this.f1040.l3a(), this.f1040.l3b(), this.f1040.l4a(), this.f1040.l4b(), this.f1040.l5a(), this.f1040.l5b(), this.f1040.l6a(), this.f1040.l6b(), this.f1040.l7()])
    const l2 = sumFields([this.l1(), this.l2(), this.l3(), this.l4(), this.l5(), this.l6()])
    // const l3 = the rest of this.l8()
    const l3 = 0
    const l4 = sumFields([l1, l2, l3])
    const l5 = this.f1040.l10c()
    const l6 = l4 - l5
    const l7 = l6 >= 150000 ? false : true
    const l8 = l7 ? this.f1099gs.map((f) => computeField(f.unemploymentCompensation)).reduce((total, tr) => (total + tr : total), 0) > 12000
  }
  l8 = (): number | undefined => sumFields([this.f1040.l1(), this.f1040.l2(), this.f1040.l3(), this.f1040.l4(),this.f1040.l5(),this.f1040.l6(),this.f1040.l7()])

  l9 = (): number | undefined => undefined
  l22 = (): number | undefined => undefined
}
