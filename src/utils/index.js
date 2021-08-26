export function move(target, ele, prop) {
  // 记录最后要到达的地点  因为之后一直在变化
  const dom = ele;
  const pre = dom[prop] + target;
  // 这是走的总距离
  let dis = 0;
  let speed = 4;
  if (target < 0) {
    speed *= -1;
  }
  const t = setInterval(() => {
    // 记录走的总距离
    dis += speed;
    dom[prop] += speed;
    if (Math.abs(dis) > Math.abs(target)) {
      // 如果走的总距离大于目标距离  就清理定时器
      dom[prop] = pre;
      clearInterval(t);
    }
  }, 60 / 1000);
}
const storageKey = 'goods';

export function getItem(storage) {
  const storageItem = storage || storageKey;
  return JSON.parse(localStorage.getItem(storageItem));
}
export function setItem(id, value) {
  const obj = getItem() || {};
  obj[id] = value;
  if (value === 0) {
    delete obj[id];
  }
  localStorage.setItem(storageKey, JSON.stringify(obj));
}
