// 每次调用$.post,$.get或$.ajax的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    console.log(options.url)
    // 在发起真正的ajax请求时，先统一请求路径
    options.url = 'http://www.liulongbin.top:3007'+options.url
    console.log(options.url)
})