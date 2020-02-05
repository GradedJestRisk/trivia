'use strict'

const expect = require('chai').expect
const Box = require('../case');

describe('initialization', () => {
  let box;
  it('should has a position', ()=> {
  box = new Box(4)
    expect(box.position).to.equal(4)
  });

  it('should has a question category', ()=> {
  box = new Box(4, 'Sciences')
    expect(box.questionCategory).to.equal('Sciences')
  })
})