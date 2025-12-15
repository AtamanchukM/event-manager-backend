import { User } from "./User";
import { Event } from "./Event";
import { Participant } from "./Participant";

User.hasMany(Participant, { foreignKey: "userId", as: "participants" });

Participant.belongsTo(User, { foreignKey: "userId", as: "user" });

Event.hasMany(Participant, { foreignKey: "eventId", as: "participants" });

Participant.belongsTo(Event, { foreignKey: "eventId", as: "event" });
export { User, Event, Participant };
