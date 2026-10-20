import assert from 'node:assert/strict';

// Contract: ordinary data records, without observable getters or proxies.
function baseline(user) {
  if (user !== null && user !== undefined && user.isActive === true) {
    if (user.role === 'admin' || user.role === 'superadmin') return true;
  }
  return false;
}

function defective(user) {
  return user?.isActive && ['admin', 'superadmin'].includes(user.role);
}

const ADMIN_ROLES = ['admin', 'superadmin'];
function corrected(user) {
  return user?.isActive === true && ADMIN_ROLES.includes(user.role);
}

const cases = [
  [null, false],
  [undefined, false],
  [{}, false],
  [{ isActive: false, role: 'admin' }, false],
  [{ isActive: 0, role: 'admin' }, false],
  [{ isActive: 'yes', role: 'admin' }, false],
  [{ isActive: 1, role: 'superadmin' }, false],
  [{ isActive: true, role: 'admin' }, true],
  [{ isActive: true, role: 'superadmin' }, true],
  [{ isActive: true, role: 'member' }, false],
  [{ isActive: true }, false],
];

assert.equal(defective(null), undefined);
assert.equal(defective({ isActive: 'yes', role: 'admin' }), true);
assert.equal(baseline({ isActive: 'yes', role: 'admin' }), false);
for (const [input, expected] of cases) {
  assert.equal(baseline(input), expected);
  assert.equal(corrected(input), expected);
  assert.equal(typeof corrected(input), 'boolean');
}
console.log(`PASS: ${cases.length} predicate contract cases; original defects reproduced.`);
