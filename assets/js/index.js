$(function(){
    getUserInfo();

    var layer = layui.layer

    $('#btnLogout').on('click',function(){
        // 提示用户是否确认退出
        layer.confirm('确定要退出吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1.清空本地存储中的token
            // 2.跳转到登录页
            localStorage.removeItem('token')
            location.href = '/login.html'

            // 这是关闭confirm询问框
            layer.close(index);
          });
    })
})

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers就是请求头的配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token')||''
        // },
        success:function(res){
            // console.log(res);
            if(res.status!==0){
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用rendAvatar渲染用户头像
            rendAvatar(res.data)
        },
        // complete:function(res){
        //     // 不论成功和失败都会调用complete回调函数
        //     // console.log('执行了complete回调：')
        //     console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if(res.responseJSON.status===1 && res.responseJSON.message==='身份认证失败！'){
        //         // 1.强制清空token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登录页
        //         location.href = '/login.html'
        //     }
        // }
    })
}

function rendAvatar(user){
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 按需渲染用户的头像
    if(user.user_pic!==null){
        // 渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}