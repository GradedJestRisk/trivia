'use strict'

const expect = require('chai').expect
const Player = require('../player')

describe('when a played in created', ()=>{
  let player;
  beforeEach(()=> {
    player = new Player("toto")
  })
  it('should have a name', ()=>{
    const expectedName = "toto"
    expect(player.name).to.equal(expectedName)
  })

  it('should have an empty purse', () =>{
    expect(player.purse).to.equal(0)
  })

  it('should be located at position0', () =>{
    expect(player.position).to.equal(0)
  })
})
