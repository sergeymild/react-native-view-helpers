import { mergePropsStack } from '../StatusBar';

describe('mergePropsStack', () => {
  it('later entries override earlier, null values are ignored', () => {
    const result = mergePropsStack(
      [
        { barStyle: 'light-content' },
        { barStyle: null, backgroundColor: 'red' },
      ],
      { barStyle: 'default', backgroundColor: 'black', translucent: false }
    );
    expect(result.barStyle).toBe('light-content');
    expect(result.backgroundColor).toBe('red');
    expect(result.translucent).toBe(false);
  });
});
