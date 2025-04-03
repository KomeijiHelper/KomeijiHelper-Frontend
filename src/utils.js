const ProxyEnum = (baseEnum)=> {  
  return new Proxy(baseEnum, {
    set(target, name, value) {
      throw new Error('Cannot add a new value to the enum')
    }
  })
}

export default ProxyEnum;