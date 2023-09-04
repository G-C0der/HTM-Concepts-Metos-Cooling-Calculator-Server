import {CalculatorParams} from "../models";
import {ParamsCreateAction, ParamsDeleteAction, ParamsUpdateAction} from "./AuditLogService";
import {auditLogService} from "./index";
import {getChangedProperties} from "../utils";

class CalculatorParamsService {
  create = async (
    createActionType: ParamsCreateAction,
    createData: Partial<CalculatorParams>,
    operatorId: number
  )=> {
    // Create params
    const { dataValues: newParams } = await CalculatorParams.create({ ...createData, userId: operatorId });

    // Set params in use
    await this.setInUse(newParams);

    // Log creation
    await auditLogService.log(createActionType, operatorId, operatorId, {}, newParams, newParams.id);
  };

  update = async (
    updateActionType: ParamsUpdateAction,
    params: CalculatorParams,
    updateData: Partial<CalculatorParams>,
    operatorId: number
  )=> {
    // Set old data to buffer
    const { dataValues: oldData } = params;

    // Update params
    for (const [fieldKey, fieldVal] of Object.entries(updateData)) {
      (params as any)[fieldKey] = fieldVal;
    }
    const updatedParams = await params.save();

    // Set params in use
    await this.setInUse(updatedParams);

    // Prepare loggable before and after data
    const { dataValues: newData } = updatedParams;
    const { oldData: loggableOldData, newData: loggableNewData }
      = getChangedProperties<Partial<CalculatorParams>>(oldData, newData);

    // Log update
    const wasParamsUpdated = !!Object.keys(loggableNewData).length;
    if (wasParamsUpdated) await auditLogService.log(
      updateActionType, operatorId, operatorId, loggableOldData, loggableNewData, loggableNewData.id
    );
  };

  delete = async (
    deleteActionType: ParamsDeleteAction,
    id: typeof CalculatorParams.prototype.id,
    operatorId: number
  )=> {
    // Query old data
    const params = await CalculatorParams.findByPk(id);
    if (!params) return false;
    const { dataValues: oldData } = params;

    // Delete params
    await params.destroy();

    // Log deletion
    await auditLogService.log(deleteActionType, operatorId, operatorId, oldData, {}, oldData.id);
  };

  setInUse = async (params: CalculatorParams) => {
    const { userId } = params;

    // Clear params in use
    await CalculatorParams.update({ inUse: false }, { where: { userId } });

    // Set in use
    await params?.update({ inUse: true });
  };
}

export default new CalculatorParamsService();