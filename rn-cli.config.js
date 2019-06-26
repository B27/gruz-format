const blacklist = require('metro-config/src/defaults/blacklist');

// blacklist is a function that takes an array of regexes and combines
// them with the default blacklist to return a single regex.
// необходим для того, чтобы gradle не конфликтовал с metro bundler в windows

module.exports = {
    resolver: {
        blacklistRE: blacklist([/android\/.*/])
    }
};
