$(function(){

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat =function(date){
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth()+1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' +d + ' '+hh+":"+mm+":"+ss
    }
    // 定义补0函数
    function padZero(n){
        return n>9?n:'0'+n

    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum:1,//页码值,默认请求第一页的数据
        pagesize:2,//每页显示的数据，默认每页显示2条
        cate_id:'',//文章分类id
        state:''//文章发布的状态

    }

    initTable()
    initCate()
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                // console.log(res);
                if(res.status!==0){
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染列表数据
                var htmlStr =template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)

                // 通知layui，重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    $('#form-search').on('submit',function(e){
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性复制
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total){
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,分页容器的ID
            count: total, //数据总数，从服务端得到
            limit:q.pagesize,//每页显示多少条
            curr:q.pagenum,//设置默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            // 分页发生切换的时候，触发jump回调
            // 触发jump的方式有两种：
            // 1:点击页码的时候，会触发Jump
            // 2:只要调用layer.render方法就会触发jump
            jump:function(obj,first){
                // 可以通过first的值，来判断是通过哪种方式，触发的jump回调
                // 如果first的值为true 表示方式2触发
                // 否则方式1触发
                // 重新复制新的页码值
                q.pagenum = obj.curr
                // 把最新的条目数重新复制给pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的q的页码值，重新渲染列表
                if(!first){
                    initTable()
                }
            }
          });
    }


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-delete',function(){
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // console.log(len);
        // 通过自定义属性获取Id的值
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    // 当数据删除完成后，需要判断当前这一也中是否还有剩余的数据，如果没有数据了让页码值-1，再重新调用initTable()
                    // 4 
                    if(len===1){
                        // 如果len的值等1,那么证明页面上没有数据了
                        // 页面值最小必须 为 1
                        q.pagenum = q.pagenum===1?1:q.pagenum-1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
          });
    })
})