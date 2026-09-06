import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=html.slice(html.indexOf('const withdrawalReference ='),html.indexOf('const initializeWithdrawalHistory ='));
const reference=vm.runInNewContext(source+'withdrawalReference;');
test('known-only reference is numeric even when the conservative source rate is null',()=>{
 const r=reference({denominator:100,cohortCount:2,count:3,missingEntry:0,rate:null},120);
 assert.equal(r.rate,2);assert.equal(r.basis,'month-start');assert.equal(r.numerator,2);
});
test('past months use an explicitly distinct snapshot denominator, never an invented month-start count',()=>{
 const r=reference({denominator:null,cohortCount:5,count:5,missingEntry:0},188);
 assert.equal(r.rate,2.66);assert.equal(r.basis,'snapshot');assert.equal(r.denominator,188);
 assert.equal(reference({denominator:100,cohortCount:0,count:1,missingEntry:1},200).rate,0.5);
});
test('known zero displays zero, but an absent or zero denominator never divides by zero',()=>{
 assert.equal(reference({denominator:100,cohortCount:0,count:0,missingEntry:0},120).rate,0);
 assert.equal(reference({denominator:null,count:1},0).rate,null);
 assert.equal(reference({denominator:null,count:1},undefined).rate,null);
});
