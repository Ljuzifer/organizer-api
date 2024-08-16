const Task = require("../models/task");
const { HttpError, ControllerWrap } = require("../helpers");

async function getAll(req, res, __) {
    const { _id: owner } = req.user;
    const { page = 0, limit = 0 } = req.query;

    const skip = (page - 1) * limit;
    const query = { owner };

    const answer = await Task.find(query, "-createdAt -updatedAt -__v", {
        skip,
        limit,
    })
        .populate("owner")
        .exec();

    res.status(200).json(answer);
}

async function postTask(req, res, __) {
    const { body } = req;
    const { _id: owner } = req.user;

    const answer = await Task.create({ ...body, owner });

    return res.status(201).json(answer);
}

async function deleteTask(req, res, __) {
    const { taskId } = req.params;
    const answer = await Task.findByIdAndDelete(taskId);

    if (!answer) {
        throw HttpError(404, "Not found");
    }

    res.status(200, "Delete success!").json(answer);
}

async function patchTask(req, res, __) {
    const { taskId } = req.params;
    const { completed } = req.body;

    const answer = await Task.findByIdAndUpdate(
        taskId,
        { completed: !completed },
        { new: true }
    ).exec();

    if (!answer) {
        throw HttpError(404, "Not found");
    }

    res.json(answer);
}

module.exports = {
    getAll: ControllerWrap(getAll),
    // getById: ControllerWrap(getById),
    postTask: ControllerWrap(postTask),
    deleteTask: ControllerWrap(deleteTask),
    // putItem: ControllerWrap(putItem),
    patchTask: ControllerWrap(patchTask),
};
