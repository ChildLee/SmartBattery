// console.log(2000 + (0x24e1 >> 9))
// console.log((0x24e1 >> 5) & 0x0f)
// console.log(0x24e1 & 0x1f)
//
//
// console.log(0x0F)
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
// let arr = parseInt('0201', 16).toString(2).split('')
// let len = arr.length
// for (let i = 0; i < 16 - len; i++) {
//     arr.unshift('0')
// }
// console.log(arr)

// console.log(parseInt('01A4', 16))
// console.log(parseInt('01A2', 16))

// const voltage = 'DDA5041E0F660F630F630F640F3E0F630F370F5B0F650F3B0F630F630F3C0F660F3DF9F977DDA504080F630F3C0F660F3DF9F977'.slice(8, -6).match(/[\da-f]{4}/gi)
// console.log(voltage)
// voltage.forEach((value, index, array) => {
//     array[index] = parseInt(value, 16)
// })
// console.log(voltage)

// console.log(Number('0101'.substring(0,1))===0)

// console.log(Number('2550'/100))