// console.log(2000 + (0x24e1 >> 9))
// console.log((0x24e1 >> 5) & 0x0f)
// console.log(0x24e1 & 0x1f)
//
//
// console.log(0xb0)
// console.log(Math.pow(2,6))
//
// console.log((0x0201 & 0x01)>>0)
// console.log((0x0201&0x02)>>1)
// console.log((0x0201&0x04)>>2)
// console.log((0x0201&0x08)>>3)
// console.log((0x0201&0x10)>>4)
// console.log((0x0201&0x20)>>5)
// console.log((0x0201&Math.pow(2,0))>>5)
//
// for (let i = 0; i < 16; i++) {
//     console.log((0x0201&Math.pow(2,i))>>i)
// }

//
// let arr = parseInt('00', 16).toString(2).split('')
// let len = arr.length
// for (let i = 0; i < 16 - len; i++) {
//     arr.unshift('0')
// }
// console.log(arr)

console.log(parseInt('03E8', 16))

// const voltage = 'dda504080f630f3c0f660f3df9f977'.slice(8, -6).match(/[\da-f]{4}/gi)
// console.log(voltage)
// voltage.forEach((value, index, array) => {
//     array[index] = parseInt(value, 16)
// })
// console.log(voltage)

