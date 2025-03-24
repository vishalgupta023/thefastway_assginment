import vine from '@vinejs/vine';

export const registerValidator = vine.compile(
  vine
    .object({
      name: vine.string().trim().minLength(3),
      email: vine.string().trim().email(),
      upi_id: vine
        .string()
        .trim()
        .minLength(6)
        .regex(/@fastway\.in$/),
      password: vine.string().trim().minLength(6),
    })
);

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6),
  })
);

export const addFundsValidator = vine.compile(
  vine.object({
    amount: vine.number().positive(),
  })
);

