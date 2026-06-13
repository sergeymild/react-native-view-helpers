import { AppState, Platform } from 'react-native';

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

const originalOS = Platform.OS;

afterAll(() => {
  Platform.OS = originalOS;
});

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

describe('subscribeOnAppLifecycle (ios)', () => {
  beforeAll(() => {
    Platform.OS = 'ios';
  });

  it('invokes callback only for requested states', () => {
    let handler: ((s: string) => void) | null = null;
    const addSpy = jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((_event, cb) => {
        handler = cb as (s: string) => void;
        return { remove: jest.fn() };
      });

    const { subscribeOnAppLifecycle } = require('../index');
    const received: string[] = [];
    subscribeOnAppLifecycle(['active', 'background'], (s: string) =>
      received.push(s)
    );

    handler!('active');
    handler!('inactive'); // filtered out
    handler!('background');

    expect(received).toEqual(['active', 'background']);

    addSpy.mockRestore();
  });
});
