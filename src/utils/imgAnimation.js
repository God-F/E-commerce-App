/**
 * 根据参数中的图片链接  生成Dom元素
 * 1秒内实现动画过渡
 * 动画完成时 移除元素
 * origin:
 *         url : 图片链接地址
 *          width：图片宽度
 *          height：图片高度
 *          top : 定位值
 *          left ： 定位值
 * target：top: 定位值
 *          left 定位值
 */
export default function pageFly(options) {
  const { origin, target } = options;
  const {
    originUrl, originWidth, originHeight, originTop, originLeft,
  } = origin;
  const { targetTop, targetLeft } = target;
  const img = document.createElement('img');
  img.src = originUrl;
  img.style = `position: fixed;
    width: ${originWidth}px;
    height: ${originHeight}px;
    top: ${originTop}px;
    left: ${originLeft}px;
    z-index: 999;
    opacity: 1;`;
  document.body.appendChild(img);
  const h = img.clientHeight;
  if (h) {
    img.addEventListener('transitionend', (e) => {
      e.target.remove();
    });
  }

  const translateY = targetTop - originTop - 20;
  const translateX = targetLeft - originLeft;
  // 监听过度完成事件后 移除自己
  img.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(0.1)`;
  img.style.transition = '1s ease';
  img.style.opacity = 0;
}
