'use strict';


module.exports = (capability) => {
  
  return (req, res, next) => {
    const utils = require('./mwModularized/utils');

    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
      case 'basic':
        return utils._authBasic(authString, capability);
      case 'bearer':
        return utils._authBearer(authString,capability);
      default:
        return utils._authError();
      }
    } catch (e) {
      utils._authError();
    }
  };
  
};