import {AuditLog, User} from "./index";

User.hasMany(AuditLog, { foreignKey: 'operator' });
AuditLog.belongsTo(User, { foreignKey: 'operator' });

User.hasMany(AuditLog, { foreignKey: 'user' });
AuditLog.belongsTo(User, { foreignKey: 'user' });
