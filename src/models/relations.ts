import {AuditLog, CalculatorParams, User} from "./index";

User.hasMany(AuditLog, { as: 'operatorLogs', foreignKey: 'operatorId' });
AuditLog.belongsTo(User, { as: 'operator', foreignKey: 'operatorId' });

User.hasMany(AuditLog, { as: 'userLogs', foreignKey: 'userId' });
AuditLog.belongsTo(User, { as: 'user', foreignKey: 'userId' });

User.hasMany(CalculatorParams, { as: 'userParams', foreignKey: 'userId' });
CalculatorParams.belongsTo(User, { as: 'user', foreignKey: 'userId' });

CalculatorParams.hasMany(AuditLog, { as: 'calculatorParamsLogs', foreignKey: 'paramsId' });
AuditLog.belongsTo(CalculatorParams, { as: 'params', foreignKey: 'paramsId' });