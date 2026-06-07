import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        trigger?: string;
        colors?: string;
        delay?: string;
        stroke?: string;
        state?: string;
        style?: React.CSSProperties;
      };
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          src?: string;
          trigger?: string;
          colors?: string;
          delay?: string;
          stroke?: string;
          state?: string;
          style?: React.CSSProperties;
        };
      }
    }
  }
}
