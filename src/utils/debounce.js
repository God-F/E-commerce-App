export default function (fun, duration) {
  let timer = null;
  return function debounce(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fun.apply(this, args);
    }, duration);
  };
}
