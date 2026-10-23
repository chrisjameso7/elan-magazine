import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isHeadAdmin, headAdminOnly } from '../src/collections/access';
import { Articles } from '../src/collections/Articles';
import { Authors } from '../src/collections/Authors';
import { Users } from '../src/collections/Users';
test('only configured head admin can manage content, accounts, and enter admin', async () => {
 const before=process.env.ELAN_HEAD_ADMIN_EMAIL;process.env.ELAN_HEAD_ADMIN_EMAIL='owner@example.com';
 try{
  assert.equal(isHeadAdmin({email:'OWNER@example.com'}),true);
  for(const user of [null,{email:'editor@example.com'}]){
   assert.equal(isHeadAdmin(user),false);
   for(const collection of [Articles,Authors,Users])for(const action of ['create','update','delete'] as const)assert.equal(await collection.access![action]!({req:{user}} as never),false);
   assert.equal(await Users.access!.admin!({req:{user}} as never),false);
  }
  assert.equal(await headAdminOnly({req:{user:{email:'owner@example.com'}}} as never),true);
  delete process.env.ELAN_HEAD_ADMIN_EMAIL;
  assert.equal(isHeadAdmin({email:'owner@example.com'}),false);
 }finally{if(before===undefined)delete process.env.ELAN_HEAD_ADMIN_EMAIL;else process.env.ELAN_HEAD_ADMIN_EMAIL=before;}
});
