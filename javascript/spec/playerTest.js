'use strict'

const expect = require('chai').expect
const Player = require('../player')

describe('when a played in created', ()=>{
  it('should have a name', ()=>{
    const expectedName = "toto"
    const player = new Player("toto")
    expect(player.name).to.equal(expectedName)
  })
})
