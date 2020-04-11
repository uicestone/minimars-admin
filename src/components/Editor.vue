<template>
  <div>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div>
        <md-button
          class="md-simple md-sm md-just-icon"
          :class="{ 'md-primary': isActive.bold() }"
          @click="commands.bold"
        >
          <md-icon>format_bold</md-icon>
        </md-button>
        <md-button
          class="md-simple md-sm md-just-icon"
          :class="{ 'md-primary': isActive.italic() }"
          @click="commands.italic"
        >
          <md-icon>format_italic</md-icon>
        </md-button>
        <md-button
          class="md-simple md-sm md-just-icon"
          :class="{ 'md-primary': isActive.underline() }"
          @click="commands.underline"
        >
          <md-icon>format_underline</md-icon>
        </md-button>
        <md-button
          class="md-simple md-sm md-just-icon"
          :class="{ 'md-primary': isActive.strike() }"
          @click="commands.strike"
        >
          <md-icon>format_clear</md-icon>
        </md-button>
        <md-menu style="margin:.3125rem 1px">
          <md-button class="md-simple md-sm md-just-icon" md-menu-trigger>
            <md-icon>format_size</md-icon>
          </md-button>
          <md-menu-content>
            <md-button
              class="md-simple md-sm md-just-icon"
              :class="{
                'md-primary': isActive.heading({ level: 1 })
              }"
              @click="commands.heading({ level: 1 })"
            >
              <span>H1</span>
            </md-button>
            <md-button
              class="md-simple md-sm md-just-icon"
              :class="{
                'md-primary': isActive.heading({ level: 2 })
              }"
              @click="commands.heading({ level: 2 })"
            >
              <span>H2</span>
            </md-button>
            <md-button
              class="md-simple md-sm md-just-icon"
              :class="{
                'md-primary': isActive.heading({ level: 3 })
              }"
              @click="commands.heading({ level: 3 })"
            >
              <span>H3</span>
            </md-button>
          </md-menu-content>
        </md-menu>
        <md-button
          class="md-simple md-sm md-just-icon"
          :class="{ 'md-primary': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <md-icon>format_list_bulleted</md-icon>
        </md-button>
        <md-button
          class="md-simple md-sm md-just-icon"
          :class="{ 'md-primary': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <md-icon>format_list_numbered</md-icon>
        </md-button>
        <md-button
          class="md-simple md-sm md-just-icon"
          :class="{ 'md-primary': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <md-icon>format_quote</md-icon>
        </md-button>
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" :content="value" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from "tiptap-extensions";
import ImageUpload from "@/helpers/ImageUpload";
import { http } from "@/resources";

export default {
  name: "editor",
  components: {
    EditorContent,
    EditorMenuBar
  },
  data() {
    return {
      editor: null
    };
  },
  props: {
    value: { type: String, default: "" }
  },
  methods: {
    async uploadImage(file) {
      const formData = new FormData();
      formData.append("file", file);
      const fileObject = (
        await http.post("file", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      ).data;
      return fileObject.url;
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new ImageUpload({
          uploader: image => {
            // Method that handles the image upload and returns a url(string)
            return this.uploadImage(image);
          }
        })
      ],
      content: this.value,
      onUpdate: ({ getHTML }) => {
        // get new content on update
        this.$emit("input", getHTML());
        // getHTML()
        //   .match(/src="(data:image.*?)"/g)
        //   .map(async src => {
        //     const dataUri = src.match(/src="(data:image.*?)"/)[1];
        //     const file = dataUriToBlob(dataUri);
        //     const formData = new FormData();
        //     formData.append("file", file);
        //     const fileObject = (
        //       await http.post("file", formData, {
        //         headers: {
        //           "Content-Type": "multipart/form-data"
        //         }
        //       })
        //     ).data;
        //     console.log(fileObject);
        //   });
      }
    });
  },
  watch: {
    value(v) {
      this.editor.setContent(v);
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style lang="scss" scoped></style>
