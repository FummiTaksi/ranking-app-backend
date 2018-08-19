module.exports = {
    "extends": "airbnb-base",
    "env": {
        "es6": true,
        "node": true,
        "jest": true
    },
    "globals": {
        "test": true,
        "expect": true,
        "describe": true,
        "afterAll": true
    },
    "plugins": ["jest"],
    "rules": {
        "no-underscore-dangle": "off",
        "global-require": "off",
    },
};