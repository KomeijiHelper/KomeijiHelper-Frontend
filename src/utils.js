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

// Maybe used in furture
const str2FixedArrayBuffer = (str,length)=>{
    const encoder = new TextEncoder();

    let encoded = encoder.encode(str);

    if(encoded.length > length) {
        encoded = encoded.slice(0,length);
    }

    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);

    view.set(encoded);

    return buffer;
}

const long2ArrayBuffer = (num)=> {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setBigInt64(0,BigInt(num));

    return view.buffer;
}

const concatArrayBuffers = (...buffers)=> {
    const totalLenth = buffers.reduce((sum,buf)=>sum+buf.byteLength,0);

    const result = new Uint8Array(totalLenth);
    let offset = 0;
    for(const buffer of buffers) {
        result.set(new Uint8Array(buffer),offset);
        offset += buffer.byteLength;
    }

    return result.buffer;
}

const sendBufferByWebSocket = (type,format, buffer) => {
    const userName = localStorage.getItem("userName");
    const typeBuf = str2FixedArrayBuffer(type,40);
    const formatBuf = str2FixedArrayBuffer(format,40);
    const userNameBuf = str2FixedArrayBuffer(userName,200);
    const time = new Date();
    const timestampBuf = long2ArrayBuffer(time.getTime());

    const sendedBuf = concatArrayBuffers(typeBuf,formatBuf,userNameBuf,buffer,timestampBuf);
    console.log(sendedBuf);

    websocket.send(sendedBuf)
    chatBubbleList.push({ avatarSrc: '', avatarName: localStorage.getItem("userName"), isSelf: true, time: time.toLocaleString(),type:MessageType.Image, content: "http://localhost:3000/mansui.jpg"})
} 

export {ProxyEnum, ClearLocalStorage};