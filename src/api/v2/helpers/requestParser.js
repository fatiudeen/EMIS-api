export default {
  parseRequest: (req) => {
    let data = {};
    let path = [];

    if (req.files) {
      req.files.map((file) => {
        path.push(file.path);
      });
    }
    req.body.alias ? (data.alias = req.body.alias) : false;
    req.body.to ? (data.to = req.body.to) : false;
    req.body.reference ? (data.reference = req.body.reference) : false;
    req.body.title ? (data.title = req.body.title) : false;
    data.from = req.user._id;
    data.message = {
      body: req.body.text,
      attachment: path,
    };
    return data;
  },
  parseMetadata: (req) => {
    let data = {};
    req.body.comment ? (data.comment = req.body.comment) : false;
    data.user = req.user;
    req.params.userId ? (data.id = req.params.userId) : false;
    data.requestId = req.params.requestId;
    req.params.status ? (data.status = req.params.status) : false;

    return data;
  },
};
