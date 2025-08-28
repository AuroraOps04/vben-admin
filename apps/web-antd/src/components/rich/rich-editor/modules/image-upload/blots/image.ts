import Quill from 'quill';

const InlineBlot: any = Quill.import('blots/block');

export class LoadingImage extends InlineBlot {
  static create(src: boolean | string): HTMLElement {
    const node: HTMLElement = super.create(src);
    if (src === true) return node;
    const image = document.createElement('img');
    image.setAttribute('src', src as string);
    node.append(image);
    return node;
  }

  static value(domNode: HTMLElement) {
    const { src, custom } = domNode.dataset as any;
    return { src, custom };
  }

  deleteAt(index: number, length: number) {
    super.deleteAt(index, length);
    this.cache = {};
  }
}

LoadingImage.blotName = 'imageBlot';
LoadingImage.className = 'quill-image-uploading';
LoadingImage.tagName = 'span';
Quill.register({ 'formats/imageBlot': LoadingImage });
