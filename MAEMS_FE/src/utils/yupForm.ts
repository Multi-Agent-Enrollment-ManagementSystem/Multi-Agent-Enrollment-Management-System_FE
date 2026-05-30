import * as Yup from "yup";
import type { Rule } from "antd/es/form";

/** Chuyển schema Yup thành rule Ant Design Form (async validator). */
export function createYupAntdRule(schema: Yup.Schema): Rule {
  return {
    async validator(_, value) {
      try {
        await schema.validate(value);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          throw new Error(err.message);
        }
        throw err;
      }
    },
  };
}
