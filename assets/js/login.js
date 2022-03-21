$(function(){
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中后去form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify（）函数自定义校验规则
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        repwd: function(value,item){
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到再次确认密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if(pwd!==value){
                return '两次密码不一致，请确认'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        // 阻止默认提交行为
        e.preventDefault()
        // 发起ajax post请求
        $.post('/api/reguser',
        {
            username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val()
        },function(res){
            if(res.status!==0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            // 模拟人的点击行为
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // 将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token',res.token)
                // console.log(res.token);
                // location.href = 'index.html'
            }

        })
    })
})