'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('isomorphic-fetch');

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _fonts = require('../asset/style/fonts.css');

var _fonts2 = _interopRequireDefault(_fonts);

var _editor = require('../asset/style/editor.css');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Editor = function (_React$Component) {
    _inherits(Editor, _React$Component);

    function Editor(props) {
        _classCallCheck(this, Editor);

        return _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));
    }

    _createClass(Editor, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.listenLocalImageInput();
        }

        /**
         * @description     显示插入标题列表
         */

    }, {
        key: 'toggleHeaders',
        value: function toggleHeaders(action) {
            this.headers.classList[action === 'show' ? 'add' : 'remove'](_editor2.default['n-active']);
        }

        /**
         * @description     插入标题
         */

    }, {
        key: 'heading',
        value: function heading(headerTag) {
            this.props.execCommand('formatBlock', headerTag);
            this.toggleHeaders('hide');
        }

        /**
         * @description     显示插入图片工具
         */

    }, {
        key: 'togglePicture',
        value: function togglePicture(action) {
            this.picture.classList[action === 'show' ? 'add' : 'remove'](_editor2.default['n-active']);
        }

        /**
         * @description     插入网络图片
         */

    }, {
        key: 'insertNetPicture',
        value: function insertNetPicture() {
            var pictureUrl = this.netPicture.value;
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

    }, {
        key: 'insertLocalImage',
        value: function insertLocalImage() {
            var uploadPictureConfig = this.props.uploadPictureConfig;
            if (!uploadPictureConfig || !uploadPictureConfig.action) {
                alert('该功能不可用');
                return;
            }
            this.localPictureInput.click();
        }

        /**
         * @description 监听选择图片
         */

    }, {
        key: 'listenLocalImageInput',
        value: function listenLocalImageInput() {
            var _this2 = this;

            this.localPictureInput.onchange = function () {
                var uploadPictureConfig = _this2.props.uploadPictureConfig;

                var filePath = _this2.getFileUrl(_this2.localPictureInput.files[0]),
                    formData = new FormData();

                formData.append('data', _this2.localPictureInput.files[0]);

                fetch(uploadPictureConfig.action, {
                    method: 'POST',
                    credentials: 'same-origin',
                    body: formData
                }).then(function (res) {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        throw new Error('Server Error : ' + res.status);
                    }
                }).then(function (res) {
                    var keys = Object.keys(res);
                    var count = keys.length;
                    var url = res[keys[0]];

                    if (uploadPictureConfig.format) {
                        url = uploadPictureConfig.format(url) || url;
                    }

                    if (count > 0) {
                        _this2.props.execCommand('insertImage', url, true);
                    } else {
                        _this2.props.netPictureFail && _this2.props.onNetPictureFail();
                    }
                });
            };
        }

        /**
         * @description     根据文件对象获取本地路径
         * @param file      文件对象
         * @returns {*}     本地路径
         */

    }, {
        key: 'getFileUrl',
        value: function getFileUrl(file) {
            var url = null;
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

    }, {
        key: 'toggleLink',
        value: function toggleLink(action) {
            this.link.classList[action === 'show' ? 'add' : 'remove'](_editor2.default['n-active']);
        }

        /**
         * @description     插入链接
         */

    }, {
        key: 'insertLink',
        value: function insertLink() {
            var linkHref = this.linkHref.value;
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
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                { className: _editor2.default["n-editor-controls"] },
                _react2.default.createElement(
                    'ul',
                    { className: _editor2.default["n-editor-controls-container"] },
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.toggleHeaders.bind(this, 'show') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-header"], 'data-icon': true })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _editor2.default['n-editor-controls-headers'],
                                ref: function ref(e) {
                                    return _this3.headers = e;
                                },
                                onMouseLeave: this.toggleHeaders.bind(this, 'hide') },
                            _react2.default.createElement(
                                'ul',
                                null,
                                _react2.default.createElement(
                                    'li',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.heading.bind(this, '<h1>') },
                                        'h1'
                                    )
                                ),
                                _react2.default.createElement(
                                    'li',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.heading.bind(this, '<h2>') },
                                        'h2'
                                    )
                                ),
                                _react2.default.createElement(
                                    'li',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.heading.bind(this, '<h3>') },
                                        'h3'
                                    )
                                ),
                                _react2.default.createElement(
                                    'li',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.heading.bind(this, '<h4>') },
                                        'h4'
                                    )
                                ),
                                _react2.default.createElement(
                                    'li',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.heading.bind(this, '<h5>') },
                                        'h5'
                                    )
                                ),
                                _react2.default.createElement(
                                    'li',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.heading.bind(this, '<h6>') },
                                        'h6'
                                    )
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'formatBlock', '<p>') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-normal"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'bold') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-bold"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'italic') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-italic"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'underline') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-underline"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'strikeThrough') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-delete"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'formatBlock', '<blockquote>') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-reference"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'insertOrderedList') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-ol"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'insertUnorderedList') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-ul"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'justifyLeft') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-align-left"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'justifyCenter') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-align-center"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'justifyRight') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-align-right"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'insertHorizontalRule') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-hr"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.props.execCommand.bind(this, 'formatBlock', '<pre>') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-code"], 'data-icon': true })
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.togglePicture.bind(this, 'show') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-picture"], 'data-icon': true })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _editor2.default['n-editor-controls-picture'],
                                ref: function ref(e) {
                                    return _this3.picture = e;
                                },
                                onMouseLeave: this.togglePicture.bind(this, 'hide') },
                            _react2.default.createElement(
                                'div',
                                { className: _editor2.default['n-editor-controls-picture-local'] },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '\u672C\u5730\u56FE\u7247'
                                ),
                                _react2.default.createElement(
                                    'span',
                                    { onClick: this.insertLocalImage.bind(this) },
                                    '\u70B9\u51FB\u4E0A\u4F20',
                                    _react2.default.createElement('input', { type: 'file',
                                        ref: function ref(e) {
                                            return _this3.localPictureInput = e;
                                        } })
                                )
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: _editor2.default['n-editor-controls-picture-net'] },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '\u7F51\u7EDC\u56FE\u7247'
                                ),
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    _react2.default.createElement('input', { type: 'text', placeholder: '\u8BF7\u8F93\u5165\u56FE\u7247\u5730\u5740', ref: function ref(e) {
                                            return _this3.netPicture = e;
                                        } })
                                ),
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.insertNetPicture.bind(this) },
                                        '\u63D2\u5165\u56FE\u7247'
                                    )
                                )
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'button',
                            { type: 'button', onClick: this.toggleLink.bind(this, 'show') },
                            _react2.default.createElement('i', { className: _fonts2.default["icon-link"], 'data-icon': true })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: _editor2.default['n-editor-controls-link'],
                                ref: function ref(e) {
                                    return _this3.link = e;
                                },
                                onMouseLeave: this.toggleLink.bind(this, 'hide') },
                            _react2.default.createElement(
                                'div',
                                { className: _editor2.default['n-editor-controls-link-container'] },
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    '\u94FE\u63A5\u5730\u5740'
                                ),
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    _react2.default.createElement('input', { type: 'text', placeholder: '\u8BF7\u8F93\u5165\u94FE\u63A5\u5730\u5740', ref: function ref(e) {
                                            return _this3.linkHref = e;
                                        } })
                                ),
                                _react2.default.createElement(
                                    'span',
                                    null,
                                    _react2.default.createElement(
                                        'button',
                                        { type: 'button', onClick: this.insertLink.bind(this) },
                                        '\u63D2\u5165\u94FE\u63A5'
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Editor;
}(_react2.default.Component);

exports.default = Editor;