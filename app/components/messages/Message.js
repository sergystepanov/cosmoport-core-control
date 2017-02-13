import { Position, Toaster } from "@blueprintjs/core";

export const Message = Toaster.create({
    className: "my-toaster",
    position: Position.BOTTOM_RIGHT,
});
