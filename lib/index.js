'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Editor = require('./views/Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _style = require('./asset/style/style.css');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NEditor = {
    Editor: _Editor2.default,
    Style: _style2.default
};

exports.default = NEditor;