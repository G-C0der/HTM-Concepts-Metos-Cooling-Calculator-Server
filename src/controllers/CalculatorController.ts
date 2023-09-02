import { Request, Response, NextFunction } from 'express';
import {serverError} from "../constants";
import {CalculatorParams} from "../models";
import {toEditableCalculatorParamsFields} from "../utils";
import calculatorParamsService from "../services/CalculatorParamsService";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name, id } = req.body;

    const existingParams = id
      ? await CalculatorParams.findByPk(id)
      : await CalculatorParams.findOne({ where: {
        userId,
        name
      } });

    if (existingParams) {
      await existingParams.update(toEditableCalculatorParamsFields(req.body));
      await calculatorParamsService.setInUse(existingParams);

      return res.status(200).send('Calculator params update succeeded.');
    } else {
      const params = await CalculatorParams.create({ ...req.body, userId });
      await calculatorParamsService.setInUse(params);

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

    await CalculatorParams.destroy({ where: { id } });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  save,
  list,
  fetch,
  remove
};