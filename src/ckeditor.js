import {ClassicEditor as ClassicEditorBase} from "@ckeditor/ckeditor5-editor-classic"
import {Essentials} from "@ckeditor/ckeditor5-essentials"
import {Autoformat} from "@ckeditor/ckeditor5-autoformat"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript
} from "@ckeditor/ckeditor5-basic-styles"
import {BlockQuote} from "@ckeditor/ckeditor5-block-quote"
import {Heading} from "@ckeditor/ckeditor5-heading"
import {Link} from "@ckeditor/ckeditor5-link"
import {List, TodoList} from "@ckeditor/ckeditor5-list"
import {Paragraph} from "@ckeditor/ckeditor5-paragraph"
import {Table} from "@ckeditor/ckeditor5-table"
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor"
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor"
import {Alignment} from "@ckeditor/ckeditor5-alignment"
import {
  Image,
  ImageInsert,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload
} from "@ckeditor/ckeditor5-image"

import MyCustomUploadAdapterPlugin from "./uploadAdapter"

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
  Essentials,
  Autoformat,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  BlockQuote,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageInsert,
  Link,
  List,
  TodoList,
  Paragraph,
  Table,
  FontColor,
  FontBackgroundColor,
  Alignment
]

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "alignment",
      "underline",
      "strikethrough",
      "subscript",
      "superscript",
      "link",
      "fontColor",
      "fontBackgroundColor",
      "bulletedList",
      "numberedList",
      "todoList",
      "|",
      "imageUpload",
      "blockQuote",
      "undo",
      "redo",
      "insertTable"
    ]
  },
  language: "en",
  extraPlugins: [MyCustomUploadAdapterPlugin],
  image: {
    toolbar: ["imageTextAlternative", "imageStyle:inline", "imageStyle:block", "imageStyle:side"]
  }
}
