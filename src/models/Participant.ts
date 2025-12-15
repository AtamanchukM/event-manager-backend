import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database";

export class Participant extends Model {
    declare id: number;
    declare eventId: number;
    declare userId: number;
}

Participant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Participant",
    tableName: "participants",
    timestamps: true,
  }
);