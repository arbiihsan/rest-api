const Joi = require('joi');

// create user validation
const createUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

// update user validation
const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please provide a valid email'
    }),
  password: Joi.string()
    .min(6)
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    })
}).min(1); 

// login validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

// req body validation
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  validateCreateUser: validate(createUserSchema),
  validateUpdateUser: validate(updateUserSchema),
  validateLogin: validate(loginSchema)
};
