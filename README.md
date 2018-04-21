# 介绍
    NE是一款简洁的基于react、支持服务端渲染的富文本编辑器
    在线demo：[NE在线Demo](http://ne.nelsonlee.site "NE在线Demo")
    
    demo中：后端采用koa等；前端采用React+React-Router+Redux+CSS Module等。
    
    
# 安装
    npm install ne --save-dev
  
# 使用

    import NEditor from 'ne';
    
    //获取NEditor组件实例
    const Editor = NEditor.Editor;
    //获取NEditor样式，用于页面显示
    const EditorStyle = NEditor.Style;
    
    //安装组件
    <Editor ref={e => this.editor = e}
            uploadPictureConfig={{
            action: '/api/uploadPicture',//本地图片上传地址
            format: this.format//本地图片上传后的url格式化方法
            }}/>
            
    //用于显示
    <div className={style['editor-container']}>
         <article ref={e => this.showContent = e} className={EditorStyle['editor-container']}>
         </article>
    </div> 
    
# API
    
    Editor.val(value:string) 获取/设置编辑器的值
    
    value为空则返回编辑器的值，不为空则设置编辑器的值。
 