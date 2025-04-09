const ProxyEnum = (baseEnum)=> {  
  return new Proxy(baseEnum, {
    set(target, name, value) {
      throw new Error('Cannot add a new value to the enum')
    }
  })
}

const ClearLocalStorage = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('session');
    localStorage.removeItem('userRole');
    localStorage.removeItem('chatWith');
    localStorage.removeItem('displayUserRole');
}

export {ProxyEnum, ClearLocalStorage};