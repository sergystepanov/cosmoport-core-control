import Message from '../../components/messages/Message';

export interface Error {
  code: string;
  message: string;
}

export default function ApiError(error: Error) {
  return Message.show(
    `Error #${error.code || '000'}: ${error.message || 'No message'}`,
    'error',
  );
}
