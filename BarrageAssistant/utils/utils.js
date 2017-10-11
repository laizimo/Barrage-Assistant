
const utils = {
  replaceAll: function(str, search, replacement){
    if(!str || str.length <= 0)
      return "";
    return str.replace(new RegExp(search, 'g'), replacement);
  },
  escaped: function(str){
    if(!str)
      return "";
    str = str.toString();
    str = utils.replaceAll(str, '@', '@A');
    str = utils.replaceAll(str, '/', '@S');
    return str;
  },
  unescaped: function(str){
    if(!str)
      return "";
    str = str.toString();
    str = utils.replaceAll(str, '@S', '/');
    str = utils.replaceAll(str, '@A', '@');
    return str;
  },
  serialize: function(data){
    const kvPairs = [];
    for(let key in data){
      if(data.hasOwnProperty(key)){
        if(typeof data[key] === 'object')
          kvPairs.push(`${utils.escaped(key)}@=${utils.escaped(utils.serialize(data[key]))}`);
        else
          kvPairs.push(`${utils.escaped(key)}@=${utils.escaped(data[key])}`);
      }
    }
    return kvPairs.join('/') + '/';
  },
  unserialize: function(serializer){
    if(!serializer || serializer.length <= 0)
      return [];
    const raw = {};
    const kvPairs = serializer.split('/');
    kvPairs.forEach(item => {
      let kv = item.split('@=');
      if(kv.length !== 2) return;
      let key = utils.unescaped(kv[0]);
      let value = utils.unescaped(kv[1]);
      if(value.indexOf('@=') >= 0)
        value = utils.unserialize(value);
      raw[key] = value;
    });
    return raw;
  }
};

module.exports = utils;