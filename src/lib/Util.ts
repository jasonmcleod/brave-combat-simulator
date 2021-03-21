export const Util = {
  range(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  
  pad(value: number | string, length: number = 4) {
    let str = `${value}`;

    for(let p = 0; p < length; p++) {
      if(str.length < length) {
        str = ' ' + str;
      }      
    }

    return str;
  }
}