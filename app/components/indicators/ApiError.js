import Message from '../../components/messages/Message';

const ApiError = (error) => Message.show(`Error #${error.code || '000'}: ${error.message || 'asda'}`, 'error');

export default ApiError;
