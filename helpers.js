const fs = require("fs");

const createPath = (path) => {
  fs.existsSync(path) || fs.mkdirSync(path);
};

const event = (
  state = 0,
  subState = 0,
  eventType = 0,
  flag = true,
  value = 0
) => {
  console.log(
    `sw_update_state.(${state},${subState},${eventType}).${
      flag ? "flag" : "value"
    } = ${value}`
  );
};

exports.createPath = createPath;
exports.event = event;
