class SuccessResponse {
  static success(res, data, status = 201) {
    res.status(status);
    if (data && data.docs) {
      return res.json({
        status: 'success',
        data: data.docs,
        total: data.totalDocs,
        limit: data.limit,
        page: data.page,
        pages: data.totalPages,
      });
    }
    return res.json({
      status: 'success',
      data: data,
    });
  }
}

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ErrorResponse, SuccessResponse };
