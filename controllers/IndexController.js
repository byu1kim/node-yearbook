const RequestService = require("../services/RequestService");

exports.Index = (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  console.log(reqInfo);
  res.render("index", {
    reqInfo: reqInfo,
  });
};

exports.Secure = (req, res) => {
  let reqInfo = RequestService.reqHelper(req);
  res.render("secure", {
    reqInfo: reqInfo,
  });
};
