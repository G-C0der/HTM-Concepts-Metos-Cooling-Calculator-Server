import {AuditLog, User} from "./index";

User.hasMany(AuditLog, { as: 'operatorLogs', foreignKey: 'operatorId' });
AuditLog.belongsTo(User, { as: 'operator', foreignKey: 'operatorId' });

User.hasMany(AuditLog, { as: 'userLogs', foreignKey: 'userId' });
AuditLog.belongsTo(User, { as: 'user', foreignKey: 'userId' });
