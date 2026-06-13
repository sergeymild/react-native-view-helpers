import { Platform } from 'react-native';

let onChangeCb: ((s: string) => void) | null = null;
const removeMock = jest.fn();
jest.mock('../NativeLifecycle', () => ({
  __esModule: true,
  default: {
    onChange: (cb: (s: string) => void) => {
      onChangeCb = cb;
      return { remove: removeMock };
    },
  },
}));

describe('subscribeOnAppLifecycle (android)', () => {
  beforeAll(() => {
    Platform.OS = 'android';
  });

  it('invokes callback only for requested states', () => {
    const { subscribeOnAppLifecycle } = require('../index');
    const received: string[] = [];
    const sub = subscribeOnAppLifecycle(['active', 'background'], (s: string) =>
      received.push(s)
    );

    onChangeCb!('active');
    onChangeCb!('inactive'); // filtered out
    onChangeCb!('background');

    expect(received).toEqual(['active', 'background']);

    sub.remove();
    expect(removeMock).toHaveBeenCalled();
  });
});
