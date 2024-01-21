import { Intent, OverlayToaster, Position } from '@blueprintjs/core';

function Message() {
  let toaster: OverlayToaster | null;

  return {
    render() {
      return (
        <OverlayToaster
          position={Position.BOTTOM_RIGHT}
          ref={(ref) => (toaster = ref)}
        />
      );
    },
    show(text: string, type: string) {
      toaster?.show({
        message: text,
        intent: type === 'error' ? Intent.DANGER : Intent.SUCCESS,
      });
    },
  };
}

export default Message();
