export function printMany(item:string, qty: number = 10) {
  return new Array(qty).fill(item).join("")
}