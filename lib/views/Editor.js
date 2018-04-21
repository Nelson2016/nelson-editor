'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _EditorControls = require('./EditorControls');

var _EditorControls2 = _interopRequireDefault(_EditorControls);

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

        var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

        _this.state = {
            debug: !!_this.props.debug,
            savedSelection: { start: 0, end: 0 }
        };
        return _this;
    }

    /**
     * @description     执行各项工具命令
     */


    _createClass(Editor, [{
        key: 'execCommand',
        value: function execCommand(command, value, setRange) {
            setRange && this.restoreSelection();
            document.execCommand(command, false, value || null);
        }

        /**
         * @description     存储当前光标位置
         */

    }, {
        key: 'saveSelection',
        value: function saveSelection() {
            var container = this.textArea;
            var range = window.getSelection().getRangeAt(0);
            var preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(container);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            var start = preSelectionRange.toString().length;

            var state = this.state;

            this.setState(Object.assign(state, {
                savedSelection: {
                    start: start,
                    end: start + range.toString().length
                }
            }));
        }
    }, {
        key: 'restoreSelection',


        /**
         * @description     设置光标位置
         */
        value: function restoreSelection() {
            var container = this.textArea,
                savedSelection = this.state.savedSelection;
            var charIndex = 0,
                range = document.createRange();

            range.setStart(container, 0);
            range.collapse(true);
            var nodeStack = [container],
                node = void 0,
                foundStart = false,
                stop = false;

            while (!stop && (node = nodeStack.pop())) {
                if (node.nodeType === 3) {
                    var nextCharIndex = charIndex + node.length;
                    if (!foundStart && savedSelection.start >= charIndex && savedSelection.start <= nextCharIndex) {
                        range.setStart(node, savedSelection.start - charIndex);
                        foundStart = true;
                    }
                    if (foundStart && savedSelection.end >= charIndex && savedSelection.end <= nextCharIndex) {
                        range.setEnd(node, savedSelection.end - charIndex);
                        stop = true;
                    }
                    charIndex = nextCharIndex;
                } else {
                    var i = node.childNodes.length;
                    while (i--) {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }

            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        /**
         * @description     组织默认粘贴事件，过滤样式
         */

    }, {
        key: 'onPaste',
        value: function onPaste(e) {
            e.preventDefault();
            this.execCommand('insertText', e.clipboardData.getData('Text'));
        }

        /**
         * @description     监听缩进与反缩进
         */

    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            if (e.keyCode === 9) {
                e.preventDefault();
                this.execCommand(e.shiftKey ? 'outdent' : 'indent');
            }
        }

        /**
         * @description 获取/设置编辑器内筒
         */

    }, {
        key: 'val',
        value: function val(value) {
            var val = this.textArea.innerHTML;
            return value === undefined ? val === '<p><br></p>' ? '' : val : this.textArea.innerHTML = value;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: _editor2.default["n-editor"] },
                _react2.default.createElement(_EditorControls2.default, { execCommand: this.execCommand.bind(this),
                    uploadPictureConfig: this.props.uploadPictureConfig }),
                _react2.default.createElement(
                    'div',
                    { className: _editor2.default["n-editor-text-area"],
                        contentEditable: true,
                        suppressContentEditableWarning: true,
                        onBlur: this.saveSelection.bind(this),
                        onPaste: this.onPaste.bind(this),
                        onKeyDown: this.onKeyDown.bind(this),
                        ref: function ref(e) {
                            return _this2.textArea = e;
                        } },
                    _react2.default.createElement(
                        'p',
                        null,
                        _react2.default.createElement('br', null)
                    )
                )
            );
        }
    }]);

    return Editor;
}(_react2.default.Component);

exports.default = Editor;