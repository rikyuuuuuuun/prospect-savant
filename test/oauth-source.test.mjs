import test from 'node:test';
import assert from 'node:assert/strict';
import { getAccessToken, requestOAuthToken } from '../scripts/fetch-private-savant-source.mjs';

test('OAuth transient failures retry with fresh deadlines and no private diagnostics', async () => {
  const signals = [], delays = [], logs = [];
  const request = {method:'POST', headers:{'content-type':'application/x-www-form-urlencoded'}, body:'private assertion'};
  const result = await requestOAuthToken('https://oauth.invalid/private', request, {
    fetchImpl: async (_url, options) => {
      signals.push(options.signal);
      assert.equal(options.method, 'POST');
      assert.equal(options.body, request.body);
      if (signals.length === 1) return {ok:false,status:503,headers:new Headers()};
      if (signals.length === 2) throw new TypeError('private network detail');
      return {ok:true,json:async()=>({access_token:'synthetic'})};
    }, sleep:async d=>delays.push(d), random:()=>0, logger:message=>logs.push(message),
  });
  assert.equal(result.access_token, 'synthetic');
  assert.deepEqual(delays,[1000,2000]);
  assert.equal(new Set(signals).size,3);
  assert.ok(logs.every(log=>log.includes('Google OAuth') && !log.includes('private')));
});

test('OAuth rejects permanent HTTP and corrupt responses without response contents', async () => {
  for (const [response, code] of [
    [{ok:false,status:401,headers:new Headers()}, 'GOOGLE_OAUTH_401'],
    [{ok:true,json:async()=>{throw new SyntaxError('private body')}}, 'GOOGLE_OAUTH_RESPONSE_INVALID'],
  ]) {
    let attempts=0;
    await assert.rejects(()=>requestOAuthToken('https://oauth.invalid/private',{}, {fetchImpl:async()=>{attempts++;return response;},sleep:async()=>{throw new Error('must not retry')}}), e=>e.message===code);
    assert.equal(attempts,1);
  }
  await assert.rejects(()=>getAccessToken({private_key:'private invalid key'}), /^Error: GOOGLE_OAUTH_CREDENTIALS_INVALID$/);
});
