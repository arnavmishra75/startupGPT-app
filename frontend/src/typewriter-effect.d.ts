declare module 'typewriter-effect/dist/core' {
    interface Options {
      strings?: string[] | string;
      cursor?: string;
      delay?: 'natural' | number;
      deleteSpeed?: 'natural' | number;
      loop?: boolean;
      autoStart?: boolean;
      pauseFor?: number;
      devMode?: boolean;
      skipAddStyles?: boolean;
      wrapperClassName?: string;
      cursorClassName?: string;
      stringSplitter?: Function;
      onCreateTextNode?: Function;
      onRemoveNode?: Function;
    }
  
    export default class Typewriter {
      constructor(element: string, options: Options);
      start(): this;
      stop(): this;
      pauseFor(ms: number): this;
      typeString(text: string): this;
      pasteString(text: string): this;
      deleteAll(speed: 'natural' | number): this;
      deleteChars(amount: number): this;
      callFunction(cb: Function, thisArg?: any): this;
      changeDeleteSpeed(speed: 'natural' | number): this;
      changeDelay(delay: 'natural' | number): this;
    }
  }
  