import {CalculatorParams} from "../models";

class CalculatorParamsService {
  setInUse = async (params: CalculatorParams) => {
    const { userId } = params;

    // Clear params in use
    const paramsInUse = await CalculatorParams.findOne({ where: {
      userId,
      inUse: true
    } });
    if (paramsInUse?.id === params.id) return; // Return if desired params already in use
    if (paramsInUse) await paramsInUse.update({ inUse: false });

    // Set in use
    await params?.update({ inUse: true });
  }
}

export default new CalculatorParamsService();