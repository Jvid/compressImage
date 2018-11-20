/*
	param: 
	el: input上传标签
	options: 设置最小的宽高 默认400*400
	cb: 将二进制的文件回调出去方便上传
*/
class CompressImage {
	constructor(el,options={width:400,height:400},cb) {
		this.state = {
			el,
			cb,
			options,
			reader: new FileReader(),
			img: new Image(),
			file: null,
			canvas: document.createElement('canvas')
		}
		this.bindEvent = this.bindEvent.bind(this)
		this.setState = this.setState.bind(this)
		this.init()
	}
	init(){
		this.bindEvent()
	}
	bindEvent() {
		let { el,img,reader,file,options,canvas } = this.state
		let context = canvas.getContext('2d')
		// 监听上传标签的变化
		el.addEventListener('change',(e) => {
			let upFile = e.target.files[0]
			this.setState({file: upFile})
			if (upFile.type.indexOf("image") == 0) {
	      reader.readAsDataURL(upFile);
	    }
		})
		// fileReader获取完毕之后将照片赋值给img的url
		reader.onload = (e) => {
		  img.src = e.target.result;
		  this.setState({img})
		};
		// 照片加载完可以获取其宽高
		img.onload = () => {
			let {file} = this.state
			// 图片原始尺寸
			let originWidth = img.width;
			let originHeight = img.height;
			// 最大尺寸限制
			let maxWidth = options.width, maxHeight = options.height
			// 目标尺寸
			let targetWidth = originWidth, targetHeight = originHeight;
			// 图片尺寸超过400x400的限制
			if (originWidth > maxWidth || originHeight > maxHeight) {
				if (originWidth / originHeight > maxWidth / maxHeight) {
					// 更宽，按照宽度限定尺寸
					targetWidth = maxWidth;
					targetHeight = Math.round(maxWidth * (originHeight / originWidth));
				} else {
					targetHeight = maxHeight;
					targetWidth = Math.round(maxHeight * (originWidth / originHeight));
				}
			}
			// canvas对图片进行缩放
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			// 清除画布
			context.clearRect(0, 0, targetWidth, targetHeight);
			// 图片压缩
			context.drawImage(img, 0, 0, targetWidth, targetHeight);
			// canvas转为blob并回调
			canvas.toBlob((blob) => {
				cb(blob)
			}, file.type || 'image/png')
		}
	}
	// 设置属性值
	setState(obj) {
		for(let k in obj){
			obj.hasOwnProperty(k) && (this.state[k] = obj[k])
		}
	}
}