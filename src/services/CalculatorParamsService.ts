import {CalculatorParams} from "../models";

class CalculatorParamsService {
  setInUse = async (params: CalculatorParams) => {
    const { userId } = params;

    // Clear params in use
    await CalculatorParams.update({ inUse: false }, { where: { userId } });

    // Set in use
    await params?.update({ inUse: true });
  }
}

export default new CalculatorParamsService();