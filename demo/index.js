let uploadDom = document.querySelector('#upload')
upload.addEventListener('change',(e) => {
	console.log(111,this,e)
})

let cb = (data) => {
	console.log('this is callback',data.size/1024)
}

new CompressImage(uploadDom,{width:200,height:200},cb)