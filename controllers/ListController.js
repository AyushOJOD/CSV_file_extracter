import { List } from "../models/ListModel.js";

export const createList = async (req, res) => {
  try {
    const list = new List(req.body);
    await list.save();
    res.status(201).send(list);
  } catch (error) {
    res.status(400).send(error);
  }
};
