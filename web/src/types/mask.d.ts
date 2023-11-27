declare module "inputmask-core" {
  interface InputmaskResult {
    value: string;
  }

  interface InputmaskOptions {
    mask: string;
  }

  export default class Inputmask {
    constructor(options: InputmaskOptions);

    process(value: string): InputmaskResult;
  }
}
