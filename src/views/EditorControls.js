import React from 'react';
import "isomorphic-fetch";
import promise from 'es6-promise';

import fonts from '../asset/style/fonts.scss';
import styles from '../asset/style/editor.scss';

class Editor extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.listenLocalImageInput();
    }

    /**
     * @description     显示插入标题列表
     */
    toggleHeaders(action) {
        this.headers.classList[action === 'show' ? 'add' : 'remove'](styles['n-active']);
    }

    /**
     * @description     插入标题
     */
    heading(headerTag) {
        this.props.execCommand('formatBlock', headerTag);
        this.toggleHeaders('hide');
    }


    /**
     * @description     显示插入图片工具
     */
    togglePicture(action) {
        this.picture.classList[action === 'show' ? 'add' : 'remove'](styles['n-active']);
    }

    /**
     * @description     插入网络图片
     */
    insertNetPicture() {
        const pictureUrl = this.netPicture.value;
        if (!pictureUrl) {
            alert('请输入图片地址');
            return;
        }
        this.props.execCommand('insertImage', pictureUrl, true);
        this.togglePicture('hide');
    }

    /**
     * @description     插入本地图片
     */
    insertLocalImage() {
        const uploadPictureConfig = this.props.uploadPictureConfig;
        if (!uploadPictureConfig || !uploadPictureConfig.action) {
            alert('该功能不可用');
            return;
        }
        this.localPictureInput.click();
    }

    /**
     * @description 监听选择图片
     */
    listenLocalImageInput() {
        this.localPictureInput.onchange = () => {
            const uploadPictureConfig = this.props.uploadPictureConfig;

            let filePath = this.getFileUrl(this.localPictureInput.files[0]),
                formData = new FormData();

            formData.append('data', this.localPictureInput.files[0]);

            fetch(uploadPictureConfig.action, {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            }).then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error('Server Error : ' + res.status);
                }
            }).then((res) => {
                const keys = Object.keys(res);
                const count = keys.length;
                let url = res[keys[0]];

                if (uploadPictureConfig.format) {
                    url = uploadPictureConfig.format(url) || url;
                }

                if (count > 0) {
                    this.props.execCommand('insertImage', url, true);
                } else {
                    this.props.netPictureFail && this.props.onNetPictureFail()
                }
            })
        }
    }

    /**
     * @description     根据文件对象获取本地路径
     * @param file      文件对象
     * @returns {*}     本地路径
     */
    getFileUrl(file) {
        let url = null;
        if (window.createObjectURL !== undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL !== undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    /**
     * @description     显示插入链接工具
     */
    toggleLink(action) {
        this.link.classList[action === 'show' ? 'add' : 'remove'](styles['n-active']);
    }

    /**
     * @description     插入链接
     */
    insertLink() {
        const linkHref = this.linkHref.value;
        if (!linkHref) {
            alert('请输入链接地址');
            return;
        }
        if (linkHref.indexOf('http://') < 0) {
            alert('链接地址输入有误，请包涵http://或https://');
            return;
        }
        this.props.execCommand('insertHTML', '<a href="' + linkHref + '" target="_blank">' + linkHref + '</a>', true);
        this.toggleLink('hide');
    }

    render() {
        return <div className={styles["n-editor-controls"]}>
            <ul className={styles["n-editor-controls-container"]}>
                <li>
                    <button type="button" onClick={this.toggleHeaders.bind(this, 'show')}>
                        <i className={fonts["icon-header"]} data-icon></i>
                    </button>
                    <div className={styles['n-editor-controls-headers']}
                         ref={e => this.headers = e}
                         onMouseLeave={this.toggleHeaders.bind(this, 'hide')}>
                        <ul>
                            <li>
                                <button type="button" onClick={this.heading.bind(this, '<h1>')}>h1</button>
                            </li>
                            <li>
                                <button type="button" onClick={this.heading.bind(this, '<h2>')}>h2</button>
                            </li>
                            <li>
                                <button type="button" onClick={this.heading.bind(this, '<h3>')}>h3</button>
                            </li>
                            <li>
                                <button type="button" onClick={this.heading.bind(this, '<h4>')}>h4</button>
                            </li>
                            <li>
                                <button type="button" onClick={this.heading.bind(this, '<h5>')}>h5</button>
                            </li>
                            <li>
                                <button type="button" onClick={this.heading.bind(this, '<h6>')}>h6</button>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'formatBlock', '<p>')}>
                        <i className={fonts["icon-normal"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'bold')}>
                        <i className={fonts["icon-bold"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'italic')}>
                        <i className={fonts["icon-italic"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'underline')}>
                        <i className={fonts["icon-underline"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'strikeThrough')}>
                        <i className={fonts["icon-delete"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'formatBlock', '<blockquote>')}>
                        <i className={fonts["icon-reference"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'insertOrderedList')}>
                        <i className={fonts["icon-ol"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'insertUnorderedList')}>
                        <i className={fonts["icon-ul"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'justifyLeft')}>
                        <i className={fonts["icon-align-left"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'justifyCenter')}>
                        <i className={fonts["icon-align-center"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'justifyRight')}>
                        <i className={fonts["icon-align-right"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'insertHorizontalRule')}>
                        <i className={fonts["icon-hr"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.props.execCommand.bind(this, 'formatBlock', '<pre>')}>
                        <i className={fonts["icon-code"]} data-icon></i>
                    </button>
                </li>
                <li>
                    <button type="button" onClick={this.togglePicture.bind(this, 'show')}>
                        <i className={fonts["icon-picture"]} data-icon></i>
                    </button>
                    <div className={styles['n-editor-controls-picture']}
                         ref={e => this.picture = e}
                         onMouseLeave={this.togglePicture.bind(this, 'hide')}>
                        <div className={styles['n-editor-controls-picture-local']}>
                            <span>本地图片</span>
                            <span onClick={this.insertLocalImage.bind(this)}>点击上传<input type="file"
                                                                                        ref={e => this.localPictureInput = e}/></span>
                        </div>

                        <div className={styles['n-editor-controls-picture-net']}>
                            <span>网络图片</span>
                            <span><input type="text" placeholder="请输入图片地址" ref={e => this.netPicture = e}/></span>
                            <span><button type="button" onClick={this.insertNetPicture.bind(this)}>插入图片</button></span>
                        </div>
                    </div>
                </li>
                <li>
                    <button type="button" onClick={this.toggleLink.bind(this, 'show')}>
                        <i className={fonts["icon-link"]} data-icon></i>
                    </button>
                    <div className={styles['n-editor-controls-link']}
                         ref={e => this.link = e}
                         onMouseLeave={this.toggleLink.bind(this, 'hide')}>
                        <div className={styles['n-editor-controls-link-container']}>
                            <span>链接地址</span>
                            <span><input type="text" placeholder="请输入链接地址" ref={e => this.linkHref = e}/></span>
                            <span><button type="button" onClick={this.insertLink.bind(this)}>插入链接</button></span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    }

}

export default Editor;