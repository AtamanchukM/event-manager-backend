import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database";

export class Event extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
    declare date: Date;
    declare location: string | null;
    declare maxParticipants: number ;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    timestamps: true,
  }
);