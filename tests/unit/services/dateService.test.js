const dateService = require('../../../services/dateService');

describe('dateService', () => {
  describe('isFall', () => {
    test('returns true when date is in july', () => {
      expect(dateService.isFall(new Date(2020, 6, 20))).toBeTruthy();
    });
    test('returns false when date is in june', () => {
      expect(dateService.isFall(new Date(2020, 5, 20))).toBeFalsy();
    });
  });

  describe('getFallAndSpringYears', () => {
    test('returns correct when date is in july', () => {
      const string = dateService.getFallAndSpringYears(new Date(2020, 6, 20));
      expect(string).toEqual('(Syksy-20 tai Kevät-20)');
    });
    test('returns correct when date is in june', () => {
      const string = dateService.getFallAndSpringYears(new Date(2020, 5, 20));
      expect(string).toEqual('(Kevät-20 tai Syksy-19)');
    });
  });
});
