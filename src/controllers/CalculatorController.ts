import { Request, Response, NextFunction } from 'express';
import {serverError} from "../constants";
import {CalculatorParams, User} from "../models";
import {toEditableCalculatorParamsFields} from "../utils";
import {calculatorParamsService} from "../services";
import {ValidationError} from "sequelize";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name, id } = req.body;

    if (!name.trim()) return res.status(400).send('Name invalid.');

    const existingParams = id
      ? await CalculatorParams.findByPk(id)
      : await CalculatorParams.findOne({ where: {
        userId,
        name
      } });

    try {
      if (existingParams) {
        const updatedParams = await calculatorParamsService.update(
          'save',
          existingParams,
          toEditableCalculatorParamsFields(req.body),
          userId
        );
        if (updatedParams === false) return res.status(400).json({
          message: 'Parameters with same name already exist for this user account.',
          severity: 'error'
        });

        return res.status(200).json({
          calculatorParams: updatedParams
        });
      } else {
        await calculatorParamsService.create('save', { ...req.body, userId }, userId);

        return res.status(200).send('Calculator params save succeeded.');
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).send('Invalid kettles.');
      }
    }
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { query: { resetParams } } = req;
    const exclude = ['userId'];
    if (resetParams === 'true') await calculatorParamsService.clearInUse(userId); // Clear inUse
    else if (!resetParams) exclude.push('inUse'); // If reset params not specified, don't include inUse in the payload

    const calculatorParamsList = await CalculatorParams.findAll({
      where: { userId },
      attributes: { exclude },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      calculatorParamsList
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const fetch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.user!;

    const calculatorParams = await CalculatorParams.findOne({ where: {
      userId,
      inUse: true
    } });

    if (!calculatorParams) return res.status(204).end();

    res.status(200).json({
      calculatorParams
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user!;

    await calculatorParamsService.delete('delete', +id, userId);

    res.status(200).send('Calculator params deletion succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const listAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allCalculatorParamsList = await CalculatorParams.findAll({
      attributes: { exclude: ['inUse'] },
      include: [{
        model: User,
        as: 'user',
        attributes: ['company', 'fname', 'lname']
      }],
      order: [
        ['user', 'company', 'ASC'],
        ['user', 'fname', 'ASC'],
        ['user', 'lname', 'ASC'],
        ['name', 'ASC']
      ]
    });

    res.status(200).json({
      allCalculatorParamsList
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
}

export {
  save,
  list,
  fetch,
  remove,
  listAll
};
