import React, { Component } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor'

class Ckeditor extends Component {
  constructor(props){
    super(props);
    let editorConfig = {
      toolbar: ['fontfamily', 'fontsize', 'fontcolor', 'bold', 'italic', 'alignment', 'bulletedList', 'indent', 'outdent', 
      'numberedList', 'link', 'blockQuote', 'HtmlEmbed', 'codeblock', 'imageinsert', 'mediaembed', 'undo', 'redo' ],
    };
    this.state = {
      config: editorConfig,
      data: '',
    }
  }

  render() {
    return (
      <div className="Ckeditor">
        <CKEditor
          editor={ ClassicEditor }
          config={ this.state.config }
          onReady={ editor => {
            this.props.getCKEditor(editor)
          } }
          onChange={ ( event, editor ) => {
            const data = editor.getData()
          } }
          onBlur={ ( event, editor ) => {
            console.log( 'Blur.', editor )
          } }
          onFocus={ ( event, editor ) => {
            console.log( 'Focus.', editor )
          } }
        />
      </div>
    )
  }
}

export default Ckeditor