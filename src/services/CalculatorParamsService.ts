import {CalculatorParams} from "../models";
import {ParamsSaveAction, ParamsDeleteAction} from "./AuditLogService";
import {auditLogService} from "./index";
import {getChangedProperties} from "../utils";
import {Op} from "sequelize";

class CalculatorParamsService {
  create = async (
    createActionType: ParamsSaveAction,
    createData: Partial<CalculatorParams>,
    operatorId: number
  )=> {
    // Create params
    const newParams = await CalculatorParams.create({ ...createData, userId: operatorId });
    const { dataValues: newData } = newParams;

    // Set params in use
    await this.setInUse(newParams.name, newParams.userId);

    // Log creation
    await auditLogService.log(createActionType, operatorId, operatorId, {}, newData, newData.id);
  };

  update = async (
    updateActionType: ParamsSaveAction,
    params: CalculatorParams,
    updateData: Partial<CalculatorParams>,
    operatorId: number
  )=> {
    // Check if name already exists on other record for same user
    const paramsWithSameName = await CalculatorParams.findOne({ where: {
      userId: params.userId,
      id: { [Op.ne]: params.id },
      name: updateData.name
    } });
    if (paramsWithSameName) throw new Error('Params with same name already exist for the specified user.');

    // Set old data to buffer
    const { dataValues: { ...oldData } } = params;

    // Update params
    for (const [fieldKey, fieldVal] of Object.entries(updateData)) {
      (params as any)[fieldKey] = fieldVal;
    }
    const updatedParams = await params.save();

    // Set params in use
    await this.setInUse(updatedParams.name, updatedParams.userId);

    // Prepare loggable before and after data
    const { dataValues: newData } = updatedParams;
    const { oldData: loggableOldData, newData: loggableNewData } =
      getChangedProperties<Partial<CalculatorParams>>(oldData, newData);

    // Log update
    const wasParamsUpdated = !!Object.keys(loggableNewData).length;
    if (wasParamsUpdated) await auditLogService.log(
      updateActionType, operatorId, operatorId, loggableOldData, loggableNewData, newData.id
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
    const { dataValues: { ...oldData } } = params;

    // Delete params
    await params.update({ inUse: false });
    await params.destroy();

    // Log deletion
    await auditLogService.log(deleteActionType, operatorId, operatorId, oldData, {}, oldData.id);
  };

  private setInUse = async (name: string, userId: number) => {
    // Clear params in use
    await this.clearInUse(userId);

    // Set in use
    await CalculatorParams.update({ inUse: true }, { where: { name, userId } });
  };

  clearInUse = async (userId: number) =>
    await CalculatorParams.update({ inUse: false }, { where: { userId } });
}

export default new CalculatorParamsService();