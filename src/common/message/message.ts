export const Message = {
    user: {
        create: {
          success: 'message.createUserSuccessfully',
          failed: 'message.createUserFailed',
        },
        find: {
          byId: {
            success: 'message.getUserByIdSuccessfully',
            failed: 'message.findUserByIdFailed',
          },
        },
        getAll: 'message.getAllUsersSuccessfully',
        update: {
          success: 'message.updateUserByIdSuccessfully',
          failed: 'message.updateUserFailed',
        },
        delete: {
          success: 'message.deleteUserByIdSuccessfully',
          failed: 'message.deleteUserByIdFailed',
        },
    },

    topic: {
      create: {
        success: 'message.createTopicSuccessfully',
        failed: 'message.createTopicFailed',
      },
      find: {
        byId: {
          success: 'message.getTopicByIdSuccessfully',
          failed: 'message.findTopicByIdFailed',
        },
      },
      getAll: 'message.getAllTopicsSuccessfully',
      update: {
        success: 'message.updateTopicByIdSuccessfully',
        failed: 'message.updateTopicFailed',
      },
      delete: {
        success: 'message.deleteTopicByIdSuccessfully',
        failed: 'message.deleteTopicByIdFailed',
      },

      orderExists: 'message.orderExists',
      topicChildrenExists: 'message.topicChildrenExists',
      topicIsRoot: 'message.topicIsRoot'
  },

    order: {
        create: {
          success: 'message.createOrderSuccessfully',
          failed: 'message.createOrderFailed',
        },
        find: {
          byId: {
            success: 'message.getOrderByIdSuccessfully',
            failed: 'message.findOrderByIdFailed',
          },

          byTopicId: {
            success: 'message.getOrderByTopicIdSuccessfully',
            failed: 'message.findOrderByTopicIdFailed',
          },
        },
        getAll: 'message.getAllOrdersSuccessfully',
        update: {
          success: 'message.updateOrderByIdSuccessfully',
          failed: 'message.updateOrderFailed',
        },
        delete: {
          success: 'message.deleteOrderByIdSuccessfully',
          failed: 'message.deleteOrderByIdFailed',
        },

        
    },

    orderProduct: {
        create: {
          success: 'message.createOrderProductSuccessfully',
          failed: 'message.createOrderProductFailed',
        },
        find: {
          byId: {
            success: 'message.getOrderProductByIdSuccessfully',
            failed: 'message.findOrderProductByIdFailed',
          },
        },
        getAll: 'message.getAllOrderProductsSuccessfully',
        update: {
          success: 'message.updateOrderProductByIdSuccessfully',
          failed: 'message.updateOrderProductFailed',
        },
        delete: {
          success: 'message.deleteOrderProductByIdSuccessfully',
          failed: 'message.deleteOrderProductByIdFailed',
        },
    },
}