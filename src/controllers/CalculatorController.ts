import { Request, Response, NextFunction } from 'express';
import {serverError} from "../constants";
import {CalculatorParams} from "../models";
import {toEditableCalculatorParamsFields} from "../utils";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name } = req.body;

    const existingParams = await CalculatorParams.findOne({ where: {
      userId,
      name
    } });

    if (existingParams) {
      await existingParams.update(toEditableCalculatorParamsFields(req.body));

      return res.status(200).send('Calculator params update succeeded.');
    } else {
      await CalculatorParams.create({ ...req.body, userId });

      return res.status(200).send('Calculator params save succeeded.');
    }
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calculatorParamsList = await CalculatorParams.findAll({
      where: {
        userId: req.user!.id
      },
      attributes: { exclude: ['userId'] }
    });

    res.status(200).json({
      calculatorParamsList
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
}

export {
  save,
  list
};