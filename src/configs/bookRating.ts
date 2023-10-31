export default {
  relation: {
    member: {
      select: {
        user: {
          select: {
            name: true,
          },
        },
      },
    },
  },
  create: {
    beforeExecute: async (req: any, res: any) => {
      return {
        ...req.body,
        member_id: JSON.parse(req.headers.authorization).id,
      };
    },
  },
  update: {
    beforeExecute: async (req: any, res: any) => {
      return {
        ...req.body,
        member_id: JSON.parse(req.headers.authorization).id,
      };
    },
  },
  list: {
    filterable: ["book_id"]
  }
};
