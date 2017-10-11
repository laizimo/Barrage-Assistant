const utils = require('../BarrageAssistant/utils/utils');
const expect = require('chai').expect;

describe('utils test', () => {
  it('function replaceAll test', () => {
    expect(utils.replaceAll('hello@', '@', '@S')).to.be.equal('hello@S');
  });

  it('function escaped test', () => {
    expect(utils.escaped('type@=rss/room@=123')).to.be.equal('type@A=rss@Sroom@A=123');
  });

  it('function excaped number test', () => {
    expect(utils.escaped(123)).to.be.equal('123');
  });

  it('function unescaped test', () => {
    expect(utils.unescaped('type@A=rss@Sroom@A=123')).to.be.equal('type@=rss/room@=123');
  });

  it('function serialize test', () => {
    const str = 'type@=loginreq/roomid@=301712/';
    const data = {type: 'loginreq', roomid: 301712};
    expect(utils.serialize(data)).to.be.equal(str);
  });

  it('function unserialize test', () => {
    const str = 'type@=loginreq/roomid@=301712/';
    const data = {type: 'loginreq', roomid: '301712'};
    expect(utils.unserialize(str)).to.eql({type: 'loginreq', roomid: '301712'});
  });

  it('function serialize test', () => {
    const data = {type: 'rss', sui: {name: 'zimo'}};
    expect(utils.serialize(data)).equal('type@=rss/sui@=name@A=zimo@S/');
  });

  it('function unserialize deep test', () => {
    const str = 'type@=rss/sui@=name@A=zimo@S/';
    expect(utils.unserialize(str)).to.eql({type: 'rss', sui: {name: 'zimo'}});
  })
});
