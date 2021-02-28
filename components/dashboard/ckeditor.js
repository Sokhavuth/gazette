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
          data="<p>Hello from CKEditor 5!</p>"
          onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            console.log( 'Editor is ready to use!', editor )
          } }
          onChange={ ( event, editor ) => {
            const data = editor.getData()
            console.log( { event, editor, data } )
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