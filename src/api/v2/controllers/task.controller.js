import requestService from '../services/request.service.js';
import { SuccessResponse } from '../helpers/response.js';
import metadataService from '../services/metadata.Service.js';
import sendService from '../services/send.service.js';
import requestParser from '../helpers/requestParser.js';

// task mgmt
export default {
  tasks: {
    /**
     * query: 'ref': 'user' || null
     * body: 'to' 'title' 'reference' 'text' 'attachment'
     */
    send: async (req, res, next) => {
      !req.metaDataStatus
        ? false
        : Object.assign(data, {
            'metaData.status': 'completed',
          });
      try {
        let data = requestParser.parseRequest(req);
        data.onModel = req.query.ref === 'user' ? 'User' : 'Department';
        let result = await requestService.createRequest(data, req.user);
        req.io.emit('task', result);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'requestId'
     */
    getOne: async (req, res, next) => {
      try {
        let result = await requestService.getRequest({
          _id: req.params.requestId,
        });
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * query 'ref': 'sent' || 'receicived'
     */
    getAll: async (req, res, next) => {
      let data1 = {};
      let data2 = {};
      let data = [];
      if (req.user.role == 'Admin' || req.user.role == 'Registry') {
        data1.to = req.user.department;
        data2.from = req.user.department;
        data1._to = true;
      } else {
        data1 = {
          'metaData.forward': req.user._id,
          to: req.user.department,
          _to: true,
        };
        data2 = { 'metaData.forward': req.user._id, from: req.user.department };
      }
      let data3 = { to: req.user._id };
      let data4 = { from: req.user._id };
      data =
        req.query.ref === 'sent'
          ? [data2]
          : req.query.ref === 'received'
          ? [data1]
          : [data1, data2, data3, data4];
      try {
        let result = await requestService.getMyRequest(data);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'requsetId'
     */
    remove: async (req, res, next) => {
      // NEW
      try {
        let result = await requestService.deleteRequest(
          req.params.requestId,
          req.user._id
        );
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'requestId'
     * body: 'note'
     * query: 'ref=user' || null // usertask or department task
     */
    broadcast: async (req, res, next) => {
      // NEW
      try {
        if (req.user.role !== 'Registry')
          throw new ErrorResponse('not a registry account', 400);
        let userRequset = req.query.ref === 'user' ? true : false;

        let result = await requestService.broadcast(
          req.params.requestId,
          req.user,
          req.body.note,
          userRequset
        );
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
  },
  logs: {
    get: async (req, res, next) => {
      try {
        let query = { 'metaData.status': 'Completed' };
        let result = await requestService.getAllRequests(query);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    add: async (req, res, next) => {
      try {
        req.metaDataStatus = true;
        this.tasks.send(req, res, next);
      } catch (error) {
        next(error);
      }
    },
  },
  metaData: {
    /**
     * params: 'userId'
     * params: 'requsetId'
     */
    forwardRequest: async (req, res, next) => {
      try {
        let data = requestParser.parseMetadata(req);
        let result = await metadataService.forwardRequest(data);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'requsetId'
     */
    seen: async (req, res, next) => {
      try {
        let data = requestParser.parseMetadata(req);
        let result = await metadataService.seen(data);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'requsetId'
     * body: 'comment'
     */
    minute: async (req, res, next) => {
      try {
        let data = requestParser.parseMetadata(req);
        let result = await metadataService.minute(data);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'requsetId'
     * params: 'status' type: 'progress', 'pending', 'completed'
     */
    status: async (req, res, next) => {
      try {
        let data = requestParser.parseMetadata(req);
        let result = await metadataService.status(data);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'requsetId'
     */
    approveRequest: async (req, res, next) => {
      try {
        if (req.user.role !== 'Registry')
          throw new ErrorResponse('not a registry account', 400);
        let id = req.params.requestId;

        let result = await requestService.approveRequest(id);
        req.io.emit('task', result);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
  },
  support: {
    /**
     * body: 'title' 'reference' 'text'
     */
    send: async (req, res, next) => {
      try {
        let data = requestParser.parseRequest(req);
        data._to = true;

        let result = await requestService.supportMail(data);
        req.io.emit('support', result);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
  },
  convo: {
    get: async (req, res, next) => {
      try {
        let result = await sendService.getConversations(req.user._id);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * params: 'convoId'
     */
    getMessages: async (req, res, next) => {
      try {
        let result = await sendService.getMessages(req.params.convoId);
        SuccessResponse.success(res, result);
      } catch (error) {
        next(error);
      }
    },
    /**
     * body: 'to' 'text' 'attachment'
     */
    personal: {
      send: async (req, res, next) => {
        try {
          let data = requestParser.parseRequest(req);
          let result = await sendService.create(data);
          req.io.emit('convo', result);
          SuccessResponse.success(res, result);
        } catch (error) {
          next(error);
        }
      },
    },
    group: {
      /**
       * body: 'to[] 'alias'
       */
      createGroup: async (req, res, next) => {
        try {
          let data = requestParser.parseRequest(req);
          let result = await sendService.createGroup(data);
          SuccessResponse.success(res, result);
        } catch (error) {
          next(error);
        }
      },
      /**
       * body: 'attachment' ''
       * params: groupConvoId
       */
      send: async (req, res, next) => {
        try {
          let data = requestParser.parseRequest(req);
          let result = await sendService.sendGroup(
            data,
            req.params.groupConvoId
          );
          req.io.emit('group', result);
          SuccessResponse.success(res, result);
        } catch (error) {
          next(error);
        }
      },
      /**
       * params: 'convoId'
       */
      renameGroup: async (req, res, next) => {
        try {
          let result = await sendService.renameGroup(
            req.params.convoId,
            req.body.name
          );
          req.io.emit('group', result);
          SuccessResponse.success(res, result);
        } catch (error) {
          next(error);
        }
      },
      /**
       * params: 'convoId'
       * params: 'userId'
       */
      addUserToGroup: async (req, res, next) => {
        try {
          let result = await sendService.addToGroup(
            req.params.convoId,
            req.params.userId
          );
          req.io.emit('group', result);
          SuccessResponse.success(res, result);
        } catch (error) {
          next(error);
        }
      },
      /**
       * params: 'convoId'
       */
      removeFromGroup: async (req, res, next) => {
        try {
          let result = await sendService.removeFromGroup(
            req.params.convoId,
            req.body.userId
          );
          req.io.emit('group', result);
          SuccessResponse.success(res, result);
        } catch (error) {
          next(error);
        }
      },
      /**
       * params: 'convoId'
       */
      leaveGroup: async (req, res, next) => {
        try {
          let result = await sendService.removeFromGroup(
            req.params.convoId,
            req.user._id
          );
          req.io.emit('group', result);
          SuccessResponse.success(res, result);
        } catch (error) {
          next(error);
        }
      },
    },
  },
};
