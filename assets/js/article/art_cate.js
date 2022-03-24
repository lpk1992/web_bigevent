$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类的列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null
    $('#btnAddcate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 利用类似模板引擎的方式
            content: $('#dialog-add').html()
        });
        //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。
    })


    // 通过代理的形式，为form-add表单半丁submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })
    // 通过代理的形式，为btn-add按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 利用类似模板引擎的方式
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //  通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-Id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+ id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

})