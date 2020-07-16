const { expect } = require('chai');
const db = require('../index');

const User = db.model('user');

describe('User Model', () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let grace;

      beforeEach(async () => {
        grace = await User.create({
          email: 'grace@doesmagic.com',
          password: 'mikeIsCute',
        });
      });

      it('returns true if the password is correct', () => {
        expect(grace.correctPassword('mikeIsCute')).to.be.equal(true);
      });

      it('returns false if the password is incorrect', () => {
        expect(grace.correctPassword('iLoveMyNeighbors')).to.be.equal(false);
      });
    }); // end describe 'correctPassword'
  }); // end describe 'instanceMethods'
}); // end describe 'User Model'
