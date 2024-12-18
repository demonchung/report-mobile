const container = 
       `position: absolute;
	    left: 0;
	    right: 0;
	    top: 0;
	    bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
        `;
const style = `display: block;
        color: white;
        text-align: center;
        display: absolute;
        padding: 8px 24px;
        font-size: 14px;
        z-index: 9999;
        display: none;
		max-width: 224px;
        word-break: break-all;
		line-height: 22px;
		border-radius: 6px;
		background-color: rgba(0,0,0,.6);
        `;
let timer = null;
let toaststyle;

export default {
	install(Vue, options) {
		/**
         *
         * @param text： 要弹出的文字
         * @param timeout：自动关闭的时间（毫秒）。如果不是number类型，则永久显示或者直接关闭
         */
      const toast = function (text, timeout = 2000) {
			let toast = document.getElementById('report-toast');
			toaststyle = document.createElement('div');
			toaststyle.setAttribute('id','h3-report-toast-container')
			toaststyle.setAttribute('style',container); 
				
			if (typeof timeout === 'number') {
				showToast();
				timer = setTimeout(() => {
					// 动画结束后删除dom，清空变量
					hideToast();
				}, timeout);
			} else {
				if (timeout) {
					showToast();
				} else {
					hideToast();
				}
			}

			function showToast() {
				clearTimeout(timer);
				if (!toast) {
					toast = document.createElement('div');
					toast.setAttribute('id', 'report-toast');
					toast.setAttribute('style', style);
					document.body.appendChild(toaststyle);
					toaststyle.appendChild(toast);
				}
				// innerText会移除bg，所以每次都要插入
				toast.innerText = text;

				toast.setAttribute('class', 'animated fadeIn faster');

				toast.style.display = 'block';
				toast.style.opacity = '1';
			}

			function hideToast() {
				clearTimeout(timer);
				toast.addEventListener('animationend', removeToast);
				toast.setAttribute('class', 'animated fadeOut faster');
				toast.style.opacity = '0';
				(document.getElementById('h3-report-toast-container') as HTMLBaseElement).remove();
			}

			function removeToast() {
				toast.removeEventListener('animationend', removeToast);
				toast.style.display = 'none';
				toast = null;
			}
		};

		// 注册方法
		Vue.prototype.$toasts = toast;
		Vue.prototype.$toasts = (msg, timer) => {
            toast(msg, timer || 2000);
		};
		Vue.prototype.$showTips = msg => {
			toast(msg, true);
		};
		Vue.prototype.$hideTips = () => {
			toast('', false);
		};
	}
};
