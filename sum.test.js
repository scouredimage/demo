const { sum } = require('./sum')

describe('add', () =>{
  it('adds stuff', () => {
    expect(1 + 1).toBe(2)
  })
})

describe('sum', () =>{
  it('adds stuff', () => {
    expect(sum(1, 1)).toBe(2)
  })
})
