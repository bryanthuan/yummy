module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "no-unused-vars":[1, { "argsIgnorePattern": "res|next|^err" }],
        "func-names": 0,
        "no-underscore-dangle": 0,
        "no-console": 0
    }
};