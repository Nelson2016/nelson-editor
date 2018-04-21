import React from 'react';

import EditorControls from './EditorControls';

import styles from '../asset/style/editor.scss';


class Editor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            debug: !!this.props.debug,
            savedSelection: {start: 0, end: 0}
        }
    }


    /**
     * @description     执行各项工具命令
     */
    execCommand(command, value, setRange) {
        setRange && this.restoreSelection();
        document.execCommand(command, false, value || null);
    }

    /**
     * @description     存储当前光标位置
     */
    saveSelection() {
        const container = this.textArea;
        let range = window.getSelection().getRangeAt(0);
        let preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(container);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        let start = preSelectionRange.toString().length;

        let state = this.state;

        this.setState(Object.assign(state, {
            savedSelection: {
                start: start,
                end: start + range.toString().length
            }
        }))
    };

    /**
     * @description     设置光标位置
     */
    restoreSelection() {
        const container = this.textArea, savedSelection = this.state.savedSelection;
        let charIndex = 0, range = document.createRange();

        range.setStart(container, 0);
        range.collapse(true);
        let nodeStack = [container], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType === 3) {
                let nextCharIndex = charIndex + node.length;
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
                let i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    /**
     * @description     组织默认粘贴事件，过滤样式
     */
    onPaste(e) {
        e.preventDefault();
        this.execCommand('insertText', e.clipboardData.getData('Text'))
    }

    /**
     * @description     监听缩进与反缩进
     */
    onKeyDown(e) {
        if (e.keyCode === 9) {
            e.preventDefault();
            this.execCommand(e.shiftKey ? 'outdent' : 'indent');
        }
    }

    /**
     * @description 获取/设置编辑器内筒
     */
    val(value) {
        const val = this.textArea.innerHTML;
        return value === undefined ? val === '<p><br></p>' ? '' : val : this.textArea.innerHTML = value;
    }

    render() {

        return <div className={styles["n-editor"]}>
            <EditorControls execCommand={this.execCommand.bind(this)}
                            uploadPictureConfig={this.props.uploadPictureConfig}/>
            <div className={styles["n-editor-text-area"]}
                 contentEditable={true}
                 suppressContentEditableWarning={true}
                 onBlur={this.saveSelection.bind(this)}
                 onPaste={this.onPaste.bind(this)}
                 onKeyDown={this.onKeyDown.bind(this)}
                 ref={e => this.textArea = e}>
                {/*保证回车换行语义化*/}
                <p><br/></p>
            </div>
        </div>
    }

}

export default Editor;