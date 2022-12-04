import { getAppHomeDeepLink } from '../links'

describe('Test link generators', () => {
  it('should create a app home link', () => {
    const link = getAppHomeDeepLink('test', '123')

    expect(link).toEqual('slack://app?team=test&id=123')
  })
})
