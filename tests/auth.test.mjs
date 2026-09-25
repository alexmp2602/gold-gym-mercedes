import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url), folder=mkdtempSync(join(tmpdir(),'gold-auth-'));
function compile(file,name,pairs){let source=readFileSync(file,'utf8');for(const [a,b] of pairs)source=source.replaceAll(a,b);writeFileSync(join(folder,name+'.mjs'),ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText);}
writeFileSync(join(folder,'mock.mjs'), `export let configured=true, allowed=true, failed=false, signedIn=true, calls=[];
export function state(s={}){configured=s.configured??true;allowed=s.allowed??true;failed=s.failed??false;signedIn=s.signedIn??true;calls=[]}
export const authConfigured=()=>configured;
export const allowAuthAttempt=async()=>allowed;
export const env={};export const supportsSitesIdentity=false;export const ownerAccount=()=>false;export const independentUserId=async()=>null;export const getChatGPTUser=async()=>null;
export const authClient=async()=>({auth:{
 signInWithPassword:async()=>({error:failed?{}:null}),
 signUp:async input=>{calls.push(['signup',input]);return {error:null}},
 resetPasswordForEmail:async()=>({error:failed?{}:null}),
 getUser:async()=>({data:{user:signedIn?{id:'user'}:null},error:null}),
 updateUser:async()=>{calls.push(['password']);return {error:null}},
 signOut:async input=>{calls.push(['logout',input]);return {error:null}}
}});`);
compile('lib/auth/config.ts','config',[]);
compile('lib/server.ts','server',[['@club/runtime','./mock.mjs'],['@/app/chatgpt-auth','./mock.mjs']]);
compile('app/api/auth/route.ts','route',[["'zod'",JSON.stringify(pathToFileURL(require.resolve('zod')).href)],["import { authConfigured, safeReturnTo } from '@/lib/auth/config';","import { authConfigured } from './mock.mjs'; import { safeReturnTo } from './config.mjs';"],['@/lib/auth/client','./mock.mjs'],['@/lib/auth/rate-limit','./mock.mjs'],['@/lib/server','./server.mjs']]);
const mock=await import(pathToFileURL(join(folder,'mock.mjs'))), api=await import(pathToFileURL(join(folder,'route.mjs')));
const previous=process.env.APP_URL;process.env.APP_URL='https://club.example';
async function call(payload,origin='https://club.example') {const r=await api.POST(new Request('https://club.example/api/auth',{method:'POST',headers:{'content-type':'application/json',...(origin?{origin}:{})},body:JSON.stringify(payload)}));return {status:r.status,...await r.json(),cache:r.headers.get('cache-control')};}
const login={action:'login',email:'test@example.test',password:'test-password-123'};
try{
 await test('Own authentication request boundary',async t=>{
  await t.test('Missing configuration keeps access closed',async()=>{mock.state({configured:false});assert.equal((await call(login)).status,503)});
  await t.test('Cross-origin and missing-origin auth requests are rejected',async()=>{mock.state();for(const origin of [null,'https://other.example'])assert.equal((await call(login,origin)).status,403)});
  await t.test('Invalid credentials and rate limits do not leak account details',async()=>{mock.state({failed:true});assert.equal((await call(login)).status,401);mock.state({allowed:false});assert.equal((await call(login)).status,429)});
  await t.test('Login rejects external return destinations and disables cache',async()=>{mock.state();const r=await call({...login,returnTo:'//other.example'});assert.equal(r.next,'/gestion');assert.match(r.cache,/no-store/)});
  await t.test('Registration sends no role metadata',async()=>{mock.state();assert.equal((await call({...login,action:'signup',role:'owner'})).status,200);const input=mock.calls[0][1];assert.equal(input.options.data,undefined);assert.equal(input.options.emailRedirectTo,'https://club.example/auth/callback?next=%2Fcuenta')});
  await t.test('Recovery answer does not disclose existence or delivery outcome',async()=>{mock.state();const a=await call({action:'recover',email:login.email});mock.state({failed:true});const b=await call({action:'recover',email:login.email});assert.equal(a.message,b.message)});
  await t.test('Password changes require a session and sign out all sessions',async()=>{mock.state({signedIn:false});assert.equal((await call({action:'password',password:login.password})).status,401);mock.state();assert.equal((await call({action:'password',password:login.password})).status,200);assert.deepEqual(mock.calls,[['password'],['logout',{scope:'global'}]])});
  await t.test('Logout closes the current session',async()=>{mock.state();const r=await call({action:'logout'});assert.equal(r.next,'/acceso');assert.deepEqual(mock.calls,[['logout',{scope:'local'}]])});
 });
}finally{if(previous===undefined)delete process.env.APP_URL;else process.env.APP_URL=previous;rmSync(folder,{recursive:true,force:true});}
