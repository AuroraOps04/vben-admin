import type Quill from 'quill';

import { message } from 'ant-design-vue';
import { Module, Range } from 'quill';

import { LoadingImage } from './blots';

import './index.css';

type Options = {
  accept?: string;
  loadingClass: string;
  maxSize?: number;
  upload: (file: File) => Promise<string>;
};

export class ImageUploader extends Module<Options> {
  accept = '';
  fileHolder: HTMLInputElement | null;
  maxSize = 5 * 1024 * 1024;
  placeholderIndex = 0;
  range: null | Range;
  constructor(quill: Quill, options: Partial<Options>) {
    super(quill, options);

    this.quill = quill;
    this.options = options;
    this.range = null;
    this.fileHolder = null;
    if (this.options.loadingClass) {
      LoadingImage.className = this.options.loadingClass;
    }
    if (this.options.maxSize) {
      this.maxSize = this.options.maxSize;
    }
    if (this.options.accept) {
      this.accept = this.options.accept;
    }
    const toolbar: any = this.quill.getModule('toolbar');
    toolbar.addHandler('image', this.selectLocalImage.bind(this));
    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);

    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  fileChanged() {
    if (this.fileHolder) {
      const file = this.fileHolder.files?.[0];
      this.readAndUploadFile(file);
    }
  }

  handleDrop(evt: DragEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    if (
      evt.dataTransfer &&
      evt.dataTransfer.files &&
      evt.dataTransfer.files.length > 0
    ) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.startContainer,
            range.startOffset,
          );
        }
      } else {
        const selection = document.getSelection();
        const range = document.caretPositionFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.offsetNode,
            range.offset,
            range.offsetNode,
            range.offset,
          );
        }
      }

      this.range = this.quill.getSelection();
      const file = evt.dataTransfer.files[0];

      setTimeout(() => {
        this.range = this.quill.getSelection();
        this.readAndUploadFile(file);
      }, 0);
    }
  }

  handlePaste(evt: ClipboardEvent) {
    const clipboard = evt.clipboardData || (window as any).clipboardData;

    // IE 11 is .files other browsers are .items
    if (clipboard && (clipboard.items || clipboard.files)) {
      const items = clipboard.items || clipboard.files;
      const IMAGE_MIME_REGEX = /^image\/(?:jpe?g|gif|png|svg|webp)$/i;

      for (const item of items) {
        if (IMAGE_MIME_REGEX.test(item.type)) {
          const file = item.getAsFile ? item.getAsFile() : item;

          if (file) {
            this.range = this.quill.getSelection();
            evt.preventDefault();
            setTimeout(() => {
              this.range = this.quill.getSelection();
              this.readAndUploadFile(file);
            }, 0);
          }
        }
      }
    }
  }

  insertBase64Image(url: string) {
    const { range } = this;
    if (!range) return;
    this.placeholderIndex = range.index;
    this.quill.insertEmbed(
      range.index,
      LoadingImage.blotName,
      `${url}`,
      'user',
    );
  }

  insertToEditor(url: string) {
    const { range } = this;
    if (!range) {
      return;
    }
    // Delete the placeholder image
    this.quill.deleteText(this.placeholderIndex, 3, 'user');
    // Insert the server saved image
    this.quill.insertEmbed(range.index, 'image', `${url}`, 'user');

    range.index++;
    this.quill.setSelection(range, 'user');
  }

  readAndUploadFile(file?: File) {
    if (!file) return;
    if (file.size > this.maxSize) {
      message.warn('图片太大了～');
      return;
    }

    let isUploadReject = false;

    const fileReader = new FileReader();

    fileReader.addEventListener(
      'load',
      () => {
        if (!isUploadReject) {
          const base64ImageSrc = fileReader.result;
          this.insertBase64Image(base64ImageSrc as string);
        }
      },
      false,
    );

    if (file) {
      fileReader.readAsDataURL(file);
    }

    if (!this.options.upload) {
      return;
    }
    this.options.upload(file).then(
      (imageUrl: string) => {
        this.insertToEditor(imageUrl);
      },
      (error: any) => {
        isUploadReject = true;
        this.removeBase64Image();
        console.warn(error);
      },
    );
  }

  removeBase64Image() {
    const { range } = this;
    if (!range) return;
    this.quill.deleteText(this.placeholderIndex, 3, 'user');
  }

  selectLocalImage() {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement('input');
    this.fileHolder.setAttribute('type', 'file');
    this.fileHolder.setAttribute('accept', 'image/*');
    this.fileHolder.setAttribute('style', 'visibility:hidden');

    this.fileHolder.addEventListener('change', this.fileChanged.bind(this));

    document.body.append(this.fileHolder);

    this.fileHolder.click();

    window.requestAnimationFrame(() => {
      if (this.fileHolder) {
        this.fileHolder.remove();
      }
    });
  }
}

(window as any).ImageUploader = ImageUploader;
